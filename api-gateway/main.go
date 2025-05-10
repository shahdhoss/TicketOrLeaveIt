package main

import (
	"context"
	"encoding/json"
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
	jwtSecretKey = []byte(os.Getenv("JWT_SECRET_KEY"))              // Same secret as auth-service
)

func init() {
	rdb = redis.NewClient(&redis.Options{
		Addr:     os.Getenv("REDIS_HOST") + ":6379",
		Password: "",
		DB:       0,
	})
}

func verifyToken(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// Skip auth for login and health endpoints
		if r.URL.Path == "/auth/login" || r.URL.Path == "/health" {
			next.ServeHTTP(w, r)
			return
		}

		authHeader := r.Header.Get("Authorization")
		if authHeader == "" {
			http.Error(w, "Missing authorization header", http.StatusUnauthorized)
			return
		}

		// Extract token from "Bearer <token>"
		parts := strings.Split(authHeader, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			http.Error(w, "Invalid authorization header format", http.StatusUnauthorized)
			return
		}

		tokenString := parts[1]
		token, err := jwt.Parse(tokenString, func(token *jwt.Token) (interface{}, error) {
			if _, ok := token.Method.(*jwt.SigningMethodHMAC); !ok {
				return nil, jwt.ErrSignatureInvalid
			}
			return jwtSecretKey, nil
		})

		if err != nil {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			// Add user info to request context
			ctx := context.WithValue(r.Context(), "user", claims)
			next.ServeHTTP(w, r.WithContext(ctx))
		} else {
			http.Error(w, "Invalid token claims", http.StatusUnauthorized)
		}
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

func reverseProxy(target string) http.Handler {
	url, _ := url.Parse(target)
	proxy := httputil.NewSingleHostReverseProxy(url)

	// Modify the director to add user info header
	originalDirector := proxy.Director
	proxy.Director = func(req *http.Request) {
		originalDirector(req)

		// Get user info from context
		if user, ok := req.Context().Value("user").(jwt.MapClaims); ok {
			// Convert user claims to JSON
			userInfo, err := json.Marshal(user)
			if err == nil {
				req.Header.Set("X-User-Info", string(userInfo))
			}
		}
	}

	return proxy
}

func main() {
	r := mux.NewRouter()
	r.Use(rateLimit)
	r.Use(verifyToken)

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
