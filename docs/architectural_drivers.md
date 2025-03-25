# Architectural Drivers:
and their back of the envelope estimation 
## 1. Scalability and resilience  
Load balancers, graceful degradation, circuit breakers, and rate limiting  are to be implemented and used.
## Number of load balancer needed:
Assuming that the average number of visitors per day is 2,000 users, and the number of concurrent users on average is 100 users. Assuming that the peak performance has 2x the number of concurrent users, making it 200 concurrent users. If every user makes 2 requests/sec that makes the no. of requests at peak 2*200 = 400 request per second. Using the fact that one nginx server can handle roughly 10,000 rps.
The number of nginx servers needed will be 400/10,000 = almost 1 nginx server. Adding one more instance for high availability. That makes the number of instances 3 instances of nginx servers for load balancing  
## 2. Availability
We are using Render(Free Tier) as our platform for deployment. Each microservice will need one Render instance. 
A database instance deployed using Render's free tier on average can take 500 QPS. Assuming that every request makes 1 QPS, the number of database instances needed per service will be 1 instance 
## 3. High throughput and low latency 
The above calculation were made to make sure the web application can maintain a low latency with the maximum possible throughput 
