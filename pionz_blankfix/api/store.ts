import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createHmac, timingSafeEqual } from 'node:crypto';

const COOKIE_NAME = 'pionz_admin_session';
const FALLBACK_SECRET = 'PIONZ-SESSION-9xK7mQ2vL8rT5pN4';
function validSession(req: VercelRequest) {
  const raw = req.headers.cookie || '';
  const match = raw.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE_NAME}=`));
  if (!match) return false;
  const [payload, signature] = match.slice(COOKIE_NAME.length + 1).split('.');
  if (!payload || !signature) return false;
  try {
    const expected = createHmac('sha256', process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || FALLBACK_SECRET).update(payload).digest('base64url');
    const a=Buffer.from(signature), b=Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a,b)) return false;
    return Number(JSON.parse(Buffer.from(payload,'base64url').toString('utf8')).exp) > Math.floor(Date.now()/1000);
  } catch { return false; }
}

// No-database mode: storefront data remains local to the browser.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method === 'GET') return res.status(200).json({ accounts: [], config: null, mode: 'local' });
  if (req.method !== 'POST') return res.status(405).json({ error:'Method Not Allowed' });
  if (!validSession(req)) return res.status(401).json({ error:'Unauthorized' });
  const action = req.body?.action;
  if (['upsert_account','delete_account','save_config','seed'].includes(action)) return res.status(200).json({ ok:true, mode:'local' });
  return res.status(400).json({ error:'Unknown action' });
}
