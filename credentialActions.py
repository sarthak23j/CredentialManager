import json
from database import get_session, Credential, init_db

# Ensure tables exist
init_db()

def addCredential(username, serviceName, serviceData):
    session = get_session()
    try:
        # Serialize data to JSON string
        data_str = json.dumps(serviceData)
        
        new_cred = Credential(
            username=username, 
            service=serviceName, 
            data=data_str
        )
        session.add(new_cred)
        session.commit()
        return str(new_cred.id)
    finally:
        session.close()

def findCredential(username, serviceName):
    session = get_session()
    try:
        # Case-insensitive partial match using SQL LIKE
        creds = session.query(Credential).filter(
            Credential.username == username,
            Credential.service.ilike(f'%{serviceName}%')
        ).all()
        
        results = []
        for c in creds:
            results.append({
                '_id': c.id, # Keep '_id' for frontend compatibility
                'user': c.username,
                'service': c.service,
                'data': json.loads(c.data)
            })
        return results
    finally:
        session.close()

def deleteCredential(username, serviceName):
    session = get_session()
    try:
        # Deletes the exact match
        cred = session.query(Credential).filter_by(username=username, service=serviceName).first()
        if cred:
            session.delete(cred)
            session.commit()
            return True
        return False
    finally:
        session.close()

def viewAllCredentials(username):
    session = get_session()
    try:
        creds = session.query(Credential).filter_by(username=username).all()
        results = []
        for c in creds:
            results.append({
                '_id': c.id,
                'user': c.username,
                'service': c.service,
                'data': json.loads(c.data)
            })
        return results
    finally:
        session.close()

def updateCredential(username, serviceName, newData):
    session = get_session()
    try:
        cred = session.query(Credential).filter_by(username=username, service=serviceName).first()
        if cred:
            cred.data = json.dumps(newData)
            session.commit()
            return True
        return False
    finally:
        session.close()

def importCredentials(username, cred_list):
    session = get_session()
    try:
        if not cred_list:
            return 0
            
        count = 0
        for item in cred_list:
            # item expects {service, data}
            new_cred = Credential(
                username=username,
                service=item.get('service'),
                data=json.dumps(item.get('data', {}))
            )
            session.add(new_cred)
            count += 1
            
        session.commit()
        return count
    finally:
        session.close()
