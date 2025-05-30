# 1) Rate Limiting (Sliding Window):-
#### The purpose of Rate limiting is to prevent abuse of your system such as brute force attacks and DDoS attacks.

- **Sliding window Algorithm** : The sliding window algorithm is more accurate than fixed window or token bucket algorithms because it tracks requests in real time over
a rolling time window. This prevents users from making too many requests in a short period, ensuring fair usage of resources.

- **Redis** : used for its fast in-memory data storage capabilities, which are ideal for tracking request counts in real-time. 
It also supports distributed systems, making it scalable for high-traffic scenarios like ticket booking systems.

    
**How it Helps ?**
  - Protects your APIs and services from being overwhelmed by too many requests.
  - Ensures fair usage of resources, especially during high-demand events like ticket sales.
  - Prevents malicious users from exploiting the system.
---

# 2) Fault Tolerance (Graceful Degradation) :-
#### Graceful degradation ensures that your system remains operational even when some components fail or are under heavy load. This is critical for a ticket booking system, where downtime or unavailability can lead to lost revenue and customer dissatisfaction.

- **Graceful Degradation:** If the recommendation engine fails, the system does not crash or become completely unavailable. Instead, it continues to operate in a degraded mode:
- Users can still browse all events manually by navigating through categories, dates, or locations.
- The system displays a default list of popular events (pre-cached or stored in a static list) instead of personalized recommendations.
- A message is shown to the user: "Personalized recommendations are temporarily unavailable. Here are some popular events you might like!"

-  Circuit Breaker :  acts like a safety switch topping calls to failing services and automating recovery when they come back online.

**How it Helps ?**
- Maintains partial functionality during failures, ensuring that users can still interact with the system.
- Reduces the impact of failures on the overall user experience.
- Provides time for recovery without completely shutting down the system.
---
# 3) Load Balancing (haproxy):-
#### Load balancing is crucial for distributing incoming traffic across multiple servers to ensure no single server is overwhelmed. This is especially important during peak times, such as when tickets for a popular event go on sale.


- **Redis :** Redis is used for session storage and caching, which helps in maintaining session persistence and reducing the load on backend servers.
It also supports distributed caching, which improves performance and scalability.

**How it Helps ?**
- Distributes traffic evenly across multiple servers, preventing any single server from becoming a bottleneck.
- Improves system performance and reduces response times.
- Ensures high availability by rerouting traffic away from unhealthy servers.
---
# 4) Messaging & REST API :-
#### Messaging and REST APIs are essential for communication between microservices in a distributed system. They ensure that services can interact seamlessly, even when they are deployed on different servers or in different regions.

- **Messaging :**  We use messaging systems (e.g., RabbitMQ ) for asynchronous communication between services. This is particularly useful for tasks like sending confirmation emails,
updating user notifications, or processing background jobs.

- **REST API:** REST APIs provide a standardized way for services to communicate with each other. They are stateless, scalable, and easy to integrate with other systems.
- GRPC is used in communication betwwen services and each other 

**How it Helps?**
- Enables decoupling of services, making the system more modular and easier to maintain.
- Improves fault tolerance by allowing services to continue operating even if one service fails.
- Supports asynchronous processing, which is critical for tasks that do not need to be handled in real-time (e.g., sending emails).

---

# 5) Microservices :-
#### Microservices architecture is ideal for a complex system like an event management and ticket booking platform. It allows each component (e.g., authentication, notification, users, events) to be developed, deployed, and scaled independently.

- **Authentication:** A dedicated authentication service ensures secure user login and session management. It can be scaled independently to handle high traffic during ticket sales.

- **Notification:** A notification service handles sending emails, SMS, and push notifications to users. It can be decoupled from the main applicationو
to ensure that notifications are sent even if other services are down.

- **Users:** A user service manages user profiles, preferences, and history. It can be scaled independently based on the number of users.

- **Events:** An event service handles event creation, updates, and ticket availability. It can be optimized for high read and write throughput during ticket sales.


**How it Helps?**
- Improves scalability by allowing each service to be scaled independently based on demand.
- Enhances fault tolerance by isolating failures to specific services.
- Simplifies development and deployment by breaking down the system into smaller, manageable components.

---

# 6) Database :-


- **SQL (PostgreSQL) :**  We chose PostgreSQL for its reliability, scalability, and support for complex queries, It also has dedicated databases per microservice prevent cascading failures (no shared database SPOF),And
Clear service boundaries ensure failures in one database do not affect others.

**How it Helps?**
● Eliminates database-level SPOF across services 
● Ensures strong data consistency during peak loads 
● Provides clear fault containment boundaries 
● Supports complex transactions within each domain 


