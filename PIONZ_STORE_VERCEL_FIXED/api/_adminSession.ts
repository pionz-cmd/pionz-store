import { createHmac, timingSafeEqual } from 'node:crypto';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const COOKIE_NAME = 'pionz_admin_session';
const SESSION_TTL_SECONDS = 60 * 60 * 12;
const FALLBACK_SECRET = 'PIONZ-SESSION-9xK7mQ2vL8rT5pN4';
const secret = () => process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_PASSWORD || FALLBACK_SECRET;

export const createAdminSession = () => {
  const expiresAt = Math.floor(Date.now() / 1000) + SESSION_TTL_SECONDS;
  const payload = Buffer.from(JSON.stringify({ exp: expiresAt })).toString('base64url');
  const signature = createHmac('sha256', secret()).update(payload).digest('base64url');
  return `${payload}.${signature}`;
};
export const setAdminSessionCookie = (res: VercelResponse) => {
  const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=${createAdminSession()}; HttpOnly; Path=/; Max-Age=${SESSION_TTL_SECONDS}; SameSite=Lax${secure}`);
};
export const clearAdminSessionCookie = (res: VercelResponse) => {
  res.setHeader('Set-Cookie', `${COOKIE_NAME}=; HttpOnly; Path=/; Max-Age=0; SameSite=Lax`);
};
export const isAdminSessionValid = (req: VercelRequest) => {
  const raw = req.headers.cookie || '';
  const match = raw.split(';').map((part) => part.trim()).find((part) => part.startsWith(`${COOKIE_NAME}=`));
  if (!match) return false;
  const token = match.slice(COOKIE_NAME.length + 1);
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return false;
  try {
    const expected = createHmac('sha256', secret()).update(payload).digest('base64url');
    const a = Buffer.from(signature); const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    return Number(data.exp) > Math.floor(Date.now() / 1000);
  } catch { return false; }
};
