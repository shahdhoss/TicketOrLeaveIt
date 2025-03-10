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