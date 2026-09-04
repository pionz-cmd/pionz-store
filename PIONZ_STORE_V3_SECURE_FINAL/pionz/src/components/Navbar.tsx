import React, { useState } from 'react';
import { MessageCircle, Instagram, Menu, X, ExternalLink, Sparkles, Radio } from 'lucide-react';
import { StoreConfig } from '../types';
import { formatWaNumber, getDirectSellWaUrl } from '../utils/whatsapp';

interface NavbarProps {
  config: StoreConfig;
  onScrollToSection: (sectionId: string) => void;
  onReplayIntro: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  config,
  onScrollToSection,
  onReplayIntro,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [waDropdownOpen, setWaDropdownOpen] = useState(false);

  const wa1Link = `https://wa.me/${formatWaNumber(config.wa1)}?text=${encodeURIComponent('Halo Admin 1 PIONZ STORE, saya mau tanya-tanya akun Free Fire.')}`;
  const wa2Link = `https://wa.me/${formatWaNumber(config.wa2)}?text=${encodeURIComponent('Halo Admin 2 PIONZ STORE, saya mau tanya-tanya akun Free Fire.')}`;
  const sellWaLink = getDirectSellWaUrl(config.wa1);
  const igLink = `https://instagram.com/${config.instagram.replace('@', '')}`;
  const channelLink = config.waChannel || 'https://whatsapp.com/channel/0029VbBF3Co59PwYb9Vl3J0z';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-[#080d18]/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <button
              onClick={onReplayIntro}
              title="Putar Ulang Animasi Pembuka"
              className="group relative cursor-pointer focus:outline-none"
            >
              <div className="relative w-11 h-11 rounded-xl overflow-hidden border border-sky-500/40 p-0.5 bg-gradient-to-br from-sky-500/20 to-blue-600/20 group-hover:border-sky-400 transition-all shadow-md shadow-sky-500/10">
                <img
                  src={config.logoUrl}
                  alt={config.storeName}
                  className="w-full h-full object-cover rounded-lg"
                  referrerPolicy="no-referrer"
                />
              </div>
            </button>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-sky-300 to-blue-400 font-display">
                  {config.storeName}
                </h1>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 border border-emerald-800/60 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  ONLINE 24/7
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium tracking-wide">
                {config.tagline} Free Fire
              </p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-5 text-sm font-medium text-slate-300">
            <button
              onClick={() => onScrollToSection('katalog-section')}
              className="hover:text-sky-400 transition-colors cursor-pointer"
            >
              Katalog Akun
            </button>

            {/* Direct WhatsApp Sell Link - No tedious form */}
            <a
              href={sellWaLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-300 px-3.5 py-1.5 rounded-lg transition-all font-semibold cursor-pointer flex items-center gap-1.5 text-xs"
            >
              <Sparkles className="w-3.5 h-3.5 text-sky-400" />
              <span>Jual Akun ke WA</span>
            </a>

            {/* Official WhatsApp Channel Link */}
            <a
              href={channelLink}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-3 py-1.5 rounded-lg transition-all font-semibold flex items-center gap-1.5 text-xs"
              title="Ikuti Saluran WhatsApp Resmi PIONZ STORE"
            >
              <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span>Saluran WA Resmi</span>
            </a>
          </nav>

          {/* Contact & Social CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Instagram */}
            <a
              href={igLink}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-slate-400 hover:text-sky-400 hover:bg-slate-900 rounded-lg transition-colors border border-slate-800"
              title={`Instagram: @${config.instagram}`}
            >
              <Instagram className="w-4 h-4" />
            </a>

            {/* WhatsApp Dropdown */}
            <div className="relative">
              <button
                onClick={() => setWaDropdownOpen(!waDropdownOpen)}
                className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold px-3.5 py-2 rounded-lg transition-all shadow-lg shadow-sky-950 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white/20" />
                <span>Chat Admin WA</span>
              </button>

              {waDropdownOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-[#0b1324] border border-slate-700 rounded-xl shadow-2xl p-2 z-50 text-xs">
                  <div className="px-3 py-1.5 text-[10px] text-slate-400 font-semibold uppercase tracking-wider border-b border-slate-800 mb-1">
                    Pilih Nomor Admin Resmi:
                  </div>
                  <a
                    href={wa1Link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setWaDropdownOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-800/80 transition-colors text-slate-200"
                  >
                    <div>
                      <div className="font-semibold text-sky-300">Admin 1 (Utama)</div>
                      <div className="text-slate-400 font-mono text-[11px]">{config.wa1}</div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                  <a
                    href={wa2Link}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setWaDropdownOpen(false)}
                    className="flex items-center justify-between p-2.5 rounded-lg hover:bg-slate-800/80 transition-colors text-slate-200"
                  >
                    <div>
                      <div className="font-semibold text-sky-300">Admin 2 (Cadangan)</div>
                      <div className="text-slate-400 font-mono text-[11px]">{config.wa2}</div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                  </a>
                  
                  {/* Channel in dropdown */}
                  <div className="pt-1.5 mt-1.5 border-t border-slate-800">
                    <a
                      href={channelLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setWaDropdownOpen(false)}
                      className="flex items-center justify-between p-2 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-700/50 text-emerald-300"
                    >
                      <div className="flex items-center gap-1.5">
                        <Radio className="w-3 h-3 text-emerald-400" />
                        <span className="font-semibold text-[11px]">Saluran WA PIONZ</span>
                      </div>
                      <ExternalLink className="w-3 h-3 text-emerald-400" />
                    </a>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
              aria-label="Buka Menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-800 space-y-3">
            <div className="flex flex-col space-y-2 text-sm">
              <button
                onClick={() => {
                  onScrollToSection('katalog-section');
                  setMobileMenuOpen(false);
                }}
                className="text-left px-3 py-2 rounded-lg text-slate-300 hover:bg-slate-900"
              >
                Katalog Akun Free Fire
              </button>
              
              {/* Direct WhatsApp Sell on Mobile */}
              <a
                href={sellWaLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-sky-300 bg-sky-950/40 border border-sky-500/20 font-medium"
              >
                <span className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  Jual Akun Langsung ke WA
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-sky-400" />
              </a>

              {/* Channel on Mobile */}
              <a
                href={channelLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between px-3 py-2 rounded-lg text-emerald-300 bg-emerald-950/40 border border-emerald-500/30 font-semibold"
              >
                <span className="flex items-center gap-2">
                  <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
                  Gabung Saluran WhatsApp Resmi
                </span>
                <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              </a>
            </div>

            <div className="pt-2 border-t border-slate-800/80 space-y-2">
              <div className="text-[11px] text-slate-400 px-3">Kontak Admin Resmi:</div>
              <div className="grid grid-cols-2 gap-2 px-1">
                <a
                  href={wa1Link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 bg-sky-600 text-white text-xs font-semibold py-2 px-2 rounded-lg text-center"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WA Admin 1</span>
                </a>
                <a
                  href={wa2Link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 bg-sky-700 text-white text-xs font-semibold py-2 px-2 rounded-lg text-center"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>WA Admin 2</span>
                </a>
              </div>
              <a
                href={igLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-slate-800 text-slate-200 text-xs font-medium py-2 rounded-lg"
              >
                <Instagram className="w-4 h-4 text-sky-400" />
                <span>Instagram @{config.instagram}</span>
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
