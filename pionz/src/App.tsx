import React, { useState, useEffect } from 'react';
import { FFAccount, StoreConfig, AccountCategory, AccountStatus, LoginLog } from './types';
import { initialAccounts, initialConfig } from './data/initialData';
import { IntroSplash } from './components/IntroSplash';
import { Navbar } from './components/Navbar';
import { AccountCard } from './components/AccountCard';
import { AccountDetailModal } from './components/AccountDetailModal';
import { Footer } from './components/Footer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { AdminSecurityGate } from './components/AdminSecurityGate';
import { AdminPanel } from './components/AdminPanel';
import { getDirectSellWaUrl } from './utils/whatsapp';
import {
  ShieldCheck,
  Search,
  Sparkles,
  Zap,
  Clock,
  Lock,
  ArrowRight,
  Radio,
  ExternalLink
} from 'lucide-react';

export default function App() {
  // Intro splash state
  const [showIntro, setShowIntro] = useState<boolean>(true);

  // Store persistence
  const [accounts, setAccounts] = useState<FFAccount[]>(() => {
    const saved = localStorage.getItem('pionz_store_accounts');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return initialAccounts;
  });

  const [config, setConfig] = useState<StoreConfig>(() => {
    const saved = localStorage.getItem('pionz_store_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const { adminUsername: _u, adminPassword: _p, securityKey: _k, ...safeConfig } = parsed;
        return safeConfig;
      } catch (e) {
        console.error(e);
      }
    }
    return initialConfig;
  });

  // Security Login Logs
  const [loginLogs, setLoginLogs] = useState<LoginLog[]>(() => {
    const saved = localStorage.getItem('pionz_store_logs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return [
      {
        id: 'log-init',
        timestamp: new Date().toLocaleString('id-ID'),
        status: 'SUCCESS',
        ipInfo: 'Sistem Terinisialisasi',
      },
    ];
  });

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('pionz_store_accounts', JSON.stringify(accounts));
  }, [accounts]);

  useEffect(() => {
    localStorage.setItem('pionz_store_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('pionz_store_logs', JSON.stringify(loginLogs));
  }, [loginLogs]);

  // Modals state
  const [selectedAccount, setSelectedAccount] = useState<FFAccount | null>(null);

  // Admin secret state
  const [isAdminGateOpen, setIsAdminGateOpen] = useState(false);
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false);

  // Catalog filter state
  const [selectedCategory, setSelectedCategory] = useState<AccountCategory | 'sold'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'default' | 'cheapest' | 'expensive' | 'level'>('default');

  // Secret keyboard shortcut: Ctrl+Shift+A opens Admin Gate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminGateOpen(true);
      }
    };

    // Check hash for #admin
    if (window.location.hash === '#admin' || window.location.hash === '#admin-portal') {
      setIsAdminGateOpen(true);
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // CRUD handlers for Admin
  const handleSaveAccount = (accountToSave: FFAccount) => {
    setAccounts((prev) => {
      const index = prev.findIndex((a) => a.id === accountToSave.id);
      if (index >= 0) {
        const next = [...prev];
        next[index] = accountToSave;
        return next;
      }
      return [accountToSave, ...prev];
    });
  };

  const handleDeleteAccount = (id: string) => {
    setAccounts((prev) => prev.filter((a) => a.id !== id));
  };

  const handleToggleStatus = (id: string, newStatus: AccountStatus) => {
    setAccounts((prev) =>
      prev.map((a) => (a.id === id ? { ...a, status: newStatus } : a))
    );
  };

  const handleSaveConfig = (newConfig: StoreConfig) => {
    setConfig(newConfig);
  };

  const handleResetData = () => {
    setAccounts(initialAccounts);
    setConfig(initialConfig);
    localStorage.removeItem('pionz_store_accounts');
    localStorage.removeItem('pionz_store_config');
  };

  const handleAdminSuccess = (log: LoginLog) => {
    setLoginLogs((prev) => [log, ...prev]);
    setIsAdminGateOpen(false);
    setIsAdminPanelOpen(true);
  };

  const handleAdminFailed = (log: LoginLog) => {
    setLoginLogs((prev) => [log, ...prev]);
  };

  // Filter accounts
  const filteredAccounts = accounts.filter((acc) => {
    // Category filter
    if (selectedCategory === 'sold') {
      if (acc.status !== 'sold') return false;
    } else if (selectedCategory !== 'all') {
      if (acc.category !== selectedCategory) return false;
    }

    // Search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const matchCode = acc.code.toLowerCase().includes(query);
      const matchTitle = acc.title.toLowerCase().includes(query);
      const matchEvo = acc.evoGuns.some((g) => g.toLowerCase().includes(query));
      const matchItems = acc.keyItems.some((k) => k.toLowerCase().includes(query));
      const matchLogin = acc.loginType.toLowerCase().includes(query);
      if (!matchCode && !matchTitle && !matchEvo && !matchItems && !matchLogin) {
        return false;
      }
    }

    return true;
  });

  // Sort accounts
  const sortedAccounts = [...filteredAccounts].sort((a, b) => {
    if (sortBy === 'cheapest') return a.price - b.price;
    if (sortBy === 'expensive') return b.price - a.price;
    if (sortBy === 'level') return b.level - a.level;
    // Default: ready first, hot deals on top
    if (a.status === 'ready' && b.status === 'sold') return -1;
    if (a.status === 'sold' && b.status === 'ready') return 1;
    if (a.hotDeal && !b.hotDeal) return -1;
    if (!a.hotDeal && b.hotDeal) return 1;
    return 0;
  });

  const availableCount = accounts.filter((a) => a.status === 'ready').length;
  const directSellUrl = getDirectSellWaUrl(config.wa1);
  const channelUrl = config.waChannel || 'https://whatsapp.com/channel/0029VbBF3Co59PwYb9Vl3J0z';

  return (
    <div className="min-h-screen bg-[#080d18] text-slate-100 flex flex-col font-sans selection:bg-sky-500 selection:text-white">
      
      {/* 1. Intro Animation as requested */}
      {showIntro && (
        <IntroSplash
          logoUrl={config.logoUrl}
          onFinish={() => setShowIntro(false)}
        />
      )}

      {/* 2. Running Ticker Announcement in Calm Midnight Blue */}
      {config.announcement && (
        <div className="bg-[#0b1426] border-b border-sky-900/40 text-sky-200 py-2 px-4 text-xs font-semibold tracking-wider overflow-hidden">
          <div className="whitespace-nowrap flex items-center justify-center gap-4 text-[11px]">
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-sky-400 animate-pulse" />
              {config.announcement}
            </span>
          </div>
        </div>
      )}

      {/* 3. Navigation Bar */}
      <Navbar
        config={config}
        onScrollToSection={scrollToSection}
        onReplayIntro={() => setShowIntro(true)}
      />

      {/* 4. Hero Section in Calm Blue Tone */}
      <section className="relative overflow-hidden pt-8 pb-12 sm:pt-14 sm:pb-16 border-b border-slate-800/80 bg-gradient-to-b from-[#0c162d] via-[#091122] to-[#080d18]">
        {/* Ambient lighting */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[650px] h-[320px] bg-sky-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto space-y-4">
            
            {/* Trust badge pill & Official Channel Pill */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <div className="inline-flex items-center gap-2 bg-[#0b1324] border border-sky-500/30 px-3.5 py-1.5 rounded-full text-xs font-semibold text-sky-300 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>{availableCount} Akun Free Fire Siap Transaksi Hari Ini</span>
              </div>

              <a
                href={channelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 bg-emerald-950/70 hover:bg-emerald-900/80 border border-emerald-500/50 px-3 py-1.5 rounded-full text-xs font-bold text-emerald-300 shadow-lg transition-all"
              >
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Gabung Saluran WA Resmi</span>
                <ExternalLink className="w-3 h-3 text-emerald-400" />
              </a>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white font-display uppercase leading-none">
              JUAL BELI AKUN FF{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-sky-300 to-blue-400">
                100% AMANAH
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-xs sm:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed">
              Pusat tempat jual beli akun game Free Fire terpercaya. Anti hackback, proses kilat, dan transaksi 100% amanah via Admin resmi.
            </p>

            {/* Store performance strip */}
            <div className="grid grid-cols-3 gap-2 max-w-2xl mx-auto pt-2">
              <div className="pionz-panel rounded-2xl px-3 py-3 text-center">
                <div className="text-lg sm:text-xl font-black text-white font-display">{availableCount}</div>
                <div className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Akun Ready</div>
              </div>
              <div className="pionz-panel rounded-2xl px-3 py-3 text-center">
                <div className="text-lg sm:text-xl font-black text-white font-display">FAST</div>
                <div className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Respon Admin</div>
              </div>
              <div className="pionz-panel rounded-2xl px-3 py-3 text-center">
                <div className="text-lg sm:text-xl font-black text-white font-display">WA</div>
                <div className="text-[9px] uppercase tracking-widest text-slate-500 font-bold">Transaksi Langsung</div>
              </div>
            </div>

            {/* Direct CTAs */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={() => scrollToSection('katalog-section')}
                className="flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-xl shadow-sky-950 transition-all cursor-pointer hover:scale-[1.02]"
              >
                <span>Lihat Katalog Akun Ready</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Direct Sell WhatsApp Link */}
              <a
                href={directSellUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 bg-[#0b1324] hover:bg-[#111c33] text-slate-200 border border-slate-700 hover:border-sky-500/40 font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-sky-400" />
                <span>Mau Jual Akun? Chat WA Admin</span>
              </a>
            </div>

            {/* 4 Feature Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-6 text-left">
              <div className="bg-[#0b1324]/80 border border-slate-800 p-3 rounded-xl flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-400 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-white">Garansi Anti HB</div>
                  <div className="text-[10px] text-slate-400">Jaminan Uang Kembali</div>
                </div>
              </div>

              <div className="bg-[#0b1324]/80 border border-slate-800 p-3 rounded-xl flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-sky-500/10 text-sky-400 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-white">Proses Kilat</div>
                  <div className="text-[10px] text-slate-400">Transaksi Aman</div>
                </div>
              </div>

              <div className="bg-[#0b1324]/80 border border-slate-800 p-3 rounded-xl flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-blue-500/10 text-blue-400 shrink-0">
                  <Lock className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-white">Data Aman 100%</div>
                  <div className="text-[10px] text-slate-400">Full Akses Bersih</div>
                </div>
              </div>

              <div className="bg-[#0b1324]/80 border border-slate-800 p-3 rounded-xl flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-white">Admin Fast Respon</div>
                  <div className="text-[10px] text-slate-400">2 Nomor Siap Layani</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Main Catalog Section */}
      <main id="katalog-section" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 pionz-noise">
        
        {/* Section Title & Search */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white font-display">
                Katalog Akun Free Fire
              </h2>
              <span className="text-xs bg-sky-950 text-sky-300 border border-sky-700/60 px-2.5 py-0.5 rounded-full font-mono font-bold">
                {sortedAccounts.length} Item
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Pilih akun favoritmu, klik Detail Spek atau Beli via WA untuk langsung transaksi ke admin.
            </p>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-2">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Cari kode (PZ-01), senjata, bundle..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#0b1324] border border-slate-800 focus:border-sky-500 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none transition-all"
              />
            </div>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#0b1324] border border-slate-800 focus:border-sky-500 rounded-xl px-3 py-2 text-xs text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="default">Urutan: Rekomendasi</option>
              <option value="cheapest">Harga: Termurah</option>
              <option value="expensive">Harga: Termahal</option>
              <option value="level">Level: Tertinggi</option>
            </select>
          </div>
        </div>

        {/* Category Pills Filter */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none text-xs">
          {[
            { key: 'all', label: 'Semua Akun' },
            { key: 'sultan', label: '👑 Akun Sultan' },
            { key: 'old_era', label: '⌛ Old Era (S1-S2)' },
            { key: 'evo_gun', label: '⚡ Evo Gun Max' },
            { key: 'pelajar', label: '🎒 Budget Pelajar' },
            { key: 'medium', label: '🔥 Akun Medium' },
            { key: 'sold', label: '🔴 Riwayat Terjual' },
          ].map((cat) => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key as any)}
              className={`px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all cursor-pointer ${
                selectedCategory === cat.key
                  ? 'bg-sky-500 text-slate-950 font-extrabold shadow-lg shadow-sky-500/20'
                  : 'bg-[#0b1324] border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Account Cards Grid */}
        {sortedAccounts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {sortedAccounts.map((account) => (
              <AccountCard
                key={account.id}
                account={account}
                config={config}
                onViewDetail={(acc) => setSelectedAccount(acc)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#0b1324]/40 rounded-2xl border border-slate-800/80 p-8 space-y-3">
            <div className="w-12 h-12 rounded-full bg-slate-800 text-slate-500 flex items-center justify-center mx-auto">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-white">Akun Tidak Ditemukan</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              Tidak ada akun yang sesuai dengan pencarian atau filter kategori saat ini. Coba kata kunci lain atau hubungi admin via WA untuk request spek akun khusus!
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="mt-2 text-xs text-sky-400 hover:underline font-semibold"
            >
              Reset Filter & Pencarian
            </button>
          </div>
        )}

        {/* Direct WhatsApp Sell Banner inside Catalog */}
        <div className="bg-gradient-to-r from-sky-950/40 via-[#0b1324] to-blue-950/40 border border-sky-500/30 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
          <div className="space-y-1 text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-2 text-sky-400 font-bold text-xs uppercase tracking-wider">
              <Sparkles className="w-4 h-4" />
              <span>Mau Jual Akun FF Kamu?</span>
            </div>
            <h3 className="text-lg sm:text-xl font-extrabold text-white font-display">
              Langsung Chat Admin via WhatsApp, Proses Kilat & Dana Cair Cepat!
            </h3>
            <p className="text-xs text-slate-400 max-w-xl">
              Tidak perlu isi formulir panjang! Cukup klik tombol di samping untuk langsung terhubung ke WhatsApp Admin PIONZ STORE dan kirimkan spek akun FF kamu.
            </p>
          </div>

          <a
            href={directSellUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-2 bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-xs px-6 py-3 rounded-xl shadow-lg shadow-sky-950 transition-all cursor-pointer hover:scale-[1.02]"
          >
            <span>Jual ke WhatsApp Sekarang</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>

      </main>

      {/* 6. Footer */}
      <Footer
        config={config}
        onReplayIntro={() => setShowIntro(true)}
      />

      {/* 7. Floating WhatsApp with Channel link */}
      <FloatingWhatsApp config={config} />

      {/* 8. Account Detail Modal */}
      <AccountDetailModal
        account={selectedAccount}
        config={config}
        onClose={() => setSelectedAccount(null)}
      />

      {/* 9. Enhanced Admin Secret Security Gate */}
      <AdminSecurityGate
        isOpen={isAdminGateOpen}
        config={config}
        onSuccess={handleAdminSuccess}
        onFailedAttempt={handleAdminFailed}
        onClose={() => setIsAdminGateOpen(false)}
      />

      {/* 10. Admin Private Panel */}
      <AdminPanel
        isOpen={isAdminPanelOpen}
        accounts={accounts}
        config={config}
        loginLogs={loginLogs}
        onSaveAccount={handleSaveAccount}
        onDeleteAccount={handleDeleteAccount}
        onToggleStatus={handleToggleStatus}
        onSaveConfig={handleSaveConfig}
        onResetData={handleResetData}
        onClose={() => setIsAdminPanelOpen(false)}
      />

    </div>
  );
}
