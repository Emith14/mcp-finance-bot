// src/common/auth.util.ts
import { timingSafeEqual } from 'crypto';

export function authOk(header?: string) {
  const expected = `Bearer ${process.env.MCP_APP_TOKEN}`;
  if (!header) return false;
  // exige coincidencia exacta y misma longitud
  if (header.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(header), Buffer.from(expected));
  } catch {
    return false;
  }
}
