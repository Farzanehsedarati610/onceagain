import { Pool } from "pg";
import "dotenv/config";

export const pool = new Pool({ connectionString: process.env.DATABASE_URL });

export async function q(sql, params = []) {
  const res = await pool.query(sql, params);
  return res.rows;
}

export async function one(sql, params = []) {
  const rows = await q(sql, params);
  return rows[0] || null;
}

