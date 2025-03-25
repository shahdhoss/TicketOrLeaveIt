# Functional Requirements 
    1. Users should be able to create an account using their first name, last name, email, and password. 
    2. Users should be able to update their profile information (name, profile picture, password) 
    3. Users should be able to view their event history
    4. Users should be able to log into their created accounts. Token based authentication should be implemented using OAuth
    5. The system should allow event organizers to create a new event using the following: event name, event type, description, date and time, location, capacity, ticket pricing, and event promotional images 
    6. The system should allow event organizers to view the details and check the remaining capacity of an event using its event ID. 
    7. The system should allow organizers to categorize events by type (concert, conference, workshop) and add tags for easier searchability. 
    8. The system should send notifications to users for ticket purchase confirmations, event reminders. 
    9. Organizers should be able to view a dashboard displaying event performance metrics.
    10. The system should support centralized logging using OpenSearch.
# Non-functional Requirements 
    1. The system should be able to support up to 400 RPS at peak load.
    2. The system's data should be consistent and reliable, ensuring that all transactions are correctly processed, preventing data loss.
    3. The system should offer high throughput with low latency for its users
    4. The system should maintain an uptime of 99% or higher