import React, { useState } from 'react';
import { StoreConfig } from '../types';
import { formatWaNumber, getDirectSellWaUrl } from '../utils/whatsapp';
import { MessageCircle, X, ExternalLink, ShieldCheck, Radio, Sparkles } from 'lucide-react';

interface FloatingWhatsAppProps {
  config: StoreConfig;
}

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({ config }) => {
  const [isOpen, setIsOpen] = useState(false);

  const wa1Url = `https://wa.me/${formatWaNumber(config.wa1)}?text=${encodeURIComponent('Halo Admin 1 PIONZ STORE, saya mau tanya akun FF yang ready.')}`;
  const wa2Url = `https://wa.me/${formatWaNumber(config.wa2)}?text=${encodeURIComponent('Halo Admin 2 PIONZ STORE, saya mau tanya akun FF yang ready.')}`;
  const sellWaUrl = getDirectSellWaUrl(config.wa1);
  const channelUrl = config.waChannel || 'https://whatsapp.com/channel/0029VbBF3Co59PwYb9Vl3J0z';

  return (
    <div className="fixed bottom-5 right-5 z-40">
      {/* Expanded popup */}
      {isOpen && (
        <div className="mb-3 w-80 bg-[#0b1324] border border-sky-500/30 rounded-2xl shadow-2xl p-4 text-xs text-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="font-bold text-white font-display">CS Admin PIONZ STORE</span>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-slate-400 hover:text-white rounded"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <p className="text-[11px] text-slate-400 my-2 leading-relaxed">
            Hubungi nomor resmi WhatsApp admin untuk order akun, konsultasi, atau langsung titip jual:
          </p>

          <div className="space-y-2">
            {/* Saluran WhatsApp Resmi */}
            <a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-950/50 hover:bg-emerald-900/50 border border-emerald-600/50 transition-colors group"
            >
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400 group-hover:scale-105 transition-transform">
                  <Radio className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-emerald-300 text-xs">Saluran WhatsApp Resmi</div>
                  <div className="text-[10px] text-slate-300">Update akun ready & flash sale</div>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
            </a>

            {/* Admin 1 */}
            <a
              href={wa1Url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-sky-950/60 hover:bg-sky-900/60 border border-sky-700/60 transition-colors"
            >
              <div>
                <div className="font-bold text-sky-300 text-xs">Admin 1 (Utama)</div>
                <div className="text-[10px] text-slate-300 font-mono">{config.wa1}</div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
            </a>

            {/* Admin 2 */}
            <a
              href={wa2Url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 transition-colors"
            >
              <div>
                <div className="font-bold text-slate-200 text-xs">Admin 2 (Cadangan)</div>
                <div className="text-[10px] text-slate-400 font-mono">{config.wa2}</div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>

            {/* Direct Sell WA */}
            <a
              href={sellWaUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-2 rounded-xl bg-gradient-to-r from-blue-950/70 to-slate-900 border border-sky-600/30 hover:border-sky-500 text-sky-300 transition-colors"
            >
              <div className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-sky-400" />
                <span className="font-semibold text-xs text-white">Mau Jual Akun? Chat Admin</span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
            </a>
          </div>

          <div className="mt-2.5 pt-2 border-t border-slate-800 flex items-center justify-center gap-1.5 text-[10px] text-sky-300/90 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Garansi Anti Hackback & Data Aman 100%</span>
          </div>
        </div>
      )}

      {/* Floating Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative group flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-bold px-4 py-3 rounded-full shadow-2xl shadow-sky-950 cursor-pointer transition-all active:scale-95"
      >
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-sky-400 border-2 border-[#080d18] rounded-full animate-ping" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-sky-400 border-2 border-[#080d18] rounded-full" />
        <MessageCircle className="w-5 h-5 fill-white/20" />
        <span className="text-xs font-semibold hidden sm:inline-block">Chat Admin</span>
      </button>
    </div>
  );
};
