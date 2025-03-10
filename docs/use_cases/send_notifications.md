# Functional requirement number 7
## Use Case: Send Notifications to Users
1. Scope
System Name: Event Management System
Use Case Name: Send Notifications to Users
2. Description
This use case describes how the system sends notifications to users for ticket purchase confirmations and event reminders to keep them informed about their upcoming events.

3. Level
User-System Level (The interaction is between the user and the system).
4. Stakeholders
Primary Actor: Registered User
Secondary Actor: Event Organizer (who schedules events and sets reminders)
System: Event Management System (handles notifications)
5. Preconditions
The user must have an account in the system.
The user must have registered for an event or purchased a ticket.
The system must have valid user contact information (email or in-app notification setup).
6. Postconditions
The user receives a notification about their event.
The notification is logged in the system for tracking.
7. Main Scenario (Normal Flow)
Step Actor(User/System)	Description
1	 User	            Purchases a ticket for an event.
2	 System	            Confirms the ticket purchase and stores the event details in the database.
3	 System	            Sends a ticket confirmation notification to the user via email or app.
4	 System	            Checks the event date and schedules a reminder notification.
5	 System	            Sends an event reminder notification before the event starts (e.g., 24 hours before).
6 	 User	            Receives the notification and can review the event details.
8. Alternate Flows
A1: User has disabled notifications

The system does not send notifications but logs the event in the user’s history.
A2: Notification delivery fails

The system retries sending the notification.
If it still fails, the system logs an error and alerts the admin.
9. Postconditions (Final Outcome)
The user receives notifications at the right time.
The system logs the notification status (sent, failed, etc.).
If the user interacts with the notification, they are redirected to the event details page
