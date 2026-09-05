import type { VercelRequest, VercelResponse } from '@vercel/node';
import { setAdminSessionCookie } from '../_adminSession';

// Temporary admin credentials for the current no-database deployment.
// Change these later if the repository is private; for a public repository,
// move them back to Vercel Environment Variables before production use.
const FALLBACK_USERNAME = 'adminpionz';
const FALLBACK_PASSWORD = 'PionzStore@2026!';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const adminUsername = (process.env.ADMIN_USERNAME || FALLBACK_USERNAME).trim();
  const adminPassword = process.env.ADMIN_PASSWORD || FALLBACK_PASSWORD;
  const { username, password } = req.body ?? {};

  if (typeof username !== 'string' || typeof password !== 'string') {
    return res.status(400).json({ error: 'Invalid request.' });
  }

  const usernameOk = username.trim().toLowerCase() === adminUsername.toLowerCase();
  const passwordOk = password === adminPassword;

  if (!usernameOk || !passwordOk) {
    return res.status(401).json({ error: 'ID atau password salah.' });
  }

  setAdminSessionCookie(res);
  return res.status(200).json({ ok: true, expiresIn: 60 * 60 * 12 });
}
