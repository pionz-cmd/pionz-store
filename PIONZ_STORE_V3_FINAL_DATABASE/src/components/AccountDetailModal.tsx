import React, { useState } from 'react';
import { FFAccount, StoreConfig } from '../types';
import { trackEvent } from '../utils/analytics';
import { formatRupiah, createWhatsAppBuyLink, formatWaNumber } from '../utils/whatsapp';
import {
  X,
  ShieldCheck,
  Zap,
  Flame,
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  Clock,
  Layers,
  Award,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface AccountDetailModalProps {
  account: FFAccount | null;
  config: StoreConfig;
  onClose: () => void;
}

export const AccountDetailModal: React.FC<AccountDetailModalProps> = ({
  account,
  config,
  onClose,
}) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  if (!account) return null;

  const isSold = account.status === 'sold';
  const wa1BuyLink = createWhatsAppBuyLink(account, config, 'wa1');
  const wa2BuyLink = createWhatsAppBuyLink(account, config, 'wa2');

  const nextImage = () => {
    setActiveImageIndex((prev) => (prev + 1) % account.images.length);
  };

  const prevImage = () => {
    setActiveImageIndex((prev) => (prev - 1 + account.images.length) % account.images.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div
        id="account-detail-modal-box"
        className="relative w-full max-w-3xl bg-[#0b1324] border border-sky-500/30 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-100"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#070b14]/90">
          <div className="flex items-center gap-2.5">
            <span className="font-mono font-bold text-xs bg-sky-950 text-sky-300 border border-sky-700/60 px-2.5 py-1 rounded-lg">
              {account.code}
            </span>
            <h2 className="text-sm sm:text-base font-bold text-white line-clamp-1 font-display">
              {account.title}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          
          {/* Image Gallery */}
          <div className="relative aspect-[16/9] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 group">
            <img
              src={account.images[activeImageIndex] || config.logoUrl}
              alt={`${account.title} screenshot ${activeImageIndex + 1}`}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />

            {/* Navigation buttons */}
            {account.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 hover:bg-black/90 text-white transition-opacity cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/70 hover:bg-black/90 text-white transition-opacity cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
                <div className="absolute bottom-2 right-2 bg-black/80 backdrop-blur px-2.5 py-1 rounded-full text-xs font-mono text-slate-300">
                  {activeImageIndex + 1} / {account.images.length}
                </div>
              </>
            )}

            {/* Status flag */}
            <div className="absolute top-3 left-3">
              {isSold ? (
                <span className="bg-red-950 text-red-300 border border-red-700 font-bold text-xs px-3 py-1 rounded-lg">
                  SUDAH TERJUAL
                </span>
              ) : (
                <span className="bg-emerald-950 text-emerald-300 border border-emerald-700 font-bold text-xs px-3 py-1 rounded-lg flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  AKUN READY UNTUK DIBELI
                </span>
              )}
            </div>
          </div>

          {/* Pricing & Key Summary Grid */}
          <div className="bg-[#070b14]/70 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="text-xs text-slate-400 font-medium">Harga Akun (Nett / Nego):</div>
              <div className="text-2xl sm:text-3xl font-black text-sky-300 font-mono">
                {formatRupiah(account.price)}
              </div>
              {account.originalPrice && (
                <div className="text-xs text-slate-500 line-through font-mono">
                  Harga Awal: {formatRupiah(account.originalPrice)}
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <div className="bg-slate-900 border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs">
                <span className="text-slate-400 block text-[10px]">Level Akun</span>
                <span className="font-bold text-white">{account.level}</span>
              </div>
              <div className="bg-slate-900 border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs">
                <span className="text-slate-400 block text-[10px]">Rank Sekarang</span>
                <span className="font-bold text-sky-300">{account.rank}</span>
              </div>
              <div className="bg-slate-900 border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs">
                <span className="text-slate-400 block text-[10px]">Login Platform</span>
                <span className="font-bold text-white">{account.loginType}</span>
              </div>
              <div className="bg-slate-900 border border-slate-700/80 px-3 py-1.5 rounded-lg text-xs">
                <span className="text-slate-400 block text-[10px]">Kondisi Bind</span>
                <span className="font-bold text-emerald-400">{account.bindStatus}</span>
              </div>
            </div>
          </div>

          {/* Unified Account Sheet */}
          <div className="rounded-2xl border border-sky-500/20 bg-gradient-to-br from-sky-950/25 via-[#070b14]/80 to-[#070b14] overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-800 flex items-center justify-between">
              <div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-sky-400 font-black">Account Information</div>
                <div className="text-sm font-bold text-white mt-0.5">Detail lengkap akun</div>
              </div>
              <span className="text-[10px] font-mono text-slate-500">{account.code}</span>
            </div>
            <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {[
                ['Level', `Lv ${account.level}`],
                ['Rank', account.rank],
                ['Login', account.loginType],
                ['Bind', account.bindStatus],
                ['Vault', `${account.vaultCount}+ item`],
                ['Evo Gun', `${account.evoGuns.length} koleksi`],
                ['Status', isSold ? 'Terjual' : 'Ready'],
                ['Listing', account.category.toUpperCase()],
              ].map(([label, value]) => (
                <div key={label} className="rounded-xl bg-slate-900/70 border border-slate-800 px-3 py-2.5">
                  <div className="text-[9px] uppercase tracking-wider text-slate-500 font-bold">{label}</div>
                  <div className="mt-1 text-[11px] sm:text-xs font-bold text-slate-100 break-words">{value}</div>
                </div>
              ))}
            </div>
            <div className="px-4 pb-4">
              <div className="rounded-xl bg-black/20 border border-slate-800 p-3.5">
                <div className="text-[10px] uppercase tracking-wider text-slate-500 font-bold mb-1.5">Deskripsi Penjual</div>
                <p className="text-xs sm:text-sm text-slate-300 leading-relaxed whitespace-pre-line">{account.description}</p>
              </div>
            </div>
          </div>

          {/* Evo Guns List */}
          {account.evoGuns.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400">
                <Zap className="w-4 h-4 text-sky-400" />
                <span>Koleksi Senjata Evo ({account.evoGuns.length} Senjata)</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {account.evoGuns.map((gun, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-[#070b14]/60 border border-slate-800 p-2.5 rounded-xl text-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-sky-400 shrink-0" />
                    <span className="text-slate-200 font-medium">{gun}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vault Highlights */}
          {account.keyItems.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-300">
                <Layers className="w-4 h-4 text-sky-300" />
                <span>Vault & Bundle Langka (Total Vault: {account.vaultCount}+)</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {account.keyItems.map((item, idx) => (
                  <span
                    key={idx}
                    className="text-xs bg-slate-900 border border-slate-700/80 text-slate-200 px-3 py-1.5 rounded-lg"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Guarantee & Anti-HB Notice */}
          <div className="bg-sky-950/20 border border-sky-500/20 p-4 rounded-xl space-y-2 text-xs">
            <div className="flex items-center gap-2 text-sky-300 font-bold">
              <ShieldCheck className="w-4 h-4 text-sky-400" />
              <span>Garansi 100% Anti Hackback & Keamanan PIONZ STORE</span>
            </div>
            <p className="text-slate-300 text-[11px] leading-relaxed">
              Seluruh akun yang terdaftar telah melalui proses verifikasi identitas dan pengecekan bind ketat oleh admin. Kami memberikan garansi anti hackback seumur hidup serta panduan pemindahan email dan nomor telepon hingga tuntas.
            </p>
          </div>
        </div>

        {/* Modal Action Footer */}
        <div className="p-4 border-t border-slate-800 bg-[#070b14]/95 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-400 text-center sm:text-left">
            Siap transaksi? Pilih nomor admin untuk langsung proses pesanan via WhatsApp.
          </div>

          {!isSold ? (
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <a
                href={wa1BuyLink}
                onClick={() => void trackEvent('buy_click', { accountId: account.id, accountCode: account.code, value: 'wa1' })}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-lg shadow-sky-950 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Beli via Admin 1</span>
              </a>

              <a
                href={wa2BuyLink}
                onClick={() => void trackEvent('buy_click', { accountId: account.id, accountCode: account.code, value: 'wa2' })}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs px-4 py-2.5 rounded-xl border border-slate-700 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Beli via Admin 2</span>
              </a>
            </div>
          ) : (
            <button
              disabled
              className="w-full sm:w-auto px-6 py-2.5 bg-slate-900 border border-slate-800 text-slate-500 text-xs font-bold rounded-xl cursor-not-allowed"
            >
              Akun Sudah Laku Terjual
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
