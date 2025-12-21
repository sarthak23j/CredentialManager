import os
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
DB_NAME = os.getenv('DB_NAME', 'CredentialManager')

client = MongoClient(MONGODB_URI)
db = client[DB_NAME]
credentials = db['Credentials']

def addCredential(username, serviceName, serviceData):
    credObj = {
        'user': username,
        'service': serviceName,
        'data': serviceData
    }
    result = credentials.insert_one(credObj)
    return result.inserted_id

def findCredential(username, serviceName):
    # Uses case-insensitive regex for fuzzy/partial matching
    return list(credentials.find({
        'user': username, 
        'service': {'$regex': serviceName, '$options': 'i'}
    }))

def deleteCredential(username, serviceName):
    result = credentials.delete_one({'user': username, 'service': serviceName})
    return result.deleted_count > 0

def viewAllCredentials(username):
    return list(credentials.find({'user': username}))

def updateCredential(username, serviceName, newData):
    result = credentials.update_one(
        {'user': username, 'service': serviceName},
        {'$set': {'data': newData}}
    )
    return result.modified_count > 0

def importCredentials(username, cred_list):
    # Add the owner field to each credential
    for cred in cred_list:
        cred['user'] = username
    
    if not cred_list:
        return 0
        
    result = credentials.insert_many(cred_list)
    return len(result.inserted_ids)
