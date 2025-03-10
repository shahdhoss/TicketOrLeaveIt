### Use Case Name:
    Create Account

### Actors:
    Organizers
    Customers 
### Stakeholders:
    Organizers
    Customers
### Pre-conditions:
    The user must be on the "Create Account" page of the system.
    The user must have the required information ready for registration (email and password).
### Post-conditions:
    The user successfully creates an account and can log in using their credentials.
    The system stores the user's details securely and confirms account creation via a confirmation message.
#### Main Scenarios:
    1.The user accesses the "Create Account" page from the login or homepage.
    2. The user enters the following details: Email address, Password, and Confirm password
    3.The user should click the "Create Account" button.
    4.The system should validate the entered data (email format, password match, etc.).
    5.The system should confirm successful registration by displaying a message.
    6.The user is redirected to the login page or dashboard.
### Alternate Scenarios:
    2a.The user enters an invalid email format.
        System Action: The system displays an error message prompting the user to enter a valid email address.
        Resolution: The user corrects the email and resubmits.
    2b.The user enters passwords that do not match.
        System Action: The system shows an error indicating that the "password" and "confirm password" fields must match.
        Resolution: The user re-enters matching passwords and resubmits.
    2c.The user leaves one or more required fields blank.
        System Action: The system highlights the missing fields and prompts the user to fill them in.
        Resolution: The user completes all required fields and resubmits.
    2d.The user enters an email already in use.
        System Action: The system informs the user that the email is already registered and suggests either logging in or using a different email.
        Resolution: The user either logs in, resets the password, or registers with a new email.
    2e.The user enters a password that doesn't meet security criteria (too short, lacks special characters).
        System Action: The system displays a message suggesting stronger password requirements (e.g., minimum length, mix of characters).
        Resolution: The user creates a stronger password and resubmits.
    2f.The system encounters an issue (e.g., timeout or lost connection) during account creation.
        System Action: The system notifies the user of the issue and asks them to try again later.
        Resolution: The user retries after the connection is restored or the system issue is resolved.