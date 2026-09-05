import type { VercelRequest, VercelResponse } from '@vercel/node';

const COUNTER_NS = 'pionz-store-prod-6f92b';
const allowedEvents = new Set(['page_view', 'account_view', 'buy_click', 'category_filter', 'search']);

const clean = (value: unknown, max = 120) =>
  typeof value === 'string' ? value.trim().slice(0, max) : '';

const counterUrl = (action: string, key: string, params: Record<string, string> = {}) => {
  const query = new URLSearchParams(params);
  return `https://counterapi.com/api/${encodeURIComponent(COUNTER_NS)}/${encodeURIComponent(action)}/${encodeURIComponent(key)}${query.toString() ? `?${query}` : ''}`;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  const body = req.body ?? {};
  const eventType = clean(body.eventType, 40);
  const visitorId = clean(body.visitorId, 120);
  if (!allowedEvents.has(eventType) || !visitorId) return res.status(400).json({ error: 'Invalid analytics event.' });

  let action = 'view';
  let key = 'home';
  const params: Record<string, string> = { userId: visitorId };

  if (eventType === 'account_view') {
    action = 'account_view';
    key = clean(body.accountCode, 80) || clean(body.accountId, 120) || 'unknown';
  } else if (eventType === 'buy_click') {
    action = 'buy_click';
    key = clean(body.accountCode, 80) || clean(body.accountId, 120) || 'unknown';
  } else if (eventType === 'category_filter') {
    action = 'category_filter';
    key = clean(body.value, 80) || 'unknown';
  } else if (eventType === 'search') {
    action = 'search';
    key = 'all';
    const value = clean(body.value, 120);
    if (value) params.query = value;
  }

  try {
    const response = await fetch(counterUrl(action, key, params), { method: 'GET' });
    if (!response.ok) console.error('Analytics counter failed:', response.status, await response.text());
  } catch (error) {
    console.error('Analytics counter error:', error);
  }

  return res.status(204).end();
}
