from flask import Flask, request, jsonify
from flask_cors import CORS
import userManagement as um
import credentialActions as ca

app = Flask(__name__)
CORS(app) # This allows your React app to talk to this API

# --- AUTH ROUTES ---

@app.route('/api/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    result = um.create_user(username, password)
    return jsonify({"message": result})

@app.route('/api/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username')
    password = data.get('password')
    success, result = um.check_user(username, password)
    if success:
        return jsonify({"success": True, "username": result})
    else:
        return jsonify({"success": False, "message": result}), 401

@app.route('/api/change-password', methods=['POST'])
def change_pw():
    data = request.json
    username = data.get('username')
    old_pw = data.get('old_password')
    new_pw = data.get('new_password')
    success, message = um.change_password(username, old_pw, new_pw)
    return jsonify({"success": success, "message": message})




# --- CREDENTIAL ROUTES ---

@app.route('/api/credentials/<username>', methods=['GET'])
def get_creds(username):
    # In a real app, you'd verify a token here for security
    creds = ca.viewAllCredentials(username)
    # Remove MongoDB '_id' object because it's not JSON serializable
    for c in creds:
        c['_id'] = str(c['_id'])
    return jsonify(creds)

@app.route('/api/credentials', methods=['POST'])
def add_cred():
    data = request.json
    username = data.get('username')
    service = data.get('service')
    service_data = data.get('data')
    ca.addCredential(username, service, service_data)
    return jsonify({"message": "Credential added!"})

@app.route('/api/credentials/search', methods=['POST'])
def search_cred():
    data = request.json
    username = data.get('username')
    query = data.get('query')
    creds = ca.findCredential(username, query)
    for c in creds:
        c['_id'] = str(c['_id'])
    return jsonify(creds)

@app.route('/api/credentials/delete', methods=['DELETE'])
def delete_cred():
    data = request.json
    username = data.get('username')
    service = data.get('service')
    success = ca.deleteCredential(username, service)
    return jsonify({"success": success})

@app.route('/api/credentials/update', methods=['POST'])
def update_cred():
    data = request.json
    username = data.get('username')
    service = data.get('service')
    new_data = data.get('data')
    success = ca.updateCredential(username, service, new_data)
    return jsonify({"success": success})

@app.route('/api/credentials/import', methods=['POST'])
def import_creds():
    data = request.json
    username = data.get('username')
    cred_list = data.get('credentials') # Expects a list of {service, data}
    count = ca.importCredentials(username, cred_list)
    return jsonify({"success": True, "count": count})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
