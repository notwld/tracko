from flask import Flask, request, render_template, jsonify

import secrets
from flask_cors import CORS


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

room_codes = set()

def generate_room_code():
    code = secrets.token_urlsafe(2)  
    
    return code

code = generate_room_code()
print(code)
@app.route('/connect', methods=['POST'])
def connect():
    invite_code = request.json.get('code')
    print(invite_code)
    if invite_code is None:
        return 'No invite code provided', 400
    if invite_code==code:
        print("connected")
        return jsonify({'success': True}), 200
    return jsonify({'success': False}), 200

@app.route('/backlogs', methods=['GET'])
def backlogs():
    return [
    {
        "backlogId": 1,
        "storyPoint": 0,
        "backLog": "As a User I want to do something"
    },
    {
        "backlogId": 2,
        "storyPoint": 0,
        "backLog": "As a Admin I want to do something"
    },
    {
        "backlogId": 3,
        "storyPoint": 0,
        "backLog": "As a Dev I want to do something"
    },
    {
        "backlogId": 4,
        "storyPoint": 0,
        "backLog": "As a Engineering I want to do something"
    },

], 200
if __name__ == '__main__':
    app.run(debug=True,host="192.168.1.104",port="19001")