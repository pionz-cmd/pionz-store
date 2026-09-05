import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isAdminSessionValid } from '../_adminSession';

const COUNTER_NS = 'pionz-store-prod-6f92b';

const counterUrl = (action: string, key: string, params: Record<string, string> = {}) => {
  const query = new URLSearchParams({ readOnly: 'true', ...params });
  return `https://counterapi.com/api/${encodeURIComponent(COUNTER_NS)}/${encodeURIComponent(action)}/${encodeURIComponent(key)}?${query}`;
};

async function readCounter(action: string, key: string, params: Record<string, string> = {}) {
  try {
    const response = await fetch(counterUrl(action, key, params), { cache: 'no-store' });
    if (!response.ok) return 0;
    const data = await response.json();
    return Number(data?.value ?? 0) || 0;
  } catch {
    return 0;
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST' && req.method !== 'GET') return res.status(405).json({ error: 'Method Not Allowed' });
  if (!isAdminSessionValid(req)) return res.status(401).json({ error: 'Unauthorized' });

  const body = req.method === 'POST' ? (req.body ?? {}) : {};
  const accounts = Array.isArray(body.accounts) ? body.accounts : [];
  const safeAccounts = accounts
    .filter((a: any) => a && typeof a === 'object')
    .map((a: any) => ({
      id: typeof a.id === 'string' ? a.id.slice(0, 120) : '',
      code: typeof a.code === 'string' ? a.code.slice(0, 80) : '',
      title: typeof a.title === 'string' ? a.title.slice(0, 160) : '',
    }))
    .filter((a: any) => a.code || a.id)
    .slice(0, 100);

  const [totalVisits, uniqueVisitors, visits24h, unique24h, visits7d, unique7d, stockChecks, buyClicks] = await Promise.all([
    readCounter('view', 'home'),
    readCounter('view', 'home', { unique: 'true' }),
    readCounter('view', 'home', { timeline: '24h' }),
    readCounter('view', 'home', { timeline: '24h', unique: 'true' }),
    readCounter('view', 'home', { timeline: '7d' }),
    readCounter('view', 'home', { timeline: '7d', unique: 'true' }),
    readCounter('account_view', 'any'),
    readCounter('buy_click', 'any'),
  ]);

  const accountCounts = await Promise.all(
    safeAccounts.map(async (account: any) => ({
      account_id: account.id,
      account_code: account.code,
      title: account.title,
      checks: await readCounter('account_view', account.code || account.id),
    }))
  );

  accountCounts.sort((a, b) => b.checks - a.checks);

  return res.status(200).json({
    totalVisits,
    uniqueVisitors,
    visits24h,
    unique24h,
    visits7d,
    unique7d,
    stockChecks,
    buyClicks,
    topAccounts: accountCounts.filter((item) => item.checks > 0).slice(0, 10),
    provider: 'CounterAPI',
  });
}
