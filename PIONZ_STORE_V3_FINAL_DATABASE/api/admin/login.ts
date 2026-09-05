import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createAdminSession, setAdminSessionCookie } from '../_adminSession';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  const adminUsername = process.env.ADMIN_USERNAME;
  const adminPassword = process.env.ADMIN_PASSWORD;
  if (!adminUsername || !adminPassword) return res.status(500).json({ error: 'Admin credentials belum dikonfigurasi.' });
  const { username, password } = req.body ?? {};
  if (typeof username !== 'string' || typeof password !== 'string') return res.status(400).json({ error: 'Invalid request.' });
  if (username.trim().toLowerCase() !== adminUsername.trim().toLowerCase() || password !== adminPassword) return res.status(401).json({ error: 'Unauthorized' });
  setAdminSessionCookie(res);
  return res.status(200).json({ ok: true, expiresIn: 60 * 60 * 12 });
}
