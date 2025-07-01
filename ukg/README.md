# UKG SSO URL Generator

This project helps generate secure Single Sign-On (SSO) URLs for UKG HR Service Delivery (PeopleDoc).

## 🔐 How It Works

- Uses HMAC SHA256 to sign a URL with a shared secret
- Redirects users to UKG without needing a password
- Works only for Document Manager modules

## 🛠 Requirements

- Python 3
- Your UKG `application_secret`
- Your UKG subdomain (e.g., `yourcompany.safe-access.com`)

## 🚀 Usage

Run the script:

```bash
python3 generate_sso.py

