import type { VercelRequest, VercelResponse } from '@vercel/node';
import { isAdminSessionValid } from './_adminSession';

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function db(path: string, init: RequestInit = {}) {
  if (!url || !key) throw new Error('Supabase belum dikonfigurasi.');
  const r = await fetch(`${url}/rest/v1/${path}`, {
    ...init,
    headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': 'application/json', ...(init.headers || {}) },
  });
  const text = await r.text();
  if (!r.ok) throw new Error(text || `Database error ${r.status}`);
  return text ? JSON.parse(text) : null;
}

const productRow = (a: any) => ({ id:a.id, code:a.code, title:a.title, price:a.price, original_price:a.originalPrice ?? null, category:a.category, level:a.level, rank:a.rank, evo_guns:a.evoGuns ?? [], vault_count:a.vaultCount ?? 0, key_items:a.keyItems ?? [], login_type:a.loginType, bind_status:a.bindStatus, status:a.status, featured:!!a.featured, hot_deal:!!a.hotDeal, images:a.images ?? [], description:a.description ?? '', created_at:a.createdAt || new Date().toISOString(), updated_at:new Date().toISOString() });
const productOut = (a:any) => ({ id:a.id, code:a.code, title:a.title, price:Number(a.price||0), originalPrice:a.original_price==null?undefined:Number(a.original_price), category:a.category, level:Number(a.level||0), rank:a.rank, evoGuns:a.evo_guns||[], vaultCount:Number(a.vault_count||0), keyItems:a.key_items||[], loginType:a.login_type, bindStatus:a.bind_status, status:a.status, featured:a.featured, hotDeal:a.hot_deal, images:a.images||[], description:a.description, createdAt:a.created_at });

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    if (req.method === 'GET') {
      const [products, config] = await Promise.all([
        db('products?select=*&order=created_at.desc'),
        db('store_config?select=*&id=eq.true&limit=1'),
      ]);
      return res.status(200).json({ accounts: (products||[]).map(productOut), config: config?.[0] ? { storeName:config[0].store_name, tagline:config[0].tagline, logoUrl:config[0].logo_url, wa1:config[0].wa1, wa2:config[0].wa2, waChannel:config[0].wa_channel, instagram:config[0].instagram, announcement:config[0].announcement } : null });
    }
    if (!isAdminSessionValid(req)) return res.status(401).json({error:'Unauthorized'});
    if (req.method !== 'POST') return res.status(405).json({error:'Method Not Allowed'});
    const { action, account, id, config } = req.body || {};
    if (action === 'upsert_account') {
      await db('products?on_conflict=id', { method:'POST', headers:{ Prefer:'resolution=merge-duplicates,return=minimal' }, body:JSON.stringify(productRow(account)) });
      return res.status(200).json({ok:true});
    }
    if (action === 'delete_account') {
      await db(`products?id=eq.${encodeURIComponent(id)}`, {method:'DELETE'}); return res.status(200).json({ok:true});
    }
    if (action === 'save_config') {
      const row={id:true,store_name:config.storeName,tagline:config.tagline,logo_url:config.logoUrl,wa1:config.wa1,wa2:config.wa2,wa_channel:config.waChannel,instagram:config.instagram,announcement:config.announcement,updated_at:new Date().toISOString()};
      await db('store_config?on_conflict=id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(row)}); return res.status(200).json({ok:true});
    }
    if (action === 'seed') {
      const accounts = Array.isArray(req.body.accounts) ? req.body.accounts : [];
      if (accounts.length) await db('products?on_conflict=id',{method:'POST',headers:{Prefer:'resolution=merge-duplicates,return=minimal'},body:JSON.stringify(accounts.map(productRow))});
      return res.status(200).json({ok:true,count:accounts.length});
    }
    return res.status(400).json({error:'Unknown action'});
  } catch (e:any) { return res.status(500).json({error:e?.message || 'Server error'}); }
}
