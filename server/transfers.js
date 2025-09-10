import express from "express";
import { v4 as uuid } from "uuid";
import { q, one } from "../db.js";
import { createTransfer, listAccounts } from "../bankClient.js";

export const transfers = express.Router();

transfers.get("/accounts", async (_req, res) => {
  try {
    const data = await listAccounts();
    res.json(data);
  } catch (e) {
    res.status(401).json({ error: "auth_required" });
  }
});

transfers.post("/", async (req, res) => {
  try {
    const { fromAccountId, toRouting, toAccount, amountCents, memo } = req.body || {};
    if (!fromAccountId || !toRouting || !toAccount || !amountCents)
      return res.status(400).json({ error: "invalid_request" });

    const id = uuid();
    await q(
      `insert into transfers (id, from_account_id, to_routing, to_account, amount_cents, memo, status)
       values ($1,$2,$3,$4,$5,$6,'submitted')`,
      [id, fromAccountId, toRouting, toAccount, amountCents, memo || null]
    );

    const bank = await createTransfer({ fromAccountId, toRouting, toAccount, amountCents, memo });

    await q(
      "update transfers set status=$2, bank_ref=$3, updated_at=now() where id=$1",
      [id, bank.status || "submitted", bank.id || null]
    );

    const row = await one("select * from transfers where id=$1", [id]);
    res.json(row);
  } catch (e) {
    const msg = String(e?.message || "");
    if (msg.includes("auth_required")) return res.status(401).json({ error: "auth_required" });
    res.status(502).json({ error: "bank_error" });
  }
});

