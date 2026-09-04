import React, { useEffect, useState } from 'react';
import { StoreConfig, LoginLog } from '../types';
import { ShieldAlert, Lock, User, KeyRound, X, Eye, EyeOff, AlertCircle, Clock } from 'lucide-react';

interface AdminSecurityGateProps {
  isOpen: boolean;
  config: StoreConfig;
  onSuccess: (log: LoginLog) => void;
  onFailedAttempt: (log: LoginLog) => void;
  onClose: () => void;
}

export const AdminSecurityGate: React.FC<AdminSecurityGateProps> = ({ isOpen, onSuccess, onFailedAttempt, onClose }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (lockoutRemaining <= 0) return;
    const timer = setInterval(() => setLockoutRemaining((prev) => Math.max(0, prev - 1)), 1000);
    return () => clearInterval(timer);
  }, [lockoutRemaining]);

  if (!isOpen) return null;

  const failed = (message: string) => {
    const next = failedAttempts + 1;
    setFailedAttempts(next);
    onFailedAttempt({
      id: 'log-' + Date.now(),
      timestamp: new Date().toLocaleString('id-ID'),
      status: 'FAILED',
      ipInfo: `Failed attempt #${next}`,
    });
    if (next >= 3) {
      setLockoutRemaining(60);
      setErrorMessage('Terlalu banyak percobaan. Coba lagi dalam 60 detik.');
    } else {
      setErrorMessage(`${message} (Sisa kesempatan: ${3 - next}x)`);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutRemaining > 0 || loading) return;
    setLoading(true);
    setErrorMessage('');
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      });
      if (!response.ok) {
        failed(response.status === 401 ? 'ID atau password salah.' : 'Server login belum siap.');
        setLoading(false);
        return;
      }
      setFailedAttempts(0);
      setUsername('');
      setPassword('');
      onSuccess({
        id: 'log-' + Date.now(),
        timestamp: new Date().toLocaleString('id-ID'),
        status: 'SUCCESS',
        ipInfo: 'Server Verification (Authorized)',
      });
    } catch {
      setErrorMessage('Tidak dapat terhubung ke server login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#0b1324] border border-sky-500/30 rounded-2xl shadow-2xl p-6 text-slate-100">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-400" />
        <button onClick={onClose} className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800" aria-label="Tutup"><X className="w-5 h-5" /></button>
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-sky-950/80 border border-sky-500/30 flex items-center justify-center mx-auto mb-3">
            {lockoutRemaining > 0 ? <ShieldAlert className="w-7 h-7 text-red-400" /> : <Lock className="w-7 h-7 text-sky-400" />}
          </div>
          <h3 className="text-lg font-bold font-display text-white">Portal Keamanan Admin PIONZ STORE</h3>
          <p className="text-xs text-slate-400">Kredensial diverifikasi di server. ID/password tidak disimpan di frontend.</p>
        </div>
        {lockoutRemaining > 0 && <div className="mb-4 bg-red-950/40 border border-red-500/40 p-3 rounded-xl flex items-center gap-2.5 text-xs text-red-300"><Clock className="w-5 h-5" />Tunggu {lockoutRemaining} detik.</div>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div><label className="block text-xs font-semibold text-slate-300 mb-1.5">ID Admin</label><div className="relative"><User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" /><input required autoComplete="username" disabled={lockoutRemaining > 0 || loading} value={username} onChange={(e) => setUsername(e.target.value)} className="w-full bg-[#070b14] border border-slate-800 focus:border-sky-500 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white focus:outline-none disabled:opacity-50" placeholder="Masukkan ID Admin..." /></div></div>
          <div><label className="block text-xs font-semibold text-slate-300 mb-1.5">Password Rahasia</label><div className="relative"><KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" /><input required autoComplete="current-password" type={showPassword ? 'text' : 'password'} disabled={lockoutRemaining > 0 || loading} value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#070b14] border border-slate-800 focus:border-sky-500 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white focus:outline-none disabled:opacity-50" placeholder="Masukkan Password..." /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" aria-label="Tampilkan/sembunyikan password">{showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}</button></div></div>
          {errorMessage && <div className="flex items-center gap-1.5 text-xs text-red-400 bg-red-950/20 border border-red-900/40 p-2.5 rounded-lg"><AlertCircle className="w-4 h-4" /><span>{errorMessage}</span></div>}
          <div className="bg-sky-950/30 border border-sky-500/20 p-2.5 rounded-lg text-[11px] text-slate-400"><div className="text-sky-300 font-semibold">🔒 Kredensial aman</div><div className="text-[10px] mt-1">Atur ADMIN_USERNAME dan ADMIN_PASSWORD di Environment Variables Vercel.</div></div>
          <button type="submit" disabled={lockoutRemaining > 0 || loading} className="w-full bg-gradient-to-r from-sky-500 to-blue-600 disabled:opacity-50 text-white font-bold text-xs py-2.5 rounded-xl flex items-center justify-center gap-2"><Lock className="w-4 h-4" />{loading ? 'Memverifikasi...' : 'Verifikasi & Masuk'}</button>
        </form>
      </div>
    </div>
  );
};
