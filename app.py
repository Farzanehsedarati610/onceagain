from flask import Flask, request, jsonify
import hmac, hashlib, base64
import os

app = Flask(__name__)

SECRET_KEY = b"YOUR_SECRET_KEY"

def generate_signature(data):
    """Generate an HMAC-SHA256 signature for security"""
    signature = hmac.new(SECRET_KEY, data.encode(), hashlib.sha256).digest()
    return base64.b64encode(signature).decode()

@app.route('/')
def home():
    return jsonify({"message": "API is running!"})

@app.route('/transfer', methods=['POST'])
def transfer():
    """Process USD transfer requests"""
    payload = request.get_json()
    if not payload:
        return jsonify({"error": "Invalid request format"}), 400

    account_number = payload.get("account_number")
    routing_number = payload.get("routing_number")
    transactions = payload.get("transactions")

    if not all([account_number, routing_number, transactions]):
        return jsonify({"error": "Missing required fields"}), 400

    processed_transactions = []
    for tx in transactions:
        hash_value = tx["hash"]
        balance = tx["balance"]
        signature = generate_signature(f"{hash_value}{balance}{account_number}{routing_number}")

        processed_transactions.append({
            "hash": hash_value,
            "balance": balance,
            "account": account_number,
            "routing": routing_number,
            "signature": signature
        })

    return jsonify({"status": "Processed", "transactions": processed_transactions})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5000)))

