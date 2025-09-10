import express from "express";
import { q } from "../db.js";
import { hmacSha256Hex, timingSafeEqualHex } from "../util/crypto.js";
import "dotenv/config";

export const webhooks = express.Router();

// Use raw body for signature verification
webhooks.post("/bank", express.raw({ type: "*/*" }), async (req, res) => {
  try {
    const sig = req.header("x-bank-signature") || "";
    const ts = parseInt(req.header("x-bank-timestamp") || "0", 10);
    const now = Date.now();
    const tol = parseInt(process.env.WEBHOOK_TOLERANCE_MS || "300000", 10);
    if (Math.abs(now - ts) > tol) return res.status(400).send("stale");

    const raw = req.body;
    const expected = hmacSha256Hex(process.env.WEBHOOK_SECRET, raw);
    if (!timingSafeEqualHex(expected, sig)) return res.status(400).send("bad_sig");

    const event = JSON.parse(raw.toString("utf8"));

    if (event.type === "transfer.status") {
      const { id, status } = event.data || {};
      await q("update transfers set status=$2, updated_at=now() where bank_ref=$1", [id, status]);
    }

    res.json({ ok: true });
  } catch (e) {
    res.status(500).send("error");
  }
});

