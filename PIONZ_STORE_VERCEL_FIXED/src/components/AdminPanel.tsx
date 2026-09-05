import React, { useState } from 'react';
import { FFAccount, StoreConfig, AccountCategory, LoginType, AccountStatus, LoginLog } from '../types';
import { formatRupiah } from '../utils/whatsapp';
import {
  X,
  Plus,
  Edit2,
  Trash2,
  Lock,
  Settings,
  ShieldAlert,
  ShieldCheck,
  Save,
  LogOut,
  RefreshCw,
  Package,
  Search,
  Filter,
  CheckCircle2,
  Key,
  Shield,
  Activity,
  History,
  LayoutDashboard,
  ShoppingCart,
  Bell,
  AlertTriangle,
  Download,
  Upload,
  Check,
  CircleDollarSign,
  Users,
  BarChart3,
  MousePointerClick,
  Eye,
  Database,
  Loader2
} from 'lucide-react';

interface AdminPanelProps {
  isOpen: boolean;
  accounts: FFAccount[];
  config: StoreConfig;
  loginLogs: LoginLog[];
  onSaveAccount: (account: FFAccount) => void;
  onDeleteAccount: (id: string) => void;
  onToggleStatus: (id: string, newStatus: AccountStatus) => void;
  onSaveConfig: (newConfig: StoreConfig) => void;
  onResetData: () => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  accounts,
  config,
  loginLogs,
  onSaveAccount,
  onDeleteAccount,
  onToggleStatus,
  onSaveConfig,
  onResetData,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'accounts' | 'stock' | 'orders' | 'analytics' | 'customers' | 'promos' | 'reports' | 'security' | 'settings' | 'backup'>('dashboard');
  const [analytics, setAnalytics] = useState<any>(null);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [analyticsError, setAnalyticsError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | AccountStatus>('all');
  const [lowStockLimit, setLowStockLimit] = useState<number>(() => Number(localStorage.getItem('pionz_low_stock_limit') || 2));
  const [orders, setOrders] = useState<any[]>(() => { try { return JSON.parse(localStorage.getItem('pionz_store_orders') || '[]'); } catch { return []; } });
  const [orderForm, setOrderForm] = useState({ accountId: '', customer: '', contact: '', amount: '' });
  const [notice, setNotice] = useState('');
  const [promoCodes, setPromoCodes] = useState<any[]>(() => { try { return JSON.parse(localStorage.getItem('pionz_promo_codes') || '[]'); } catch { return []; } });
  const [promoForm, setPromoForm] = useState({ code: '', type: 'percent', value: '10', active: true });
  const [bannerText, setBannerText] = useState(() => localStorage.getItem('pionz_promo_banner') || '');

  // Account editing state
  const [isEditingAccount, setIsEditingAccount] = useState(false);
  const [accountFormData, setAccountFormData] = useState<FFAccount>({
    id: '',
    code: '',
    title: '',
    price: 350000,
    originalPrice: 450000,
    category: 'medium',
    level: 65,
    rank: 'Master ⭐ 5',
    evoGuns: ['AK47 Dragon Lv 5', 'MP40 Cobra Lv 4'],
    vaultCount: 250,
    keyItems: ['Bundle Old', 'Emote Ketawa'],
    loginType: 'Google',
    bindStatus: 'Data Polos / Monsep',
    status: 'ready',
    featured: false,
    hotDeal: false,
    images: [config.logoUrl],
    description: 'Akun terawat, data aman siap ganti email.',
    createdAt: new Date().toISOString().split('T')[0],
  });

  // String helpers for arrays
  const [evoGunsInput, setEvoGunsInput] = useState('');
  const [keyItemsInput, setKeyItemsInput] = useState('');
  const [imagesInput, setImagesInput] = useState('');

  // Settings state
  const [tempConfig, setTempConfig] = useState<StoreConfig>({ ...config });
  const [configSavedToast, setConfigSavedToast] = useState(false);

  if (!isOpen) return null;

  const handleOpenNewAccount = () => {
    const nextNum = accounts.length + 1;
    const nextCode = `PZ-${nextNum < 10 ? '0' + nextNum : nextNum}`;

    setAccountFormData({
      id: 'acc-' + Date.now(),
      code: nextCode,
      title: 'AKUN FF SPECIAL OLD + EVO GUN',
      price: 350000,
      originalPrice: 450000,
      category: 'medium',
      level: 68,
      rank: 'Master ⭐ 8',
      evoGuns: ['AK47 Blue Flame Draco (Lv 5)', 'MP40 Predatory Cobra (Lv 4)'],
      vaultCount: 280,
      keyItems: ['Bundle Letda Hyper', 'Emote Duduk & Ketawa', 'SG2 Rapper'],
      loginType: 'Google',
      bindStatus: 'Data Polos / Monsep',
      status: 'ready',
      featured: false,
      hotDeal: true,
      images: [
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop',
      ],
      description: 'Akun siap pakai, data aman bergaransi anti hackback.',
      createdAt: new Date().toISOString().split('T')[0],
    });

    setEvoGunsInput('AK47 Blue Flame Draco (Lv 5), MP40 Predatory Cobra (Lv 4)');
    setKeyItemsInput('Bundle Letda Hyper, Emote Duduk & Ketawa, SG2 Rapper');
    setImagesInput('https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=1000&auto=format&fit=crop');
    setIsEditingAccount(true);
  };

  const handleEditAccount = (acc: FFAccount) => {
    setAccountFormData(acc);
    setEvoGunsInput(acc.evoGuns.join(', '));
    setKeyItemsInput(acc.keyItems.join(', '));
    setImagesInput(acc.images.join('\n'));
    setIsEditingAccount(true);
  };

  const handleSaveAccountForm = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedEvo = evoGunsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const parsedKeyItems = keyItemsInput
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    const parsedImages = imagesInput
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const updatedAccount: FFAccount = {
      ...accountFormData,
      evoGuns: parsedEvo,
      keyItems: parsedKeyItems,
      images: parsedImages.length > 0 ? parsedImages : [config.logoUrl],
    };

    onSaveAccount(updatedAccount);
    setIsEditingAccount(false);
  };

  const handleSaveStoreConfig = (e: React.FormEvent) => {
    e.preventDefault();
    const finalConfig: StoreConfig = { ...tempConfig };
    onSaveConfig(finalConfig);
    setConfigSavedToast(true);
    setTimeout(() => setConfigSavedToast(false), 2500);
  };

  const filteredAccounts = accounts.filter((a) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = a.title.toLowerCase().includes(q) || a.code.toLowerCase().includes(q) || a.category.toLowerCase().includes(q) || a.loginType.toLowerCase().includes(q);
    const matchesStatus = statusFilter === 'all' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const readyCount = accounts.filter(a => a.status === 'ready').length;
  const bookedCount = accounts.filter(a => a.status === 'booked').length;
  const soldCount = accounts.filter(a => a.status === 'sold').length;
  const totalValue = accounts.filter(a => a.status !== 'sold').reduce((sum, a) => sum + a.price, 0);

  const loadAnalytics = async () => {
    setAnalyticsLoading(true);
    setAnalyticsError('');
    try {
      const response = await fetch('/api/analytics/stats', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        cache: 'no-store',
        body: JSON.stringify({ accounts: accounts.map((a) => ({ id: a.id, code: a.code, title: a.title })) }),
      });
      const data = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(data.error || 'Gagal memuat analytics.');
      setAnalytics(data);
    } catch (error) {
      setAnalyticsError(error instanceof Error ? error.message : 'Gagal memuat analytics.');
    } finally {
      setAnalyticsLoading(false);
    }
  };

  React.useEffect(() => {
    if (isOpen && activeTab === 'analytics') void loadAnalytics();
  }, [isOpen, activeTab]);

  React.useEffect(() => { localStorage.setItem('pionz_store_orders', JSON.stringify(orders)); }, [orders]);
  React.useEffect(() => { localStorage.setItem('pionz_low_stock_limit', String(lowStockLimit)); }, [lowStockLimit]);
  React.useEffect(() => { localStorage.setItem('pionz_promo_codes', JSON.stringify(promoCodes)); }, [promoCodes]);
  React.useEffect(() => { localStorage.setItem('pionz_promo_banner', bannerText); }, [bannerText]);

  const lowStockAccounts = readyCount <= lowStockLimit ? accounts.filter((a) => a.status === 'ready') : [];
  const estimatedRevenue = orders.filter(o => o.status === 'Selesai').reduce((sum, o) => sum + Number(o.amount || 0), 0);
  const createOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const account = accounts.find(a => a.id === orderForm.accountId);
    if (!account || !orderForm.customer) return;
    setOrders(prev => [{ id: `ORD-${Date.now()}`, date: new Date().toLocaleString('id-ID'), customer: orderForm.customer, contact: orderForm.contact, accountId: account.id, accountCode: account.code, product: account.title, amount: Number(orderForm.amount || account.price), status: 'Pending' }, ...prev]);
    setOrderForm({ accountId: '', customer: '', contact: '', amount: '' });
    setNotice('Transaksi berhasil ditambahkan.');
    setTimeout(() => setNotice(''), 2200);
  };
  const importBackup = async (file?: File) => {
    if (!file) return;
    try {
      const parsed = JSON.parse(await file.text());
      if (!Array.isArray(parsed.accounts) || !parsed.config) throw new Error('Format backup tidak valid');
      parsed.accounts.forEach((a: any) => onSaveAccount(a));
      onSaveConfig(parsed.config);
      if (Array.isArray(parsed.orders)) setOrders(parsed.orders);
      if (Number.isFinite(Number(parsed.lowStockLimit))) setLowStockLimit(Number(parsed.lowStockLimit));
      setNotice('Backup berhasil dipulihkan.');
      setTimeout(() => setNotice(''), 2200);
    } catch (e) { alert('Backup gagal dipulihkan: format JSON tidak valid.'); }
  };
  const exportBackup = () => {
    const blob = new Blob([JSON.stringify({ version: 2, exportedAt: new Date().toISOString(), accounts, config, orders, lowStockLimit }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob); const a = document.createElement('a'); a.href = url; a.download = `pionz-backup-${new Date().toISOString().slice(0,10)}.json`; a.click(); URL.revokeObjectURL(url);
  };

  const handleSecureClose = async () => {
    try { await fetch('/api/admin/logout', { method: 'POST' }); } catch {}
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <div
        id="admin-panel-container"
        className="relative w-full max-w-5xl bg-[#0b1324] border border-sky-500/30 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col text-slate-100"
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-800 bg-[#070b14]/95">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white font-display">
                  Admin Panel PIONZ STORE
                </h2>
                <span className="text-[10px] bg-sky-950 text-sky-300 border border-sky-700/50 px-2 py-0.5 rounded font-mono font-semibold">
                  SECURE & PRIVAT
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                Kelola katalog akun, update status ketersediaan, kontak, dan keamanan kredensial
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => void handleSecureClose()}
              className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Keluar & Kunci</span>
            </button>
            <button
              onClick={() => void handleSecureClose()}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-800 bg-[#070b14]/50 px-5 gap-2 overflow-x-auto text-xs font-semibold">
          {[['dashboard','Dashboard',LayoutDashboard],['accounts',`Katalog (${accounts.length})`,Package],['stock','Stok',AlertTriangle],['orders','Transaksi',ShoppingCart],['analytics','Analytics',BarChart3],['customers','Customer',Users],['promos','Promo',CircleDollarSign],['reports','Laporan',Activity],['security','Keamanan',ShieldCheck],['settings','Pengaturan',Settings],['backup','Backup',RefreshCw]].map(([tab,label,Icon]: any)=><button key={tab} onClick={()=>{setActiveTab(tab);setIsEditingAccount(false)}} className={`py-3 px-3 border-b-2 flex items-center gap-2 cursor-pointer transition-all ${activeTab===tab?'border-sky-400 text-sky-400':'border-transparent text-slate-400 hover:text-slate-200'}`}><Icon className="w-4 h-4"/><span>{label}</span>{tab==='stock'&&lowStockAccounts.length>0?<span className="text-[9px] rounded-full bg-amber-500 text-black px-1.5 font-black">{lowStockAccounts.length}</span>:null}</button>)}
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6">
          
          {activeTab === 'dashboard' && (
            <div className="space-y-5">
              <div className="flex items-center justify-between"><div><h3 className="text-lg font-bold text-white font-display">Dashboard Utama</h3><p className="text-xs text-slate-400 mt-1">Ringkasan operasional PIONZ STORE.</p></div><div className="text-[10px] text-slate-500">Update lokal: {new Date().toLocaleString('id-ID')}</div></div>
              {notice && <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-3 text-xs text-emerald-300 flex gap-2 items-center"><CheckCircle2 className="w-4 h-4"/>{notice}</div>}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[['Akun Ready', readyCount, Package], ['Stok Menipis', lowStockAccounts.length, AlertTriangle], ['Transaksi', orders.length, ShoppingCart], ['Pendapatan Selesai', formatRupiah(estimatedRevenue), CircleDollarSign]].map(([label,value,Icon]: any) => <div key={label as string} className="rounded-2xl border border-slate-800 bg-[#070b14]/70 p-4"><div className="flex justify-between text-[10px] uppercase tracking-wider text-slate-500 font-bold"><span>{label}</span><Icon className="w-4 h-4 text-sky-400"/></div><div className="mt-2 text-xl font-black text-white">{value}</div></div>)}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="rounded-2xl border border-slate-800 bg-[#070b14]/70 p-4"><h4 className="font-bold text-white text-sm flex items-center gap-2"><Bell className="w-4 h-4 text-amber-400"/>Peringatan</h4><div className="mt-3 space-y-2 text-xs">{lowStockAccounts.length ? lowStockAccounts.map(a => <div key={a.id} className="flex justify-between bg-amber-950/20 border border-amber-500/20 rounded-lg p-3"><span className="truncate">{a.code} — {a.title}</span><b className="text-amber-300">Stok rendah</b></div>) : <div className="text-slate-500">Tidak ada stok menipis.</div>}</div></div>
                <div className="rounded-2xl border border-slate-800 bg-[#070b14]/70 p-4"><h4 className="font-bold text-white text-sm">Transaksi Terbaru</h4><div className="mt-3 space-y-2">{orders.slice(0,5).map(o => <div key={o.id} className="flex justify-between gap-2 rounded-lg bg-slate-900/60 p-2.5 text-xs"><div><b className="text-white">{o.customer}</b><div className="text-slate-500">{o.accountCode}</div></div><span className="text-sky-300 font-bold">{formatRupiah(o.amount)}</span></div>)}{!orders.length && <div className="text-slate-500 text-xs">Belum ada transaksi.</div>}</div></div>
              </div>
            </div>
          )}

          {/* TAB 1: ACCOUNTS */}
          {activeTab === 'accounts' && (
            <div className="space-y-4">
              {!isEditingAccount ? (
                <>
                  {/* Quick Overview */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {[
                      { label: 'Total Listing', value: accounts.length, icon: Package, tone: 'sky' },
                      { label: 'Ready', value: readyCount, icon: CheckCircle2, tone: 'emerald' },
                      { label: 'Booked / Sold', value: `${bookedCount} / ${soldCount}`, icon: Activity, tone: 'amber' },
                      { label: 'Nilai Listing', value: formatRupiah(totalValue), icon: Activity, tone: 'violet' },
                    ].map((stat) => {
                      const Icon = stat.icon;
                      return (
                        <div key={stat.label} className="rounded-2xl border border-slate-800 bg-gradient-to-br from-[#0b1324] to-[#070b14] p-3.5 shadow-lg">
                          <div className="flex items-center justify-between gap-2">
                            <span className="text-[10px] uppercase tracking-[0.14em] text-slate-500 font-bold">{stat.label}</span>
                            <Icon className="w-4 h-4 text-slate-500" />
                          </div>
                          <div className="mt-2 text-lg font-black text-white font-display">{stat.value}</div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Account Action Bar */}
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-[#070b14]/80 p-3 rounded-xl border border-slate-800">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Cari kode (PZ-01), judul, kategori..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-slate-900 border border-slate-800 focus:border-sky-500 rounded-lg pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none"
                      />
                    </div>

                    <div className="relative sm:w-36">
                      <Filter className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                      <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value as 'all' | AccountStatus)}
                        className="w-full appearance-none bg-slate-900 border border-slate-800 focus:border-sky-500 rounded-lg pl-8 pr-2 py-2 text-xs text-slate-200 focus:outline-none"
                      >
                        <option value="all">Semua Status</option>
                        <option value="ready">Ready</option>
                        <option value="booked">Booked</option>
                        <option value="sold">Terjual</option>
                      </select>
                    </div>

                    <button
                      onClick={handleOpenNewAccount}
                      className="flex items-center justify-center gap-1.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs py-2 px-4 rounded-lg shadow-md shadow-sky-950 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Tambah Akun Baru</span>
                    </button>
                  </div>

                  {/* Accounts Table / Cards */}
                  <div className="space-y-2.5">
                    {filteredAccounts.map((acc) => {
                      return (
                        <div
                          key={acc.id}
                          className="group bg-[#070b14]/70 border border-slate-800/80 hover:border-sky-500/30 hover:bg-[#0a1221] p-3.5 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all shadow-sm"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-12 rounded-lg overflow-hidden bg-slate-900 border border-slate-800 shrink-0">
                              <img
                                src={acc.images[0] || config.logoUrl}
                                alt={acc.title}
                                className="w-full h-full object-cover"
                              />
                            </div>

                            <div className="space-y-0.5">
                              <div className="flex items-center gap-2">
                                <span className="text-sky-400 font-mono font-bold text-xs bg-slate-900 px-1.5 py-0.5 rounded border border-sky-500/20">
                                  [{acc.code}]
                                </span>
                                <span className="font-bold text-xs text-white line-clamp-1">
                                  {acc.title}
                                </span>
                              </div>
                              <div className="text-[11px] text-slate-400 flex items-center gap-2">
                                <span>Lv {acc.level}</span>
                                <span>•</span>
                                <span className="text-sky-300 font-semibold font-mono">
                                  {formatRupiah(acc.price)}
                                </span>
                                <span>•</span>
                                <span>{acc.loginType}</span>
                              </div>
                            </div>
                          </div>

                          {/* Status and Action Buttons */}
                          <div className="flex items-center gap-2 shrink-0">
                            {/* Fast status switcher */}
                            <select
                              value={acc.status}
                              onChange={(e) =>
                                onToggleStatus(acc.id, e.target.value as AccountStatus)
                              }
                              className={`text-xs font-bold px-2.5 py-1 rounded-lg border focus:outline-none cursor-pointer ${
                                acc.status === 'ready'
                                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-700'
                                  : acc.status === 'sold'
                                  ? 'bg-red-950/80 text-red-300 border-red-700'
                                  : 'bg-amber-950/80 text-amber-300 border-amber-700'
                              }`}
                            >
                              <option value="ready">🟢 Ready</option>
                              <option value="booked">🟡 Booked</option>
                              <option value="sold">🔴 Terjual</option>
                            </select>

                            <button
                              onClick={() => handleEditAccount(acc)}
                              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white"
                              title="Edit Akun"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>

                            <button
                              onClick={() => {
                                if (confirm(`Hapus akun ${acc.code} (${acc.title})?`)) {
                                  onDeleteAccount(acc.id);
                                }
                              }}
                              className="p-1.5 rounded-lg bg-red-950/50 hover:bg-red-900/60 text-red-400 border border-red-900/60"
                              title="Hapus Akun"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}

                    {filteredAccounts.length === 0 && (
                      <div className="text-center py-10 text-slate-500 text-xs">
                        Tidak ada akun yang sesuai dengan pencarian.
                      </div>
                    )}
                  </div>
                </>
              ) : (
                /* EDIT / ADD FORM */
                <form onSubmit={handleSaveAccountForm} className="space-y-4 bg-[#070b14]/60 p-4 sm:p-5 rounded-2xl border border-slate-800">
                  <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                    <h3 className="font-bold text-sm text-sky-400">
                      {accountFormData.id ? 'Edit Data Akun Free Fire' : 'Tambah Akun Free Fire Baru'}
                    </h3>
                    <button
                      type="button"
                      onClick={() => setIsEditingAccount(false)}
                      className="text-xs text-slate-400 hover:text-white"
                    >
                      Batal
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Kode Akun (Contoh: PZ-08)
                      </label>
                      <input
                        type="text"
                        required
                        value={accountFormData.code}
                        onChange={(e) =>
                          setAccountFormData({ ...accountFormData, code: e.target.value.toUpperCase() })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Judul Akun (Headline Spek)
                      </label>
                      <input
                        type="text"
                        required
                        value={accountFormData.title}
                        onChange={(e) =>
                          setAccountFormData({ ...accountFormData, title: e.target.value })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Harga Jual (Rp)
                      </label>
                      <input
                        type="number"
                        required
                        value={accountFormData.price}
                        onChange={(e) =>
                          setAccountFormData({ ...accountFormData, price: Number(e.target.value) })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Harga Coret / Asli (Rp - Opsional)
                      </label>
                      <input
                        type="number"
                        value={accountFormData.originalPrice || ''}
                        onChange={(e) =>
                          setAccountFormData({
                            ...accountFormData,
                            originalPrice: e.target.value ? Number(e.target.value) : undefined,
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">
                        Kategori Akun
                      </label>
                      <select
                        value={accountFormData.category}
                        onChange={(e) =>
                          setAccountFormData({
                            ...accountFormData,
                            category: e.target.value as AccountCategory,
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      >
                        <option value="sultan">Sultan (High-End)</option>
                        <option value="old_era">Old Era (S1-S2 Sakura/Hip Hop)</option>
                        <option value="evo_gun">Evo Gun Spesialis</option>
                        <option value="pelajar">Budget Pelajar</option>
                        <option value="medium">Medium / Standar</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Level</label>
                      <input
                        type="number"
                        value={accountFormData.level}
                        onChange={(e) =>
                          setAccountFormData({ ...accountFormData, level: Number(e.target.value) })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Rank</label>
                      <input
                        type="text"
                        value={accountFormData.rank}
                        onChange={(e) =>
                          setAccountFormData({ ...accountFormData, rank: e.target.value })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Login</label>
                      <select
                        value={accountFormData.loginType}
                        onChange={(e) =>
                          setAccountFormData({
                            ...accountFormData,
                            loginType: e.target.value as LoginType,
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                      >
                        <option value="Google">Google</option>
                        <option value="Facebook">Facebook</option>
                        <option value="VK">VK</option>
                        <option value="Twitter">Twitter</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-slate-300 mb-1">Status Akun</label>
                      <select
                        value={accountFormData.status}
                        onChange={(e) =>
                          setAccountFormData({
                            ...accountFormData,
                            status: e.target.value as AccountStatus,
                          })
                        }
                        className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white font-semibold"
                      >
                        <option value="ready">Ready</option>
                        <option value="booked">Booked</option>
                        <option value="sold">Terjual</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Koleksi Senjata Evo (Pisahkan dengan koma)
                    </label>
                    <input
                      type="text"
                      placeholder="AK47 Dragon Lv 7, MP40 Cobra Lv 7, M1014 Draco Lv 5"
                      value={evoGunsInput}
                      onChange={(e) => setEvoGunsInput(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Item Langka / Vault Highlights (Pisahkan dengan koma)
                    </label>
                    <input
                      type="text"
                      placeholder="Set Sakura Season 1, Bundle Bandit, SG2 OPM, Emote Ketawa"
                      value={keyItemsInput}
                      onChange={(e) => setKeyItemsInput(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Link Foto / Screenshot Akun (1 link per baris)
                    </label>
                    <textarea
                      rows={2}
                      value={imagesInput}
                      onChange={(e) => setImagesInput(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white resize-none font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">
                      Deskripsi Akun
                    </label>
                    <textarea
                      rows={2}
                      value={accountFormData.description}
                      onChange={(e) =>
                        setAccountFormData({ ...accountFormData, description: e.target.value })
                      }
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-white resize-none"
                    />
                  </div>

                  <div className="flex items-center gap-4 pt-2">
                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={accountFormData.hotDeal}
                        onChange={(e) =>
                          setAccountFormData({ ...accountFormData, hotDeal: e.target.checked })
                        }
                        className="rounded border-slate-800 text-sky-500 focus:ring-sky-400"
                      />
                      <span>Tampilkan Badge HOT DEAL</span>
                    </label>

                    <label className="flex items-center gap-2 text-xs cursor-pointer">
                      <input
                        type="checkbox"
                        checked={accountFormData.featured}
                        onChange={(e) =>
                          setAccountFormData({ ...accountFormData, featured: e.target.checked })
                        }
                        className="rounded border-slate-800 text-sky-500 focus:ring-sky-400"
                      />
                      <span>Tampilkan di Rekomendasi Utama</span>
                    </label>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setIsEditingAccount(false)}
                      className="px-4 py-2 rounded-lg text-xs text-slate-400 hover:bg-slate-800"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      className="flex items-center gap-1.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold text-xs px-5 py-2 rounded-lg shadow-md cursor-pointer"
                    >
                      <Save className="w-3.5 h-3.5" />
                      <span>Simpan Akun</span>
                    </button>
                  </div>
                </form>
              )}
            </div>
          )}

          {activeTab === 'customers' && (() => {
            const map = new Map<string, any>();
            orders.forEach(o => { const key = (o.contact || o.customer || 'Tanpa kontak').toLowerCase(); const prev = map.get(key) || { name: o.customer, contact: o.contact, orders: 0, spent: 0, last: o.date }; prev.orders += 1; prev.spent += Number(o.amount || 0); prev.last = o.date; map.set(key, prev); });
            const customers = Array.from(map.values()).sort((a,b)=>b.spent-a.spent);
            return <div className="space-y-4"><div><h3 className="text-lg font-bold text-white">Customer</h3><p className="text-xs text-slate-400 mt-1">Ringkasan pembeli berdasarkan transaksi yang dicatat di panel.</p></div><div className="grid grid-cols-2 lg:grid-cols-3 gap-3"><div className="rounded-xl border border-slate-800 p-4 bg-[#070b14]/70"><span className="text-[10px] text-slate-500">Customer</span><div className="text-2xl font-black text-white">{customers.length}</div></div><div className="rounded-xl border border-slate-800 p-4 bg-[#070b14]/70"><span className="text-[10px] text-slate-500">Order</span><div className="text-2xl font-black text-white">{orders.length}</div></div><div className="rounded-xl border border-slate-800 p-4 bg-[#070b14]/70"><span className="text-[10px] text-slate-500">Omzet Selesai</span><div className="text-lg font-black text-white">{formatRupiah(estimatedRevenue)}</div></div></div><div className="space-y-2">{customers.map((c:any,i:number)=><div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 rounded-xl border border-slate-800 bg-[#070b14]/70 p-3"><div><b className="text-xs text-white">{c.name || 'Customer'}</b><div className="text-[10px] text-slate-500">{c.contact || 'Tanpa kontak'} • terakhir {c.last}</div></div><div className="text-right"><div className="text-xs text-sky-300 font-bold">{formatRupiah(c.spent)}</div><div className="text-[10px] text-slate-500">{c.orders} order</div></div></div>)}{!customers.length && <div className="text-center text-xs text-slate-500 py-8">Belum ada customer tercatat.</div>}</div></div>;
          })()}

          {activeTab === 'promos' && (
            <div className="space-y-5 max-w-2xl"><div><h3 className="text-lg font-bold text-white">Promo & Banner</h3><p className="text-xs text-slate-400 mt-1">Kelola kode diskon dan banner promo toko.</p></div><div className="rounded-2xl border border-slate-800 bg-[#070b14]/70 p-4 space-y-3"><label className="text-xs font-semibold text-slate-300">Banner promo</label><input value={bannerText} onChange={e=>setBannerText(e.target.value)} placeholder="Contoh: PROMO 10% UNTUK MINGGU INI" className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"/><div className="flex gap-2"><button type="button" onClick={()=>{localStorage.setItem('pionz_promo_banner',bannerText);setNotice('Banner promo disimpan.')}} className="bg-sky-600 px-3 py-2 rounded-lg text-xs font-bold">Simpan Banner</button><button type="button" onClick={()=>setBannerText('')} className="bg-slate-800 px-3 py-2 rounded-lg text-xs">Hapus</button></div></div><form onSubmit={e=>{e.preventDefault(); if(!promoForm.code.trim())return; setPromoCodes(p=>[{...promoForm,code:promoForm.code.trim().toUpperCase(),value:Number(promoForm.value)},...p]); setPromoForm({code:'',type:'percent',value:'10',active:true});}} className="rounded-2xl border border-slate-800 bg-[#070b14]/70 p-4 grid grid-cols-1 sm:grid-cols-4 gap-2"><input required placeholder="KODE" value={promoForm.code} onChange={e=>setPromoForm({...promoForm,code:e.target.value})} className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"/><select value={promoForm.type} onChange={e=>setPromoForm({...promoForm,type:e.target.value})} className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"><option value="percent">Persen (%)</option><option value="nominal">Nominal (Rp)</option></select><input type="number" min="1" value={promoForm.value} onChange={e=>setPromoForm({...promoForm,value:e.target.value})} className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"/><button className="bg-emerald-600 rounded-lg text-xs font-bold">Tambah</button></form><div className="space-y-2">{promoCodes.map((p:any,i:number)=><div key={i} className="flex items-center justify-between rounded-xl border border-slate-800 bg-[#070b14]/70 p-3"><div><b className="text-xs text-white">{p.code}</b><div className="text-[10px] text-slate-500">{p.type==='percent'?`${p.value}%`:`${formatRupiah(p.value)}`} • {p.active?'Aktif':'Nonaktif'}</div></div><button type="button" onClick={()=>setPromoCodes(prev=>prev.filter((_,j)=>j!==i))} className="p-2 bg-red-950 text-red-300 rounded-lg"><Trash2 className="w-3.5 h-3.5"/></button></div>)}</div></div>
          )}

          {activeTab === 'reports' && (
            <div className="space-y-5"><div><h3 className="text-lg font-bold text-white">Laporan Penjualan</h3><p className="text-xs text-slate-400 mt-1">Ringkasan performa toko dari data transaksi lokal.</p></div><div className="grid grid-cols-2 lg:grid-cols-4 gap-3">{[['Total Order',orders.length],['Selesai',orders.filter(o=>o.status==='Selesai').length],['Batal',orders.filter(o=>o.status==='Batal').length],['Omzet',formatRupiah(estimatedRevenue)]].map(([l,v])=><div key={String(l)} className="rounded-xl border border-slate-800 p-4 bg-[#070b14]/70"><span className="text-[10px] text-slate-500">{l}</span><div className="text-xl font-black text-white mt-1">{v}</div></div>)}</div><div className="rounded-2xl border border-slate-800 bg-[#070b14]/70 p-4"><h4 className="text-sm font-bold text-white mb-3">Performa Kategori</h4><div className="space-y-2">{Array.from(new Set(accounts.map(a=>a.category))).map(cat=>{const count=accounts.filter(a=>a.category===cat).length;return <div key={cat} className="flex items-center justify-between text-xs"><span className="text-slate-300">{cat}</span><span className="text-sky-300 font-bold">{count} listing</span></div>})}</div></div><button type="button" onClick={()=>{const rows=orders.map(o=>[o.id,o.date,o.customer,o.contact,o.accountCode,o.amount,o.status].join(',')); const blob=new Blob([['ID,Tanggal,Customer,Kontak,Kode,Nominal,Status',...rows].join('\n')],{type:'text/csv'}); const url=URL.createObjectURL(blob); const a=document.createElement('a');a.href=url;a.download=`pionz-orders-${new Date().toISOString().slice(0,10)}.csv`;a.click();URL.revokeObjectURL(url);}} className="bg-sky-600 hover:bg-sky-500 px-4 py-2 rounded-lg text-xs font-bold">Export Order CSV</button></div>
          )}

          {/* TAB 2: SECURITY & AUDIT LOGS */}
          {activeTab === 'stock' && (
            <div className="space-y-4"><div className="flex flex-col sm:flex-row justify-between gap-3"><div><h3 className="text-lg font-bold text-white">Manajemen Stok</h3><p className="text-xs text-slate-400 mt-1">Atur status dan pantau listing yang menipis.</p></div><label className="text-xs text-slate-300 flex items-center gap-2">Batas peringatan <input type="number" min="0" max="99" value={lowStockLimit} onChange={e=>setLowStockLimit(Number(e.target.value))} className="w-16 bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-white"/></label></div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5"><div className="rounded-xl border border-slate-800 p-4 bg-[#070b14]/70"><span className="text-[10px] text-slate-500">Ready</span><div className="text-xl font-black text-emerald-300">{readyCount}</div></div><div className="rounded-xl border border-slate-800 p-4 bg-[#070b14]/70"><span className="text-[10px] text-slate-500">Booked</span><div className="text-xl font-black text-amber-300">{bookedCount}</div></div><div className="rounded-xl border border-slate-800 p-4 bg-[#070b14]/70"><span className="text-[10px] text-slate-500">Terjual</span><div className="text-xl font-black text-red-300">{soldCount}</div></div><div className="rounded-xl border border-slate-800 p-4 bg-[#070b14]/70"><span className="text-[10px] text-slate-500">Nilai Ready</span><div className="text-lg font-black text-white">{formatRupiah(accounts.filter(a=>a.status==='ready').reduce((s,a)=>s+a.price,0))}</div></div></div>
              <div className="space-y-2">{accounts.map(a => <div key={a.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl border border-slate-800 bg-[#070b14]/70 p-3"><div className="min-w-0"><b className="text-xs text-white">{a.code} — {a.title}</b><div className="text-[10px] text-slate-500 mt-1">{formatRupiah(a.price)} • {a.loginType}</div></div><div className="flex items-center gap-2"><span className={`text-[10px] font-bold px-2 py-1 rounded ${a.status==='ready'?'bg-emerald-950 text-emerald-300':a.status==='booked'?'bg-amber-950 text-amber-300':'bg-red-950 text-red-300'}`}>{a.status.toUpperCase()}</span><select value={a.status} onChange={e=>onToggleStatus(a.id,e.target.value as AccountStatus)} className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-xs text-white"><option value="ready">Ready</option><option value="booked">Booked</option><option value="sold">Terjual</option></select></div></div>)}</div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div className="space-y-5"><div><h3 className="text-lg font-bold text-white">Manajemen Transaksi</h3><p className="text-xs text-slate-400 mt-1">Catat order dari WhatsApp dan pantau statusnya.</p></div>
              <form onSubmit={createOrder} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 rounded-2xl border border-slate-800 bg-[#070b14]/70 p-4"><select required value={orderForm.accountId} onChange={e=>setOrderForm({...orderForm,accountId:e.target.value})} className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"><option value="">Pilih akun</option>{accounts.filter(a=>a.status!=='sold').map(a=><option key={a.id} value={a.id}>{a.code} — {formatRupiah(a.price)}</option>)}</select><input required placeholder="Nama pembeli" value={orderForm.customer} onChange={e=>setOrderForm({...orderForm,customer:e.target.value})} className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"/><input placeholder="Kontak/WA" value={orderForm.contact} onChange={e=>setOrderForm({...orderForm,contact:e.target.value})} className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"/><input type="number" placeholder="Nominal" value={orderForm.amount} onChange={e=>setOrderForm({...orderForm,amount:e.target.value})} className="bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-white"/><button className="bg-sky-600 hover:bg-sky-500 rounded-lg text-xs font-bold text-white px-3 py-2">Tambah Order</button></form>
              <div className="space-y-2">{orders.map(o=><div key={o.id} className="rounded-xl border border-slate-800 bg-[#070b14]/70 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3"><div><div className="text-xs font-bold text-white">{o.id} • {o.customer}</div><div className="text-[10px] text-slate-500">{o.date} • {o.accountCode} • {o.contact || 'Tanpa kontak'}</div></div><div className="flex items-center gap-2"><b className="text-xs text-sky-300">{formatRupiah(o.amount)}</b><select value={o.status} onChange={e=>setOrders(prev=>prev.map(x=>x.id===o.id?{...x,status:e.target.value}:x))} className="bg-slate-900 border border-slate-700 rounded-lg px-2 py-1.5 text-[10px] text-white"><option>Pending</option><option>Diproses</option><option>Selesai</option><option>Batal</option></select><button onClick={()=>setOrders(prev=>prev.filter(x=>x.id!==o.id))} className="p-1.5 rounded-lg bg-red-950 text-red-300"><Trash2 className="w-3.5 h-3.5"/></button></div></div>)}{!orders.length&&<div className="text-xs text-slate-500 text-center py-8">Belum ada transaksi. Tambahkan order dari form di atas.</div>}</div>
            </div>
          )}

          {activeTab === 'analytics' && (
            <div className="space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-bold text-white font-display">Dashboard Pengunjung & Minat Stok</h3>
                  <p className="text-xs text-slate-400 mt-1">Angka diambil dari pengunjung nyata website, bukan data dummy.</p>
                </div>
                <button onClick={() => void loadAnalytics()} disabled={analyticsLoading} className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-bold text-slate-200 disabled:opacity-50">
                  <RefreshCw className={`w-3.5 h-3.5 ${analyticsLoading ? 'animate-spin' : ''}`} /> Refresh
                </button>
              </div>

              {analyticsError && (
                <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-4 text-xs text-amber-200">
                  <div className="font-bold mb-1">Analytics belum aktif</div>
                  <div>{analyticsError}</div>
                  <div className="mt-2 text-amber-300/80">Layanan analytics eksternal belum merespons. Coba tombol Refresh beberapa saat lagi.</div>
                </div>
              )}

              {analyticsLoading && !analytics && (
                <div className="flex items-center justify-center py-12 text-slate-400 text-xs gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Memuat statistik...</div>
              )}

              {analytics && (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {[
                      { label: 'Total Kunjungan', value: analytics.totalVisits ?? 0, icon: BarChart3 },
                      { label: 'Pengunjung Unik', value: analytics.uniqueVisitors ?? 0, icon: Users },
                      { label: 'Cek Detail Stok', value: analytics.stockChecks ?? 0, icon: Eye },
                      { label: 'Klik Beli / WA', value: analytics.buyClicks ?? 0, icon: MousePointerClick },
                    ].map((stat) => {
                      const Icon = stat.icon;
                      return <div key={stat.label} className="rounded-2xl border border-slate-800 bg-[#070b14]/70 p-4"><div className="flex items-center justify-between"><span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold">{stat.label}</span><Icon className="w-4 h-4 text-sky-400" /></div><div className="mt-2 text-2xl font-black text-white font-display">{stat.value}</div></div>;
                    })}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="rounded-2xl border border-slate-800 bg-[#070b14]/70 p-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-white"><Activity className="w-4 h-4 text-sky-400" /> Ringkasan Periode</div>
                      <div className="grid grid-cols-2 gap-3 mt-4">
                        <div className="rounded-xl bg-slate-900/70 p-3"><div className="text-[10px] text-slate-500">24 Jam</div><div className="text-lg font-black text-white mt-1">{analytics.visits24h ?? 0}</div><div className="text-[10px] text-slate-400">{analytics.unique24h ?? 0} unik</div></div>
                        <div className="rounded-xl bg-slate-900/70 p-3"><div className="text-[10px] text-slate-500">7 Hari</div><div className="text-lg font-black text-white mt-1">{analytics.visits7d ?? 0}</div><div className="text-[10px] text-slate-400">{analytics.unique7d ?? 0} unik</div></div>
                      </div>
                    </div>

                    <div className="rounded-2xl border border-slate-800 bg-[#070b14]/70 p-4">
                      <div className="flex items-center gap-2 text-sm font-bold text-white"><Eye className="w-4 h-4 text-sky-400" /> Stok Paling Sering Dicek</div>
                      <div className="mt-3 space-y-2">
                        {(analytics.topAccounts || []).length ? analytics.topAccounts.map((item: any, index: number) => {
                          const account = accounts.find((a) => a.id === item.account_id || a.code === item.account_code);
                          return <div key={`${item.account_id}-${index}`} className="flex items-center justify-between gap-3 rounded-xl bg-slate-900/60 border border-slate-800 px-3 py-2.5"><div className="min-w-0"><div className="text-xs font-bold text-white truncate">{account?.title || item.account_code || item.account_id}</div><div className="text-[10px] text-slate-500">{item.account_code || 'Listing'}</div></div><span className="shrink-0 text-xs font-black text-sky-300">{item.checks} cek</span></div>;
                        }) : <div className="text-xs text-slate-500 py-4 text-center">Belum ada data cek stok.</div>}
                      </div>
                    </div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-3 text-[10px] text-slate-500 flex items-start gap-2">
                    <Database className="w-4 h-4 shrink-0 text-slate-600" /> Analytics memakai penghitung publik CounterAPI. Yang dikirim hanya ID pengunjung acak dan aktivitas; tidak ada password atau data akun login pengunjung.
                  </div>
                </>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-5 max-w-3xl text-xs">
              {/* Security Status Box */}
              <div className="bg-[#070b14]/80 p-4 rounded-xl border border-sky-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sky-400 font-bold font-display text-sm">
                    <ShieldCheck className="w-4 h-4" />
                    <span>STATUS SISTEM KEAMANAN ADMIN</span>
                  </div>
                  <span className="bg-emerald-950 text-emerald-300 border border-emerald-800 px-2 py-0.5 rounded text-[11px] font-semibold">
                    PROTEKSI AKTIF
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Autentikasi Dual:</span>
                    <span className="font-bold text-white">ID + Password Rahasia</span>
                  </div>
                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Proteksi Brute-Force:</span>
                    <span className="font-bold text-white">Max 3x Coba (Lock 60s)</span>
                  </div>
                  <div className="bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Verifikasi Admin:</span>
                    <span className="font-bold text-white">Server-side</span>
                  </div>
                </div>
              </div>

              {/* Login Audit Logs */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <History className="w-3.5 h-3.5 text-sky-400" />
                    <span>Log Riwayat Akses Terkini:</span>
                  </h4>
                  <span className="text-[10px] text-slate-500">Menampilkan rekaman aktivitas login</span>
                </div>

                <div className="space-y-1.5">
                  {loginLogs.map((log) => (
                    <div
                      key={log.id}
                      className="flex items-center justify-between p-2.5 bg-[#070b14]/70 border border-slate-800 rounded-lg text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            log.status === 'SUCCESS' ? 'bg-emerald-400' : 'bg-red-400'
                          }`}
                        />
                        <span className="font-mono text-slate-300">{log.timestamp}</span>
                        <span className="text-slate-500">•</span>
                        <span className="text-slate-400">{log.ipInfo}</span>
                      </div>
                      <span
                        className={`font-semibold text-[10px] px-2 py-0.5 rounded ${
                          log.status === 'SUCCESS'
                            ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800'
                            : 'bg-red-950/60 text-red-400 border border-red-800'
                        }`}
                      >
                        {log.status === 'SUCCESS' ? 'BERHASIL' : 'DITOLAK'}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SETTINGS & CREDENTIAL MANAGEMENT */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveStoreConfig} className="space-y-4 max-w-2xl text-xs">
              
              {/* ADMIN SECURITY NOTE */}
              <div className="p-4 bg-sky-950/20 border border-sky-500/30 rounded-xl space-y-2">
                <div className="flex items-center gap-2 text-sky-400 font-bold text-sm">
                  <Key className="w-4 h-4" />
                  <span>Kredensial Admin</span>
                </div>
                <p className="text-[11px] text-slate-400">ID dan password admin tidak disimpan di frontend atau localStorage. Atur <code className="text-sky-300">ADMIN_USERNAME</code> dan <code className="text-sky-300">ADMIN_PASSWORD</code> hanya melalui Environment Variables Vercel.</p>
                <p className="text-[10px] text-slate-500">Setelah mengubah variable di Vercel, lakukan Redeploy.</p>
              </div>

              {/* STORE INFO SECTION */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Nama Toko</label>
                  <input
                    type="text"
                    value={tempConfig.storeName}
                    onChange={(e) => setTempConfig({ ...tempConfig, storeName: e.target.value })}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Slogan Toko</label>
                  <input
                    type="text"
                    value={tempConfig.tagline}
                    onChange={(e) => setTempConfig({ ...tempConfig, tagline: e.target.value })}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">URL Logo Toko</label>
                <input
                  type="text"
                  value={tempConfig.logoUrl}
                  onChange={(e) => setTempConfig({ ...tempConfig, logoUrl: e.target.value })}
                  className="w-full bg-[#070b14] border border-slate-800 rounded-lg px-3 py-2 text-white font-mono"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Nomor WhatsApp Admin 1 (Utama)
                  </label>
                  <input
                    type="text"
                    value={tempConfig.wa1}
                    onChange={(e) => setTempConfig({ ...tempConfig, wa1: e.target.value })}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">
                    Nomor WhatsApp Admin 2 (Cadangan)
                  </label>
                  <input
                    type="text"
                    value={tempConfig.wa2}
                    onChange={(e) => setTempConfig({ ...tempConfig, wa2: e.target.value })}
                    className="w-full bg-[#070b14] border border-slate-800 rounded-lg px-3 py-2 text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Link Saluran WhatsApp Resmi
                </label>
                <input
                  type="text"
                  value={tempConfig.waChannel || ''}
                  onChange={(e) => setTempConfig({ ...tempConfig, waChannel: e.target.value })}
                  placeholder="https://whatsapp.com/channel/..."
                  className="w-full bg-[#070b14] border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Username Instagram (Tanpa @)
                </label>
                <input
                  type="text"
                  value={tempConfig.instagram}
                  onChange={(e) => setTempConfig({ ...tempConfig, instagram: e.target.value })}
                  className="w-full bg-[#070b14] border border-slate-800 rounded-lg px-3 py-2 text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Teks Running Announcement (Header)
                </label>
                <textarea
                  rows={2}
                  value={tempConfig.announcement}
                  onChange={(e) => setTempConfig({ ...tempConfig, announcement: e.target.value })}
                  className="w-full bg-[#070b14] border border-slate-800 rounded-lg px-3 py-2 text-white resize-none"
                />
              </div>

              {configSavedToast && (
                <div className="p-3 bg-emerald-950/80 border border-emerald-600 rounded-lg text-emerald-300 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Kredensial dan pengaturan toko berhasil diperbarui!</span>
                </div>
              )}

              <div className="pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 text-white font-bold px-5 py-2.5 rounded-xl shadow-lg cursor-pointer"
                >
                  <Save className="w-4 h-4" />
                  <span>Simpan Perubahan</span>
                </button>
              </div>
            </form>
          )}

          {/* TAB 4: BACKUP & RESET */}
          {activeTab === 'backup' && (
            <div className="space-y-6 max-w-xl text-xs">
              <div className="bg-[#070b14]/60 p-4 rounded-xl border border-slate-800 space-y-3">
                <h4 className="font-bold text-sm text-white">Backup & Restore Data (JSON)</h4>
                <p className="text-slate-400">Download backup berisi katalog, konfigurasi, transaksi, dan pengaturan batas stok. Bisa dipulihkan lagi kapan saja di browser ini.</p>
                <button
                  onClick={exportBackup}
                  className="bg-sky-700 hover:bg-sky-600 text-white px-3.5 py-2 rounded-lg font-semibold flex items-center gap-2"
                >
                  <Download className="w-4 h-4" /> Download Backup JSON
                </button>
                <label className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-lg font-semibold inline-flex items-center gap-2 cursor-pointer"><Upload className="w-4 h-4"/> Pulihkan Backup<input type="file" accept="application/json,.json" className="hidden" onChange={e=>void importBackup(e.target.files?.[0])}/></label>
                <button
                  onClick={() => {
                    const dataStr = JSON.stringify({ accounts, config }, null, 2);
                    navigator.clipboard.writeText(dataStr);
                    alert('Data katalog berhasil disalin ke clipboard!');
                  }}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-3.5 py-2 rounded-lg font-semibold"
                >
                  Salin Data JSON ke Clipboard
                </button>
              </div>

              <div className="bg-red-950/20 p-4 rounded-xl border border-red-500/30 space-y-3">
                <div className="flex items-center gap-2 text-red-400 font-bold text-sm">
                  <ShieldAlert className="w-4 h-4" />
                  <span>Reset ke Data Awal Pabrik</span>
                </div>
                <p className="text-slate-400">
                  Akan mengembalikan seluruh akun dan konfigurasi ke setelan awal PIONZ STORE.
                </p>
                <button
                  onClick={() => {
                    if (confirm('Yakin ingin mereset seluruh data kembali ke setelan awal?')) {
                      onResetData();
                      setOrders([]);
                      localStorage.removeItem('pionz_store_orders');
                    }
                  }}
                  className="bg-red-600 hover:bg-red-500 text-white px-3.5 py-2 rounded-lg font-bold"
                >
                  Reset Semua Data Toko
                </button>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
