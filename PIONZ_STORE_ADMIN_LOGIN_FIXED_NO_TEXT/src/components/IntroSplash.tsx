import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

interface IntroSplashProps {
  logoUrl: string;
  onFinish: () => void;
}

export const IntroSplash: React.FC<IntroSplashProps> = ({ logoUrl, onFinish }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onFinish, 400);
          return 100;
        }
        return prev + 5;
      });
    }, 110);

    return () => clearInterval(timer);
  }, [onFinish]);

  return (
    <AnimatePresence>
      <motion.div
        id="intro-splash-screen"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0, scale: 1.05, transition: { duration: 0.6, ease: 'easeInOut' } }}
        className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#070b14] px-4 overflow-hidden"
      >
        {/* Ambient lighting effects in calm blue/cyan */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[580px] h-[580px] bg-sky-600/10 rounded-full blur-3xl" />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[380px] h-[380px] bg-blue-500/10 rounded-full blur-2xl" />
          {/* Subtle tech grid pattern */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#0ea5e908_1px,transparent_1px),linear-gradient(to_bottom,#0ea5e908_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
        </div>

        {/* Skip button at top right */}
        <button
          id="btn-skip-intro"
          onClick={onFinish}
          className="absolute top-6 right-6 text-xs text-slate-400 hover:text-sky-300 border border-slate-800 hover:border-sky-500/40 bg-slate-900/70 backdrop-blur px-3 py-1.5 rounded-full transition-all flex items-center gap-1.5 cursor-pointer z-10"
        >
          <span>Lewati</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        {/* Main animated container */}
        <div className="relative z-10 flex flex-col items-center text-center max-w-md w-full">
          {/* Logo with calm blue aura */}
          <motion.div
            initial={{ scale: 0.4, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: 'spring', bounce: 0.4 }}
            className="relative mb-6"
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-sky-500 via-blue-600 to-cyan-500 rounded-2xl blur-lg opacity-40 animate-pulse" />
            <div className="relative w-28 h-28 sm:w-36 sm:h-36 rounded-2xl p-1 bg-gradient-to-br from-sky-400 via-blue-600 to-indigo-800 shadow-2xl shadow-sky-500/15">
              <img
                src={logoUrl}
                alt="PIONZ STORE Logo"
                className="w-full h-full object-cover rounded-xl bg-slate-950"
                referrerPolicy="no-referrer"
              />
            </div>

            {/* Sparkle badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, duration: 0.3 }}
              className="absolute -bottom-2 -right-2 bg-sky-500 text-slate-950 p-1.5 rounded-lg shadow-lg"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
            </motion.div>
          </motion.div>

          {/* Store Name with calm bluish typography */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="space-y-1"
          >
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-slate-100 via-sky-300 to-blue-400 uppercase drop-shadow-md">
              PIONZ STORE
            </h1>

            <motion.div
              initial={{ opacity: 0, letterSpacing: '0.1em' }}
              animate={{ opacity: 1, letterSpacing: '0.25em' }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-xs sm:text-sm font-semibold text-sky-200/80 uppercase tracking-widest pt-1 font-display"
            >
              Tempat Jual Beli Akun
            </motion.div>
          </motion.div>

          {/* Trust badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.0, duration: 0.5 }}
            className="flex items-center justify-center gap-2.5 mt-4 text-[11px] text-sky-300 bg-sky-950/40 border border-sky-500/20 px-3.5 py-1 rounded-full"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
            <span>100% Amanah & Bergaransi Anti Hackback</span>
          </motion.div>

          {/* Loading bar in calm cyan */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.4 }}
            className="w-full mt-8 max-w-xs"
          >
            <div className="flex justify-between text-[11px] text-slate-400 mb-1.5 font-mono">
              <span>Menyiapkan Katalog Akun...</span>
              <span className="text-sky-400 font-semibold">{progress}%</span>
            </div>
            <div className="w-full bg-slate-900 border border-slate-800 h-2 rounded-full overflow-hidden p-0.5">
              <motion.div
                className="h-full bg-gradient-to-r from-sky-500 via-blue-500 to-cyan-400 rounded-full"
                style={{ width: `${progress}%` }}
                transition={{ ease: 'linear' }}
              />
            </div>
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
