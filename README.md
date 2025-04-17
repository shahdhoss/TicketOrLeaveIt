# Ticket or Leave it 
This project is built mainly for learning how to build microservices, how to create gRPC requests for the internal communication between services, in addition to learning about load balancers, circuit breakers, and rate limiters. 

## The structure of the project:
Each service can be found in a folder name accordingly in the root of the project. The project contains a docker compose file for building and running the containerized services 

## More info about the microservices:
The users, vendors, organizers, and events microservices have been built using ExpressJS, utilizing sequelize as the database ORM to facilitate database operations. The services have been generated using OpenAPI auto generation, with careful consideration for maintaining api versioning. A screenshot of a test for every api endpoint can be found in the folder named postman screenshots in every microservice

Key components of each service can found in DefaultServices, routers, models, circuit breaker and index.js

A gRPC communication has been included between the events service and the vendor service 
