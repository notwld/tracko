from flask import Flask, request, render_template, jsonify
import requests
import secrets
from flask_cors import CORS
import json,time
import os
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

room_codes = set()

def generate_room_code():
    code = secrets.token_urlsafe(2)  
    
    return code

code = generate_room_code()
print(code)
@app.route('/code', methods=['POST'])
def connect():
    
    invite_code = request.json.get('code')
    email = request.json.get('email')
    req = requests.post('https://tracko-cb68e46d23ae.herokuapp.com/api/poker-planning/join', json={'code': invite_code, 'email': email})
    print(req.status_code)
    if req.status_code == 400:
        res = json.loads(req.content)
        return jsonify({'success': False,"err":res}), 400
    if req.status_code == 200:
        res = json.loads(req.content)
        print(res)
        return jsonify({'success': True, 'data': res}), 200
    return jsonify({'success': False}), 200

@app.route('/usecase', methods=['POST'])
def usecase():
    
    invite_code = request.json.get('code')
    email = request.json.get('email')
    req = requests.post('https://tracko-cb68e46d23ae.herokuapp.com/api/poker-planning/usecase', json={'code': invite_code, 'email': email})
    print(req.status_code)
    if req.status_code == 400:
        res = json.loads(req.content)
        print(res)
        return jsonify({'success': False,"err":res}), 400
    if req.status_code == 200:
        res = json.loads(req.content)
        print(res)
        return jsonify({'success': True, 'data': res}), 200
    return jsonify({'success': False}), 200

@app.route('/update-estimates', methods=['POST'])
def update():
    # product_backlog_id, points,user_id
    product_backlog_id = request.json.get('product_backlog_id')
    points = request.json.get('point')
    user_id = request.json.get('user_id')
    print(product_backlog_id, points, user_id)
    req = requests.post('https://tracko-cb68e46d23ae.herokuapp.com/api/backlog/update-estimates', json={'product_backlog_id': product_backlog_id, 'points': points, 'user_id': user_id})
    if req.status_code == 400:
        res = json.loads(req.content)
        print(res)
        return jsonify({'success': False,"err":res}), 400
    if req.status_code == 200:
        time.sleep(1)
        res = json.loads(req.content)
        print(res)
        return jsonify({'success': True, 'data': res}), 200
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
    app.run(debug=True,host="0.0.0.0",port=os.environ.get('PORT', 5000))