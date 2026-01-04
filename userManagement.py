import bcrypt
from database import get_session, User, init_db

# Ensure tables exist
init_db()

# CREATE A NEW USER 
def create_user(username, password):
    session = get_session()
    try:
        if session.query(User).filter_by(username=username).first():
            return "user already exists!"
        
        salt = bcrypt.gensalt()
        passhash = bcrypt.hashpw(password.encode('utf-8'), salt)
        
        # Store as string in DB
        new_user = User(username=username, password=passhash.decode('utf-8'))
        session.add(new_user)
        session.commit()
        return f"user created, id: {new_user.id}"
    finally:
        session.close()

# CONFIRMS LOGIN
def check_user(username, password):
    session = get_session()
    try:
        user = session.query(User).filter_by(username=username).first()
        if not user:
            return False, "Username not found."
        
        # Encode string back to bytes for bcrypt
        stored_hash = user.password.encode('utf-8')
        
        if bcrypt.checkpw(password.encode('utf-8'), stored_hash):
            return True, username
        else:
            return False, "Incorrect password."
    finally:
        session.close()

# CHANGE PASSWORD
def change_password(username, old_password, new_password):
    session = get_session()
    try:
        user = session.query(User).filter_by(username=username).first()
        if not user:
            return False, "User not found."
        
        stored_hash = user.password.encode('utf-8')
        
        if not bcrypt.checkpw(old_password.encode('utf-8'), stored_hash):
            return False, "Current password incorrect."
        
        salt = bcrypt.gensalt()
        new_passhash = bcrypt.hashpw(new_password.encode('utf-8'), salt)
        
        user.password = new_passhash.decode('utf-8')
        session.commit()
        return True, "Password updated successfully!"
    finally:
        session.close()

#MAIN LOOP
if __name__ == "__main__":
    while True:
        print("\n--- User Management ---")
        choice = input("1. Create User\n2. Login\n3. Change Password\n4. Exit\nEnter choice: ")
        
        if choice == '1':
            name = input("enter username : ")
            password = input("enter password : ")
            print(create_user(name, password))
            
        elif choice == '2':
            name = input("enter username : ")
            password = input("enter password : ")
            success, result = check_user(name, password)
            print(f"Success: {success}, Result: {result}")
        
        elif choice == '3':
            name = input("enter username : ")
            old_pw = input("enter current password : ")
            new_pw = input("enter new password : ")
            success, message = change_password(name, old_pw, new_pw)
            print(message)
        
        elif choice == '4':
            break
        
        else:
            print("Invalid choice")