import { FFAccount, StoreConfig } from '../types';

export function formatWaNumber(phone: string): string {
  const cleaned = phone.replace(/[^0-9]/g, '');
  if (cleaned.startsWith('0')) {
    return '62' + cleaned.slice(1);
  }
  if (cleaned.startsWith('62')) {
    return cleaned;
  }
  return '62' + cleaned;
}

export function formatRupiah(num: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(num);
}

export function getBuyAccountWaUrl(account: FFAccount, targetWa: string): string {
  const phone = formatWaNumber(targetWa);
  const text = `Halo Admin PIONZ STORE, saya berminat membeli akun Free Fire berikut:

*Kode Akun:* [${account.code}]
*Judul:* ${account.title}
*Harga:* ${formatRupiah(account.price)}
*Login:* ${account.loginType} (${account.bindStatus})
*Spek Singkat:* Level ${account.level} | ${account.rank} | ${account.evoGuns.length > 0 ? account.evoGuns.join(', ') : 'Vault ' + account.vaultCount}

Apakah akun ini masih READY min? Boleh minta detail lengkap cara transaksinya? Terima kasih!`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export function createWhatsAppBuyLink(account: FFAccount, config: StoreConfig, adminTarget: 'wa1' | 'wa2' = 'wa1'): string {
  const targetNumber = adminTarget === 'wa1' ? config.wa1 : config.wa2;
  return getBuyAccountWaUrl(account, targetNumber);
}

export function getDirectSellWaUrl(targetWa: string): string {
  const phone = formatWaNumber(targetWa);
  const text = `Halo Admin PIONZ STORE, saya mau jual / tawarkan akun Free Fire saya.

Boleh minta info format kirim spek akun, estimasi harga pasaran, dan tata cara jualnya min? Foto dan detail akun akan saya kirim setelah ini. Terima kasih!`;

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
}

export function getGeneralContactWaUrl(message: string, targetWa: string): string {
  const phone = formatWaNumber(targetWa);
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}
