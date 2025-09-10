import fetch from "node-fetch";
import fs from "fs";
import https from "https";
import { one, q } from "./db.js";
import "dotenv/config";

const cfg = {
  tokenUrl: process.env.BANK_TOKEN_URL,
  apiBase: process.env.BANK_API_BASE,
  clientId: process.env.BANK_CLIENT_ID,
  clientSecret: process.env.BANK_CLIENT_SECRET,
  redirectUri: process.env.BANK_REDIRECT_URI,
  mtlsEnabled: String(process.env.MTLS_ENABLED || "false").toLowerCase() === "true",
  certPath: process.env.MTLS_CERT_PATH,
  keyPath: process.env.MTLS_KEY_PATH,
  caPath: process.env.MTLS_CA_PATH
};

let agent;
if (cfg.mtlsEnabled) {
  agent = new https.Agent({
    cert: fs.readFileSync(cfg.certPath),
    key: fs.readFileSync(cfg.keyPath),
    ca: cfg.caPath ? fs.readFileSync(cfg.caPath) : undefined,
    keepAlive: true,
    minVersion: "TLSv1.2",
    maxVersion: "TLSv1.3"
  });
}

// Persist token helpers
async function saveTokens({ access_token, refresh_token, expires_in }) {
  const expiresAt = new Date(Date.now() + (expires_in || 3600) * 1000).toISOString();
  await q(
    `insert into tokens (id, access_token, refresh_token, expires_at, updated_at)
     values (1,$1,$2,$3,now())
     on conflict (id) do update set
       access_token=$1, refresh_token=$2, expires_at=$3, updated_at=now()`,
    [access_token, refresh_token || null, expiresAt]
  );
}

async function getTokens() {
  return await one("select * from tokens where id=1", []);
}

export async function exchangeAuthCode({ code, code_verifier }) {
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    code,
    code_verifier,
    client_id: cfg.clientId,
    client_secret: cfg.clientSecret,
    redirect_uri: cfg.redirectUri
  });

  const r = await fetch(cfg.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    agent
  });

  if (!r.ok) throw new Error(`token_exchange_failed: ${await r.text()}`);
  const tokens = await r.json();
  await saveTokens(tokens);
  return tokens;
}

async function refreshIfNeeded() {
  const t = await getTokens();
  if (!t) return null;
  const needs = !t.expires_at || Date.now() > new Date(t.expires_at).getTime() - 60_000;
  if (!needs || !t.refresh_token) return t;

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: t.refresh_token,
    client_id: cfg.clientId,
    client_secret: cfg.clientSecret
  });

  const r = await fetch(cfg.tokenUrl, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
    agent
  });

  if (!r.ok) {
    // If refresh fails, keep old token so caller can decide to re-auth
    return t;
  }
  const nt = await r.json();
  await saveTokens(nt);
  return await getTokens();
}

async function authHeader() {
  const t = await refreshIfNeeded();
  if (!t?.access_token) throw new Error("auth_required");
  return { Authorization: `Bearer ${t.access_token}` };
}

export async function createTransfer({ fromAccountId, toRouting, toAccount, amountCents, memo }) {
  const headers = await authHeader();
  const r = await fetch(`${cfg.apiBase}/transfers`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ fromAccountId, toRouting, toAccount, amountCents, memo }),
    agent
  });

  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`bank_transfer_failed: ${r.status} ${JSON.stringify(data)}`);
  return data;
}

export async function listAccounts() {
  const headers = await authHeader();
  const r = await fetch(`${cfg.apiBase}/accounts`, { headers, agent });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(`bank_accounts_failed: ${r.status} ${JSON.stringify(data)}`);
  return data;
}

