# Bank transfer server

Server-side originations for bank APIs with OAuth, token refresh, webhooks, and Postgres persistence.

## Quick start (Ubuntu)
1. Install deps
   - sudo apt update && sudo apt install -y git postgresql nodejs npm
2. Create DB + user or use DATABASE_URL
3. Clone repo + install
   - git clone <your repo> && cd bank-server
   - cp .env.example .env  # fill values
   - npm install
   - npm run migrate
4. Run
   - npm run dev
   - or pm2 start ecosystem.config.js

## Env
- BANK_AUTH_URL, BANK_TOKEN_URL, BANK_API_BASE
- BANK_CLIENT_ID, BANK_CLIENT_SECRET, BANK_REDIRECT_URI, BANK_SCOPES
- DATABASE_URL, CORS_ORIGIN, WEBHOOK_SECRET

## Flow
- /auth/callback: Exchange `code` + `code_verifier` → tokens saved (with expiry)
- /transfers (POST): Create transfer server-side
- /transfers/accounts (GET): List accounts (server-side)
- /webhooks/bank (POST): Verify HMAC + update transfer status

## Notes
- mTLS supported via MTLS_* env; enable if bank requires.
- Tokens stored in DB; refresh performed automatically before calls.
- Keep secrets in .env and rotate regularly.

