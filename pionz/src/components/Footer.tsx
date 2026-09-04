import React from 'react';
import { StoreConfig } from '../types';
import { formatWaNumber, getDirectSellWaUrl } from '../utils/whatsapp';
import {
  MessageCircle,
  Instagram,
  ShieldCheck,
  ExternalLink,
  Play,
  Radio,
  Sparkles
} from 'lucide-react';

interface FooterProps {
  config: StoreConfig;
  onReplayIntro: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  config,
  onReplayIntro,
}) => {
  const currentYear = new Date().getFullYear();
  const wa1Link = `https://wa.me/${formatWaNumber(config.wa1)}`;
  const wa2Link = `https://wa.me/${formatWaNumber(config.wa2)}`;
  const sellWaLink = getDirectSellWaUrl(config.wa1);
  const igLink = `https://instagram.com/${config.instagram.replace('@', '')}`;
  const channelLink = config.waChannel || 'https://whatsapp.com/channel/0029VbBF3Co59PwYb9Vl3J0z';

  return (
    <footer className="w-full bg-[#070b14] border-t border-slate-800/80 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Brand & About */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl overflow-hidden border border-sky-500/40 p-0.5 bg-gradient-to-br from-sky-500/20 to-blue-600/20 shrink-0 shadow-md">
                <img
                  src={config.logoUrl}
                  alt={config.storeName}
                  className="w-full h-full object-cover rounded-lg"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-bold text-base text-white tracking-wider font-display">
                {config.storeName}
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              Pusat tempat jual beli akun game Free Fire terpercaya. Anti hackback, proses kilat, dan transaksi 100% amanah bergaransi resmi.
            </p>

            <div className="flex items-center gap-4 pt-1">
              <button
                onClick={onReplayIntro}
                className="inline-flex items-center gap-1.5 text-slate-400 hover:text-sky-300 transition-colors text-[11px] cursor-pointer"
              >
                <Play className="w-3 h-3" />
                <span>Putar Animasi Pembuka</span>
              </button>

              <a
                href={sellWaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-sky-400 hover:text-sky-300 text-[11px] font-semibold"
              >
                <Sparkles className="w-3 h-3" />
                <span>Jual Akun ke Admin</span>
              </a>
            </div>
          </div>

          {/* Official Contacts & Channel */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-display text-sky-400">
              Kontak & Komunitas Resmi
            </h4>
            <div className="space-y-2">
              {/* Saluran WhatsApp */}
              <a
                href={channelLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-2 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-600/40 text-emerald-300 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                  <span className="font-semibold text-xs">Saluran WhatsApp Resmi</span>
                </div>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              </a>

              <a
                href={wa1Link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-sky-300 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-sky-400 shrink-0" />
                <span>WhatsApp Admin 1: <strong className="text-white font-mono">{config.wa1}</strong></span>
              </a>

              <a
                href={wa2Link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-sky-300 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-sky-400 shrink-0" />
                <span>WhatsApp Admin 2: <strong className="text-white font-mono">{config.wa2}</strong></span>
              </a>

              <a
                href={igLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 hover:text-sky-300 transition-colors"
              >
                <Instagram className="w-4 h-4 text-sky-400 shrink-0" />
                <span>Instagram: <strong className="text-white">@{config.instagram}</strong></span>
              </a>
            </div>
          </div>

          {/* Guarantee & Anti-Fraud Notice */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider font-display text-sky-400">
              Jaminan Keamanan 100%
            </h4>
            <div className="bg-[#0b1324] border border-slate-800 p-3.5 rounded-xl space-y-2">
              <div className="flex items-center gap-1.5 text-sky-300 font-semibold text-xs">
                <ShieldCheck className="w-4 h-4 text-sky-400" />
                <span>Garansi Anti Hackback (HB)</span>
              </div>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Hati-hati terhadap pihak penipu yang mengatasnamakan PIONZ STORE di luar 2 nomor WhatsApp resmi dan Saluran WhatsApp resmi kami di atas.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar with Discreet Admin Access */}
        <div className="mt-10 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <div>
            © {currentYear} {config.storeName}. Hak Cipta Dilindungi.
          </div>

          {/* Admin access is intentionally hidden from the public storefront.
              Owners can still open the private admin gate with Ctrl+Shift+A. */}
        </div>
      </div>
    </footer>
  );
};
