if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5000)))

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

@app.route('/transfer', methods=['POST'])
def transfer():
    payload = request.get_json()
    if not payload:
        return jsonify({"error": "Invalid request format"}), 400

    account_number = payload.get("account_number")
    routing_number = payload.get("routing_number")
    transactions = payload.get("transactions")

    if not all([account_number, routing_number, transactions]):
        return jsonify({"error": "Missing required fields"}), 400

    return jsonify({"status": "Processed", "transactions": transactions})

