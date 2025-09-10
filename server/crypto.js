import crypto from "crypto";

export function hmacSha256Hex(secret, raw) {
  return crypto.createHmac("sha256", secret).update(raw).digest("hex");
}

export function timingSafeEqualHex(a, b) {
  const A = Buffer.from(a || "", "hex");
  const B = Buffer.from(b || "", "hex");
  if (A.length !== B.length) return false;
  return crypto.timingSafeEqual(A, B);
}

