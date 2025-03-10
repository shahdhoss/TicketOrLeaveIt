### Use Case Name:
    Create Event 

### Actors:
    Organizers
### Stakeholders:
    Organizers
    Customers
### Pre-conditions:
    The user should be logged in as an organizer
    The user should have the information need for creating an event (event name, event type, description, date and time, location, capacity, ticket pricing, and event promotional images) ready.
### Post-conditions:
    The user has successfully created an event.
    The system has stored the event's details securely.
#### Main Scenarios:
    1. The user accesses the "Create Event" page from the homepage.
    2. The user enters the following details: event name, event type, description, date and time, location, capacity, ticket pricing, and event promotional images
    3. The user should click the "Create Event" button.
    4. The system should validate the entered data.
    5. The system should confirm successful event creation by displaying a success message.
### Alternate Scenarios:
    2a. The user leaves one or more required fields empty.
        System Action: The system displays an error message indicating which fields are missing.
        Resolution: The user must fill in the missing fields before proceeding.
    4a. The user enters invalid data (e.g., text in the date field, negative ticket pricing).
        System Action: The system detects the invalid input and prompts the user to correct it.
        Resolution: The user provides correct input and retries submission.
    5a. Due to a server or database error, the system fails to create the event.
        System Action: The system displays an error message and asks the user to try again later.
        Resolution: The user can choose to retry or save the event details for later submission.