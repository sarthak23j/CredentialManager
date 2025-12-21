import bcrypt
import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
DB_NAME = os.getenv('DB_NAME', 'CredentialManager')

client = MongoClient(MONGODB_URI)
db = client[DB_NAME]
users = db['Users']

# CREATE A NEW USER 
def create_user(username, password):
    if users.find_one({"username": username}):
        return "user already exists!"
    
    salt = bcrypt.gensalt()
    passhash = bcrypt.hashpw(password.encode('utf-8'), salt)
    
    userObj = {
        'username': username,
        'password': passhash
    }
    
    result = users.insert_one(userObj)
    return f"user created, id: {result.inserted_id}"

# CONFIRMS LOGIN
def check_user(username, password):
    user = users.find_one({"username": username})
    if not user:
        return False, "Username not found."
    
    if bcrypt.checkpw(password.encode('utf-8'), user['password']):
        return True, username
    else:
        return False, "Incorrect password."

# CHANGE PASSWORD
def change_password(username, old_password, new_password):
    user = users.find_one({"username": username})
    if not user:
        return False, "User not found."
    
    if not bcrypt.checkpw(old_password.encode('utf-8'), user['password']):
        return False, "Current password incorrect."
    
    salt = bcrypt.gensalt()
    new_passhash = bcrypt.hashpw(new_password.encode('utf-8'), salt)
    
    users.update_one({"username": username}, {"$set": {"password": new_passhash}})
    return True, "Password updated successfully!"

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