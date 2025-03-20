# Architecture Design Records (ADRs)

## ADR 001: Microservices Architecture

**Status:** Proposed

**Context:**
To manage a complex system like an event management and ticket booking platform, we need a scalable and fault-tolerant architecture.

**Decision:**
We will adopt a microservices architecture, with dedicated services for authentication, notification, users, and events.

**Rationale:**
- **Scalability:** Allows each service to be scaled independently based on demand.
- **Fault Tolerance:** Enhances fault tolerance by isolating failures to specific services.
- **Development Simplification:** Simplifies development and deployment by breaking down the system into smaller, manageable components.

**Consequences:**
- **Positive Impacts:**
  - Each service can be scaled independently based on demand.
  - Failures are isolated to specific services, enhancing fault tolerance.
  - Development and deployment are simplified by breaking down the system into smaller components.
- **Potential Drawbacks:**
  - Managing a microservices architecture may introduce additional complexity in terms of inter-service communication, monitoring, and deployment.
  - Ensuring consistency and coordination across services may require additional effort and tools.


---

## ADR 002: Rate Limiting (Sliding Window)

**Status:** Proposed

**Context:**
To prevent abuse of our system such as brute force attacks and DDoS attacks, we need to implement rate limiting.

**Decision:**
We will use the Sliding Window algorithm for rate limiting, leveraging Redis for its fast in-memory data storage capabilities.

**Rationale:**
- **Accuracy:** The Sliding Window algorithm is more accurate than fixed window or token bucket algorithms because it tracks requests in real-time over a rolling time window.
- **Scalability:** Redis supports distributed systems, making it scalable for high-traffic scenarios like ticket booking systems.

**Consequences:**
- **Positive Impacts:**
  - Protects our APIs and services from being overwhelmed by too many requests.
  - Ensures fair usage of resources, especially during high-demand events like ticket sales.
  - Prevents malicious users from exploiting the system.
- **Potential Drawbacks:**
  - Implementing and maintaining the Sliding Window algorithm may require additional development effort and computational resources.
  - Redis, while fast, may introduce additional complexity in managing in-memory data storage and ensuring its availability.

---
# ADR 003: Fault Tolerance (Graceful Degradation)

**Status:** Proposed

**Context:**
To ensure our system remains operational even when some components fail or are under heavy load, we need to implement graceful degradation.

**Decision:**
We will implement **graceful degradation** to maintain partial functionality during failures. This ensures that users can still interact with the system even if certain services (e.g., event search, ticket management) experience issues.

**Rationale:**
- **Operational Continuity:** If critical services fail, the system will continue to operate in a degraded mode, allowing users to browse events and perform essential actions.
- **User Experience:** The system will display a default list of events or provide fallback options to ensure users can still access key functionalities.
- **Fault Tolerance:** Graceful degradation ensures that the system remains usable, even if some components are unavailable or under heavy load.

**Consequences:**
- **Positive Impacts:**
  - Maintains partial functionality during failures, ensuring users can still browse events, view event details, and purchase tickets.
  - Reduces the impact of failures on the overall user experience by providing fallback mechanisms.
  - Provides time for recovery without completely shutting down the system.
- **Potential Drawbacks:**
  - Implementing graceful degradation may require additional logic and fallback mechanisms, increasing system complexity.
  - Users may experience a reduced level of service or functionality during degraded mode, which could impact satisfaction.

---

## ADR 004: Load Balancing (Nginx)

**Status:** Proposed

**Context:**
To distribute incoming traffic across multiple servers and ensure no single server is overwhelmed, we need to implement load balancing.

**Decision:**
We will use Nginx for load balancing and Redis for session storage and caching.

**Rationale:**
- **Performance:** Nginx is a high-performance load balancer that can handle thousands of concurrent connections.
- **Scalability:** Redis supports distributed caching, improving performance and scalability.

**Consequences:**
- **Positive Impacts:**
  - Distributes traffic evenly across multiple servers, preventing any single server from becoming a bottleneck.
  - Improves system performance and reduces response times.
  - Ensures high availability by rerouting traffic away from unhealthy servers.
- **Potential Drawbacks:**
  - Setting up and configuring Nginx and Redis for load balancing and session management may require additional expertise and effort.
  - Redis, while efficient, may introduce additional complexity in managing distributed caching and ensuring data consistency.

---

## ADR 005: Messaging & REST API

**Status:** Proposed

**Context:**
To enable communication between microservices in a distributed system, we need to implement messaging and REST APIs.

**Decision:**
We will use RabbitMQ for asynchronous communication and REST APIs for standardized service communication.

**Rationale:**
- **Decoupling:** Enables decoupling of services, making the system more modular and easier to maintain.
- **Fault Tolerance:** Improves fault tolerance by allowing services to continue operating even if one service fails.
- **Asynchronous Processing:** Supports asynchronous processing for tasks that do not need to be handled in real-time.

**Consequences:**
- **Positive Impacts:**
  - Makes the system more modular and easier to maintain.
  - Enhances fault tolerance by isolating failures to specific services.
  - Supports asynchronous processing for tasks like sending emails.
- **Potential Drawbacks:**
  - Implementing and managing RabbitMQ for asynchronous communication may introduce additional complexity.
  - REST APIs, while standardized, may require careful design to ensure consistency and performance across services.

---


## ADR 006: Database Selection (PostgreSQL)

**Status:** Proposed

**Context:**
To ensure data consistency and availability, we need a robust and reliable database.

**Decision:**
We will use PostgreSQL for its reliability, scalability, and support for complex queries.

**Rationale:**
- **Reliability:** PostgreSQL is known for its reliability and support for complex queries.
- **Scalability:** Supports replication and failover, which are critical for high availability.
- **Data Consistency:** Ensures data consistency and integrity, even during high traffic.

**Consequences:**
- **Positive Impacts:**
  - Ensures data consistency and integrity, even during high traffic.
  - Provides fault tolerance through database replication and failover.
  - Supports complex queries and transactions, essential for managing event and ticket data.
- **Potential Drawbacks:**
  - Setting up and managing PostgreSQL with replication and failover may require additional expertise and effort.
  - PostgreSQL, while powerful, may require careful tuning and optimization to handle high traffic and complex queries efficiently.

---