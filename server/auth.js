import express from "express";
import { exchangeAuthCode } from "../bankClient.js";

export const auth = express.Router();

// Frontend visits your bank authorization URL to get `code` + `code_verifier`.
// Then it POSTs them here for server-side exchange.
auth.post("/callback", async (req, res) => {
  try {
    const { code, code_verifier } = req.body || {};
    if (!code || !code_verifier) return res.status(400).json({ error: "invalid_request" });

    const tokens = await exchangeAuthCode({ code, code_verifier });
    res.json({ ok: true, expires_at: tokens.expires_in ? Date.now() + tokens.expires_in * 1000 : null });
  } catch (e) {
    res.status(502).json({ error: "token_exchange_failed" });
  }
});

