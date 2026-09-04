import React, { useState, useEffect } from 'react';
import { StoreConfig, LoginLog } from '../types';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  User,
  KeyRound,
  X,
  Eye,
  EyeOff,
  AlertCircle,
  Clock,
  Key
} from 'lucide-react';

interface AdminSecurityGateProps {
  isOpen: boolean;
  config: StoreConfig;
  onSuccess: (log: LoginLog) => void;
  onFailedAttempt: (log: LoginLog) => void;
  onClose: () => void;
}

export const AdminSecurityGate: React.FC<AdminSecurityGateProps> = ({
  isOpen,
  config,
  onSuccess,
  onFailedAttempt,
  onClose,
}) => {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [recoveryKeyInput, setRecoveryKeyInput] = useState('');

  // Brute-force protection
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [lockoutRemaining, setLockoutRemaining] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  // Lockout timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (lockoutRemaining > 0) {
      timer = setInterval(() => {
        setLockoutRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            setFailedAttempts(0);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [lockoutRemaining]);

  if (!isOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (lockoutRemaining > 0) return;

    // Recovery mode check
    if (isRecoveryMode) {
      if (recoveryKeyInput.trim() === config.securityKey.trim()) {
        const log: LoginLog = {
          id: 'log-' + Date.now(),
          timestamp: new Date().toLocaleString('id-ID'),
          status: 'SUCCESS',
          ipInfo: 'Recovery Key Bypass',
        };
        onSuccess(log);
        resetFields();
      } else {
        triggerFailedAttempt('Kode Keamanan Pemulihan salah!');
      }
      return;
    }

    // Normal credentials check
    const isUserMatch = usernameInput.trim().toLowerCase() === config.adminUsername.trim().toLowerCase();
    const isPassMatch = passwordInput.trim() === config.adminPassword.trim();

    if (isUserMatch && isPassMatch) {
      const log: LoginLog = {
        id: 'log-' + Date.now(),
        timestamp: new Date().toLocaleString('id-ID'),
        status: 'SUCCESS',
        ipInfo: 'Browser Session (Authorized)',
      };
      setErrorMessage('');
      setFailedAttempts(0);
      resetFields();
      onSuccess(log);
    } else {
      triggerFailedAttempt('Username atau Password Admin salah!');
    }
  };

  const triggerFailedAttempt = (msg: string) => {
    const nextAttempts = failedAttempts + 1;
    setFailedAttempts(nextAttempts);

    const log: LoginLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toLocaleString('id-ID'),
      status: 'FAILED',
      ipInfo: `Failed attempt #${nextAttempts}`,
    };
    onFailedAttempt(log);

    if (nextAttempts >= 3) {
      setLockoutRemaining(60);
      setErrorMessage('Sistem dikunci sementara selama 60 detik karena 3x percobaan gagal!');
    } else {
      setErrorMessage(`${msg} (Sisa kesempatan: ${3 - nextAttempts}x)`);
    }
  };

  const resetFields = () => {
    setUsernameInput('');
    setPasswordInput('');
    setRecoveryKeyInput('');
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="relative w-full max-w-md bg-[#0b1324] border border-sky-500/30 rounded-2xl shadow-2xl p-6 text-slate-100 overflow-hidden">
        
        {/* Subtle decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-400" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          aria-label="Tutup"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header with Security Badge */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-sky-950/80 text-sky-400 border border-sky-500/30 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-sky-950">
            {lockoutRemaining > 0 ? (
              <ShieldAlert className="w-7 h-7 text-red-400 animate-pulse" />
            ) : (
              <Lock className="w-7 h-7 text-sky-400" />
            )}
          </div>
          <h3 className="text-lg font-bold font-display text-white">
            Portal Keamanan Admin PIONZ STORE
          </h3>
          <p className="text-xs text-slate-400">
            {isRecoveryMode
              ? 'Gunakan Kunci Pemulihan Darurat untuk masuk.'
              : 'Verifikasi identitas pemilik toko untuk mengelola katalog & akun.'}
          </p>
        </div>

        {/* Lockout Banner */}
        {lockoutRemaining > 0 && (
          <div className="mb-4 bg-red-950/40 border border-red-500/40 p-3 rounded-xl flex items-center gap-2.5 text-xs text-red-300">
            <Clock className="w-5 h-5 shrink-0 text-red-400 animate-spin" />
            <div>
              <div className="font-bold">Keamanan Terkunci!</div>
              <div className="text-[11px] text-red-400">
                Tunggu <strong className="font-mono text-white">{lockoutRemaining}</strong> detik untuk mencoba kembali.
              </div>
            </div>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {!isRecoveryMode ? (
            <>
              {/* Username Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  ID Admin
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    disabled={lockoutRemaining > 0}
                    autoFocus
                    placeholder="Masukkan Username Admin..."
                    value={usernameInput}
                    onChange={(e) => {
                      setUsernameInput(e.target.value);
                      setErrorMessage('');
                    }}
                    className="w-full bg-[#070b14] border border-slate-800 focus:border-sky-500 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-all disabled:opacity-50"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Password Rahasia
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    disabled={lockoutRemaining > 0}
                    placeholder="Masukkan Password..."
                    value={passwordInput}
                    onChange={(e) => {
                      setPasswordInput(e.target.value);
                      setErrorMessage('');
                    }}
                    className="w-full bg-[#070b14] border border-slate-800 focus:border-sky-500 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none transition-all disabled:opacity-50 tracking-wider"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </>
          ) : (
            /* Emergency Recovery Mode */
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Kunci Pemulihan Darurat (Security Key)
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-sky-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Format: PZ-SECURE-99"
                  value={recoveryKeyInput}
                  onChange={(e) => {
                    setRecoveryKeyInput(e.target.value);
                    setErrorMessage('');
                  }}
                  className="w-full bg-[#070b14] border border-sky-800 focus:border-sky-400 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-600 focus:outline-none font-mono tracking-wider"
                />
              </div>
            </div>
          )}

          {/* Error notice */}
          {errorMessage && (
            <div className="flex items-center gap-1.5 text-xs text-red-400 bg-red-950/20 border border-red-900/40 p-2.5 rounded-lg">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Credentials Guide Info */}
          <div className="bg-sky-950/30 border border-sky-500/20 p-2.5 rounded-lg text-[11px] text-slate-400 space-y-1">
            <div className="text-sky-300 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>Kredensial Bawaan Pemilik:</span>
            </div>
            <div>
              ID: <span className="text-white font-mono">{config.adminUsername}</span> | Pass:{' '}
              <span className="text-white font-mono">{config.adminPassword}</span>
            </div>
            <div className="text-[10px] text-slate-500">
              (Dapat Anda ganti sewaktu-waktu di dalam menu Pengaturan Admin)
            </div>
          </div>

          {/* Submit */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={lockoutRemaining > 0}
              className="w-full bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-400 hover:to-blue-500 disabled:opacity-50 text-white font-bold text-xs py-2.5 rounded-xl shadow-lg shadow-sky-950 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <Lock className="w-4 h-4" />
              <span>{isRecoveryMode ? 'Buka via Kunci Pemulihan' : 'Verifikasi & Masuk'}</span>
            </button>
          </div>

          {/* Switch recovery mode */}
          <div className="text-center pt-1">
            <button
              type="button"
              onClick={() => {
                setIsRecoveryMode(!isRecoveryMode);
                setErrorMessage('');
              }}
              className="text-[11px] text-slate-400 hover:text-sky-400 transition-colors cursor-pointer"
            >
              {isRecoveryMode
                ? '← Kembali ke Login Biasa'
                : 'Lupa Password? Gunakan Kunci Pemulihan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
