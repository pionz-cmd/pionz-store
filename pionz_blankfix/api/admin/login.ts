import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHmac } from 'node:crypto';

const COOKIE_NAME = 'pionz_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 12;
const FALLBACK_USERNAME = 'adminpionz';
const FALLBACK_PASSWORD = 'PionzStore@2026!';
const FALLBACK_SECRET = 'PIONZ-SESSION-9xK7mQ2vL8rT5pN4';

function sessionSecret() {
  return process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || FALLBACK_SECRET;
}

function setSession(res: VercelResponse) {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = Buffer.from(JSON.stringify({ exp: expiresAt })).toString('base64url');
  const signature = createHmac('sha256', sessionSecret()).update(payload).digest('base64url');
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=${payload}.${signature}; HttpOnly; Path=/; Max-Age=${SESSION_TTL_SECONDS}; SameSite=Lax${secure}`);
}

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  const adminUsername = (process.env.ADMIN_USERNAME || FALLBACK_USERNAME).trim();
  const adminPassword = process.env.ADMIN_PASSWORD || FALLBACK_PASSWORD;
  const { username, password } = req.body ?? {};
  if (typeof username !== 'string' || typeof password !== 'string') return res.status(400).json({ error: 'Invalid request.' });
  if (username.trim().toLowerCase() !== adminUsername.toLowerCase() || password !== adminPassword) {
    return res.status(401).json({ error: 'ID atau password salah.' });
  }
  setSession(res);
  return res.status(200).json({ ok: true, expiresIn: SESSION_TTL_SECONDS });
}
