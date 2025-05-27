<<<<<<< HEAD
from flask import Flask, request

app = Flask(__name__)

@app.route('/oauth/callback')
def oauth_callback():
    code = request.args.get('code')
    return f"Authorization Code: {code}", 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
=======
from flask import Flask, request, jsonify
import os

app = Flask(__name__)

@app.route('/')
def home():
    return jsonify({"message": "API is running!"})

# Ensure production-ready execution
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5000)))
>>>>>>> e72765c (Updated Flask app for production)

