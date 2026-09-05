import type { VercelRequest, VercelResponse } from '@vercel/node';
import { clearAdminSessionCookie } from '../_adminSession';

export default function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });
  clearAdminSessionCookie(res);
  return res.status(200).json({ ok: true });
}
