from userManagement import check_user, create_user, change_password
import credentialActions as actions

def attemptLogin():
    print("\n--- Login ---")
    username = input("Enter username: ")
    password = input("Enter password: ")
    success, result = check_user(username, password)
    if success:
        print("Login successful!")
        return result
    else:
        print(f"Login failed: {result}")
        return None

def appLoop():
    while True:
        user = None
        # Authentication Phase
        while user is None:
            print("\n1 | Login")
            print("2 | Create Account")
            print("3 | Exit")
            choice = input("Choice: ")
            if choice == '1':
                user = attemptLogin()
            elif choice == '2':
                name = input("Enter new username: ")
                pw = input("Enter new password: ")
                print(create_user(name, pw))
            elif choice == '3':
                return
            else:
                print("Invalid choice")
        
        # Authenticated Phase
        while True:
            print(f"\n--- Credential Manager ({user}) ---")
            print('1 | Add Credential')
            print('2 | Search Credential')
            print('3 | Delete Credential')
            print('4 | View All Credentials')
            print('5 | Change Password')
            print('6 | Logout')
            print()
            choice = input("What would you like to do? : ")

            if choice == '1':
                service = input("Service name: ")
                print("Enter data (key:value). Type 'done' to finish.")
                data = {}
                while True:
                    entry = input("Entry: ")
                    if entry.lower() == 'done': break
                    if ':' in entry:
                        k, v = entry.split(':', 1)
                        data[k.strip()] = v.strip()
                actions.addCredential(user, service, data)
                print(f"Credential for {service} added.")

            elif choice == '2':
                service = input("Enter service name to search (fuzzy): ")
                creds = actions.findCredential(user, service)
                if creds:
                    print(f"\nFound {len(creds)} match(es):")
                    for cred in creds:
                        print(f"\n[ {cred['service']} ]")
                        for k, v in cred['data'].items():
                            print(f"  {k}: {v}")
                else:
                    print("No matching credentials found.")

            elif choice == '3':
                service = input("Enter service name to delete: ")
                if actions.deleteCredential(user, service):
                    print(f"Credential for {service} deleted.")
                else:
                    print("Credential not found.")

            elif choice == '4':
                creds = actions.viewAllCredentials(user)
                if not creds:
                    print("No credentials stored.")
                for cred in creds:
                    print(f"\n[ {cred['service']} ]")
                    for k, v in cred['data'].items():
                        print(f"  {k}: {v}")

            elif choice == '5':
                old_pw = input("Enter current password: ")
                new_pw = input("Enter new password: ")
                success, message = change_password(user, old_pw, new_pw)
                print(message)

            elif choice == '6':
                print(f"User {user} logged out.")
                break # Breaks out of Authenticated Phase back to Authentication Phase
            else:
                print("Invalid choice")

if __name__ == "__main__":
    appLoop()
