from flask import Flask, request, jsonify
import hmac, hashlib, base64
import os

app = Flask(__name__)

# Secret key for HMAC-SHA256 signing
SECRET_KEY = b"YOUR_SECRET_KEY"

def generate_signature(data):
    """Generate an HMAC-SHA256 signature for transaction security"""
    signature = hmac.new(SECRET_KEY, data.encode(), hashlib.sha256).digest()
    return base64.b64encode(signature).decode()

@app.route('/', methods=['GET'])
def home():
    """Health check endpoint"""
    return jsonify({"message": "API is running!"})

@app.route('/transfer', methods=['POST'])
def transfer():
    """Secure USD transfer processing"""
    payload = request.get_json()
    if not payload:
        return jsonify({"error": "Invalid request format"}), 400

    # Extract required fields
    routing_number = payload.get("routing_number")
    destination_account = payload.get("destination_account")
    transactions = payload.get("transactions")

    # Validate essential fields
    if not all([routing_number, destination_account, transactions]):
        return jsonify({"error": "Missing required fields"}), 400

    processed_transactions = []
    for tx in transactions:
        from_routing = tx.get("from_routing")
        from_account = tx.get("from_account")
        amount = tx.get("amount")

        # Validate transaction details
        if not all([from_routing, from_account, amount]):
            return jsonify({"error": "Transaction entry missing required fields"}), 400

        signature = generate_signature(f"{from_routing}{from_account}{amount}{destination_account}{routing_number}")

        processed_transactions.append({
            "from_routing": from_routing,
            "from_account": from_account,
            "amount": amount,
            "destination_account": destination_account,
            "destination_routing": routing_number,
            "signature": signature
        })

    return jsonify({"status": "Processed", "transactions": processed_transactions})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=int(os.environ.get("PORT", 5000)))

