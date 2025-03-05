# functional requirement number 7
Use Case: Send Notifications to Users
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
# functional requirement number 8 
1. Scope
System Name: Event Management System
Use Case Name: View Event Performance Dashboard
2. Description
This use case describes how event organizers can access a dashboard displaying event performance metrics, such as ticket sales, attendee statistics, and revenue trends.

3. Level
User-System Level (Interaction between event organizers and the system).
4. Stakeholders
Primary Actor: Event Organizer
Secondary Actor: System (Processes and displays event analytics)
5. Preconditions
The event organizer must be logged into the system.
The organizer must have created at least one event.
The system must have collected relevant event performance data (e.g., ticket sales, attendance records).
6. Postconditions
The event organizer successfully views the dashboard with real-time event performance metrics.
The system updates the dashboard dynamically as new event data is recorded.
7. Main Scenario (Normal Flow)
Step	Actor (Organizer/System)	Description
1	    Organizer	                Logs into the system.
2	    System	                    Authenticates the organizer and loads their dashboard.
3	    Organizer	                Selects an event to view performance details.
4	    System	                    Fetches real-time event data (ticket sales, attendee stats, revenue).
5	    System	                    Displays the event performance dashboard with visual analytics (charts, tables, graphs).
6	    Organizer	                Reviews event insights and takes necessary actions (e.g., adjust marketing strategies).
8. Alternate Flows
A1: No events created by the organizer

The system shows a message: "No events found. Create an event to view performance metrics."
A2: Data retrieval issue

If the system fails to fetch event data, it displays an error message and prompts a retry.
9. Postconditions (Final Outcome)
The event organizer successfully views key event insights.
The system continues collecting and updating real-time data.
Organizers can use the data to make informed event management decisions.