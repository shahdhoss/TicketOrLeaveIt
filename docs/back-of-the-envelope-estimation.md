# Architectural Drivers:
and their back of the envelope estimation 
## Scalability and resilience  
Load balancers, circuit breakers, and rate limiting are to be used.
## Back of the envelope estimaition 
To figure out what kind of resources the microservices would needs, we can look at how the system behaves under load using rough estimates.A typical API request that parses JSON and hits the database once would use about 2 milliseconds of CPU time and around 6 KB of network bandwidth. That means a single CPU core can handle about 500 requests per second. On the memory side, each service instance would need roughly 300 MB of RAM. 
