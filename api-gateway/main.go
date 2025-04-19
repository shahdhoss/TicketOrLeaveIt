package main

import (
	"context"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"time"

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
	return httputil.NewSingleHostReverseProxy(url)
}

func main() {
	r := mux.NewRouter()
	r.Use(rateLimit)

	r.PathPrefix("/v1/users").Handler(reverseProxy("http://user-service:8080"))
	r.PathPrefix("/v1/vendor").Handler(reverseProxy("http://vendor-service:8080"))
	r.PathPrefix("/v1/organizers").Handler(reverseProxy("http://organizers-service:8080"))
	r.PathPrefix("/v1/events").Handler(reverseProxy("http://events-service:8080"))
	r.PathPrefix("/api/payments").Handler(reverseProxy("http://payment-service:8081"))
	r.PathPrefix("/auth").Handler(reverseProxy("http://auth-service:8000"))

	r.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("OK"))
	})

	log.Println("API Gateway running on :8080")
	http.ListenAndServe(":8080", r)
}
