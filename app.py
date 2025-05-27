from flask import Flask, request

app = Flask(__name__)

@app.route('/oauth/callback')
def oauth_callback():
    code = request.args.get('code')
    return f"Authorization Code: {code}", 200

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)

