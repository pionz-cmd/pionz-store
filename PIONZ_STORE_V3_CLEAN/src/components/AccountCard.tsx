import React from 'react';
import { FFAccount, StoreConfig } from '../types';
import { formatRupiah, createWhatsAppBuyLink } from '../utils/whatsapp';
import {
  ShieldCheck,
  Flame,
  Zap,
  Eye,
  MessageCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

interface AccountCardProps {
  account: FFAccount;
  config: StoreConfig;
  onViewDetail: (account: FFAccount) => void;
}

export const AccountCard: React.FC<AccountCardProps> = ({
  account,
  config,
  onViewDetail,
}) => {
  const isSold = account.status === 'sold';
  const isBooked = account.status === 'booked';
  const buyWaLink = createWhatsAppBuyLink(account, config, 'wa1');

  return (
    <div
      id={`account-card-${account.code}`}
      className={`group relative rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col pionz-glow pionz-noise ${
        isSold
          ? 'bg-[#070b14]/50 border-slate-800/60 opacity-75'
          : 'bg-[#0b1324]/80 border-slate-800 hover:border-sky-500/40 hover:shadow-xl hover:shadow-sky-950/40'
      }`}
    >
      {/* Top Media / Thumbnail */}
      <div className="relative aspect-[16/10] overflow-hidden bg-slate-950 cursor-pointer" onClick={() => onViewDetail(account)}>
        <img
          src={account.images[0] || config.logoUrl}
          alt={account.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          referrerPolicy="no-referrer"
        />

        {/* Gradient Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07101f] via-[#07101f]/10 to-black/55" />
        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-sky-950/30 to-transparent pointer-events-none" />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-1.5 z-10">
          <div className="flex items-center gap-1.5">
            <span className="bg-slate-950/85 backdrop-blur text-sky-300 font-mono font-bold text-xs px-2.5 py-1 rounded-lg border border-sky-500/30 shadow-md">
              {account.code}
            </span>

            {account.hotDeal && !isSold && (
              <span className="flex items-center gap-1 bg-gradient-to-r from-blue-600 to-sky-500 text-white font-bold text-[10px] px-2 py-1 rounded-lg shadow-md uppercase tracking-wider">
                <Flame className="w-3 h-3" />
                HOT DEAL
              </span>
            )}
          </div>

          {/* Status badge */}
          {isSold ? (
            <span className="bg-red-950/90 text-red-300 border border-red-800/80 font-bold text-[11px] px-2.5 py-0.5 rounded-lg">
              TERJUAL
            </span>
          ) : isBooked ? (
            <span className="bg-amber-950/90 text-amber-300 border border-amber-800/80 font-bold text-[11px] px-2.5 py-0.5 rounded-lg">
              BOOKED
            </span>
          ) : (
            <span className="bg-emerald-950/85 text-emerald-300 border border-emerald-700/80 font-bold text-[10px] px-2 py-0.5 rounded-lg flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              READY
            </span>
          )}
        </div>

        {/* Level & Rank Badge bottom left on image */}
        <div className="absolute bottom-2.5 left-2.5 z-10 flex items-center gap-1.5">
          <span className="bg-slate-900/90 backdrop-blur text-slate-200 text-[10px] font-semibold px-2 py-0.5 rounded border border-slate-700">
            Lv. {account.level}
          </span>
          <span className="bg-slate-900/90 backdrop-blur text-sky-300 text-[10px] font-semibold px-2 py-0.5 rounded border border-sky-500/20">
            {account.rank}
          </span>
        </div>

        {/* Image count pill */}
        {account.images.length > 1 && (
          <div className="absolute bottom-2.5 right-2.5 z-10 bg-black/70 backdrop-blur text-slate-300 text-[10px] px-1.5 py-0.5 rounded">
            +{account.images.length} Foto
          </div>
        )}
      </div>

      {/* Account Info Body */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Title */}
          <h3
            onClick={() => onViewDetail(account)}
            className="font-bold text-sm text-white line-clamp-2 hover:text-sky-300 transition-colors cursor-pointer leading-snug"
          >
            {account.title}
          </h3>

          {/* Evo Guns preview */}
          {account.evoGuns.length > 0 && (
            <div className="mt-2.5 flex items-center gap-1 text-[11px] text-sky-400 bg-sky-950/30 border border-sky-500/20 px-2 py-1 rounded-lg">
              <Zap className="w-3.5 h-3.5 shrink-0 text-sky-400" />
              <span className="truncate">
                {account.evoGuns.slice(0, 2).join(' • ')}
                {account.evoGuns.length > 2 && ` +${account.evoGuns.length - 2} Evo lagi`}
              </span>
            </div>
          )}

          {/* Seller description preview */}
          <p className="mt-2 text-[11px] text-slate-400 line-clamp-2 leading-relaxed">
            {account.description}
          </p>

          {/* Key items tags */}
          <div className="mt-2 flex flex-wrap gap-1">
            {account.keyItems.slice(0, 3).map((item, idx) => (
              <span
                key={idx}
                className="text-[10px] bg-slate-900 text-slate-300 border border-slate-800 px-1.5 py-0.5 rounded"
              >
                {item}
              </span>
            ))}
            {account.keyItems.length > 3 && (
              <span className="text-[10px] bg-slate-900 text-slate-400 px-1.5 py-0.5 rounded">
                +{account.keyItems.length - 3} item
              </span>
            )}
          </div>
        </div>

        {/* Price & Action Area */}
        <div className="pt-3 border-t border-slate-800/80 space-y-2.5">
          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-xl font-black text-sky-300 font-mono tracking-tight">
                {formatRupiah(account.price)}
              </div>
              {account.originalPrice && (
                <div className="text-[11px] text-slate-500 line-through font-mono">
                  {formatRupiah(account.originalPrice)}
                </div>
              )}
            </div>

            <div className="text-right">
              <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 bg-slate-900 border border-slate-800 px-2 py-0.5 rounded">
                <ShieldCheck className="w-3 h-3 text-sky-400" />
                {account.bindStatus}
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => onViewDetail(account)}
              className="flex items-center justify-center gap-1 text-xs font-semibold py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 hover:border-sky-500/40 text-slate-200 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Detail Spek</span>
            </button>

            {!isSold ? (
              <a
                href={buyWaLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 text-xs font-bold py-2 px-3 rounded-xl bg-sky-600 hover:bg-sky-500 text-white shadow-md shadow-sky-950 transition-all cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Beli via WA</span>
              </a>
            ) : (
              <button
                disabled
                className="flex items-center justify-center gap-1 text-xs font-semibold py-2 px-3 rounded-xl bg-slate-900 border border-slate-800 text-slate-500 cursor-not-allowed"
              >
                <span>Sudah Terjual</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
