package main

import (
	"context"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/gorilla/mux"
	"github.com/redis/go-redis/v9"
	"golang.org/x/time/rate"
)

var (
	rdb          *redis.Client
	limiter      = rate.NewLimiter(rate.Every(time.Minute/100), 30) // 100 RPM
	jwtSecretKey = []byte("supersecretkey")
)

func init() {
	rdb = redis.NewClient(&redis.Options{
		Addr:     os.Getenv("REDIS_HOST") + ":6379",
		Password: "",
		DB:       0,
	})
}

func rateLimit(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := context.Background()
		clientIP := r.RemoteAddr

		// Redis rate limiting
		count, err := rdb.Incr(ctx, "rl:"+clientIP).Result()
		if err != nil {
			log.Printf("Redis error: %v", err)
			// Fallback to local limiter
			if !limiter.Allow() {
				http.Error(w, "Too Many Requests", 429)
				return
			}
		} else {
			if count == 1 {
				rdb.Expire(ctx, "rl:"+clientIP, time.Minute)
			}
			if count > 100 {
				http.Error(w, "Too Many Requests", 429)
				return
			}
		}

		next.ServeHTTP(w, r)
	})
}

func authMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Skip auth for health check and auth endpoints
		if r.URL.Path == "/health" || strings.HasPrefix(r.URL.Path, "/auth") {
			next.ServeHTTP(w, r)
			return
		}

		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Authorization header missing", http.StatusUnauthorized)
			return
		}

		tokenString := strings.TrimPrefix(authHeader, "Bearer ")
		if tokenString == authHeader {
			http.Error(w, "Bearer token missing", http.StatusUnauthorized)
			return
		}

		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}
			return jwtSecretKey, nil
		})

		if err != nil || !token.Valid {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		claims, ok := token.Claims.(jwt.MapClaims)
		if !ok {
			http.Error(w, "Invalid token claims", http.StatusUnauthorized)
			return
		}

		// Add user info to context
		ctx := context.WithValue(r.Context(), "user", claims)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func roleBasedRouting(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Skip routing logic for health check and auth endpoints
		if r.URL.Path == "/health" || strings.HasPrefix(r.URL.Path, "/auth") {
			next.ServeHTTP(w, r)
			return
		}

		user := r.Context().Value("user").(jwt.MapClaims)
		role, ok := user["role"].(string)
		if !ok {
			http.Error(w, "Invalid role in token", http.StatusForbidden)
			return
		}

		// Route based on role
		switch role {
		case "organizer", "admin":
			// Organizers/admins can ONLY access these specific prefixes
			if strings.HasPrefix(r.URL.Path, "/v1/organizers") ||
				strings.HasPrefix(r.URL.Path, "/v1/vendor") {
				next.ServeHTTP(w, r)
			} else {
				http.Error(w, "Access denied: organizer/admin role restricted to specific endpoints", http.StatusForbidden)
			}
		case "user":
			// Users can access ANYTHING except organizer/admin endpoints
			if strings.HasPrefix(r.URL.Path, "/v1/organizers") ||
				strings.HasPrefix(r.URL.Path, "/v1/vendor") {
				http.Error(w, "Access denied: users cannot access organizer/admin endpoints", http.StatusForbidden)
			} else {
				next.ServeHTTP(w, r)
			}
		default:
			http.Error(w, "Unknown role", http.StatusForbidden)
		}
	})
}
func reverseProxy(target string) http.Handler {
	url, _ := url.Parse(target)
	proxy := httputil.NewSingleHostReverseProxy(url)

	// Modify request to add original headers
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		r.Header.Set("X-Forwarded-For", r.RemoteAddr)
		proxy.ServeHTTP(w, r)
	})
}

func main() {
	r := mux.NewRouter()
	r.Use(rateLimit)
	r.Use(authMiddleware)
	r.Use(roleBasedRouting)

	r.PathPrefix("/v1/users").Handler(reverseProxy("http://user-service:8080"))
	r.PathPrefix("/v1/vendor").Handler(reverseProxy("http://vendor-service:8080"))
	r.PathPrefix("/v1/organizers").Handler(reverseProxy("http://organizers-service:8080"))
	r.PathPrefix("/v1/events").Handler(reverseProxy("http://events-service:8080"))
	r.PathPrefix("/api/payments").Handler(reverseProxy("http://payment-service:8081"))
	r.PathPrefix("/auth").Handler(reverseProxy("http://auth-service:8000"))
	r.PathPrefix("/v1/notifications").Handler(reverseProxy("http://notification-service:8083"))

	r.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("OK"))
	})

	log.Println("API Gateway running on :8080")
	http.ListenAndServe(":8080", r)
}
