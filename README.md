# Ticket or Leave It

**Ticket or Leave It** is a comprehensive learning project created for practicing and learning how to build a microservices ecosystem featuring internal communication, scalability tools, and resilient infrastructure patterns.

---

## Table of Contents
1. [Overview](#overview)  
2. [Architecture & Structure](#architecture--structure)  
3. [Technologies](#technologies)  
4. [Getting Started](#getting-started)  
5. [Service Descriptions](#service-descriptions)  

---

## Overview
A hands-on microservices project focused on:
- Learning gRPC and messaging for internal inter-service communication
- Implementing load balancing, circuit breaking, and rate limiting
- Orchestrating services via Docker Compose

---

## Architecture & Structure
The project contains several services, each in its designated folder. Coordination and orchestration are managed via **docker-compose** for seamless containerized deployments.

---

## Technologies
- **Express.js**: Used for building HTTP microservices  
- **Sequelize ORM**: Facilitates database operations  
- **OpenAPI Generator**: Auto-generates API contracts, with versioning support  
- **gRPC**: Enables synchronous inter-service communication (notably between Events and Vendor services)  
- **Messaging using rabbitmq** : enables the asynchronous communtication between the services 
- Infrastructure patterns like load balancing, circuit breakers, and rate limiting are included  

---

## Getting Started

### 1. Clone the repo
```bash
git clone https://github.com/shahdhoss/TicketOrLeaveIt.git
cd TicketOrLeaveIt
```

### 2. Run with Docker Compose
```bash
docker-compose up --build
```

## Service descriptions
- **Users Service:** Manages user profiles and authentication workflows

- **Vendors Service:** Handles vendor entities and related operations

- **Organizers Service:** Oversees event organizer data

- **Events Service:** Manages event details and coordinates with the Vendors service via gRPC

- **Ticket Service:** Facilitates ticket purchasing and management

- **Payment Service:** Processes payments and financial transactions

- **Notification Service:** Sends confirmations, updates, or alerts

- **API Gateway:** Acts as the central entry point routing client requests