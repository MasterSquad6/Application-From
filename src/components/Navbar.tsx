import React from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, History } from 'lucide-react';

interface NavbarProps {
  onApply: () => void;
  onHistory: () => void;
  onAbout: () => void;
  onSupport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onApply, onHistory, onAbout, onSupport }) => (
  <motion.nav 
    initial={{ y: -100 }}
    animate={{ y: 0 }}
    className="sticky top-0 z-50 bg-white/80 backdrop-blur-xl border-b border-brand-blue/10 px-6 py-4 flex items-center justify-between"
  >
    <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.location.reload()}>
      <div className="w-10 h-10 rounded-xl bg-linear-to-br from-brand-blue to-brand-glow flex items-center justify-center shadow-lg shadow-brand-blue/20">
        <ShoppingBag className="text-white w-5 h-5" />
      </div>
      <span className="font-display font-extrabold text-xl tracking-tight text-brand-deep">ShopVerse</span>
    </div>
    
    <div className="flex items-center gap-2 md:gap-4">
      <div className="hidden lg:flex items-center gap-4 mr-4">
        <button onClick={onAbout} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-brand-blue transition-colors">আমাদের সম্পর্কে</button>
        <button onClick={onSupport} className="text-xs font-black uppercase tracking-widest text-slate-400 hover:text-brand-blue transition-colors">সাপোর্ট</button>
      </div>
      <button 
        onClick={onHistory}
        className="hidden sm:flex items-center gap-2 text-slate-500 hover:text-brand-blue transition-colors px-4 py-2 font-bold text-sm"
      >
        <History className="w-4 h-4" /> হিস্টোরি
      </button>
      <div className="hidden lg:flex bg-brand-blue/10 text-brand-blue text-[11px] font-bold px-3 py-1.5 rounded-full tracking-wider uppercase animate-pulse">
        ⚡ আমরা নিয়োগ দিচ্ছি
      </div>
      <button 
        onClick={onApply}
        className="bg-brand-blue hover:bg-brand-glow text-white px-5 py-2 rounded-xl text-sm font-bold transition-all hover:scale-105 active:scale-95 shadow-md shadow-brand-blue/20"
      >
        আবেদন করুন
      </button>
    </div>
  </motion.nav>
);
