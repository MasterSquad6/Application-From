import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ChevronRight, History, Search, Lock, AlertCircle, Loader2, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onApply: () => void;
  onSearch: (id: string, pass: string) => void;
  searchError: string | null;
  searchLoading: boolean;
  recentApplicants: any[];
  stats: { cs_admin_vacancies: number; va_vacancies: number; hired_count: number } | null;
}

export const Hero: React.FC<HeroProps> = ({ 
  onApply, 
  onSearch, 
  searchError, 
  searchLoading, 
  recentApplicants, 
  stats 
}) => {
  const [simulatedApplicants, setSimulatedApplicants] = useState([
    { n: 'রাকিব আহমেদ', t: '৩ মিনিট আগে', p: 'CS অ্যাডমিন', i: 'R' },
    { n: 'ফাতেমা আক্তার', t: '১২ মিনিট আগে', p: 'VA', i: 'F' },
    { n: 'নাসির হোসেন', t: '২৫ মিনিট আগে', p: 'CS অ্যাডমিন', i: 'N' },
  ]);

  const [sId, setSId] = useState('');
  const [sPass, setSPass] = useState('');

  useEffect(() => {
    const names = [
      'রাকিব আহমেদ', 'ফাতেমা আক্তার', 'নাসির হোসেন', 'আহনাফ শাহরিয়ার', 'সাদিয়া ইসলাম', 
      'তানজিমুল হক', 'নুসরাত জাহান', 'রাইয়ান আহমেদ', 'সাবরিনা চৌধুরী', 'ইশতিয়াক আহমেদ', 
      'মারিয়া হোসাইন', 'ফাহিম মোর্শেদ', 'আনিকা তাহসিন', 'মাহমুদুল হাসান', 'তাসনিম সুমি', 
      'জায়েদ বিন রশিদ', 'সুমাইয়া বিনতে আলম', 'নাইমুল ইসলাম', 'জিনাত রেহানা', 'আরিফুল হক'
    ];
    const positions = ['CS অ্যাডমিন', 'VA'];
    
    const interval = setInterval(() => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomPos = positions[Math.floor(Math.random() * positions.length)];
      setSimulatedApplicants(prev => [{ n: randomName, t: 'এইমাত্র', p: randomPos, i: randomName.charAt(0) }, ...prev.slice(0, 2)]);
    }, 2700000); 

    return () => clearInterval(interval);
  }, []);

  const displayedApplicants = [
    ...recentApplicants
      .filter(app => app.fullName || app.name || app.displayName)
      .map(app => {
        const name = app.fullName || app.name || app.displayName || 'আবেদনকারী';
        return {
          n: name,
          t: app.submittedAt?.toDate ? app.submittedAt.toDate().toLocaleTimeString('bn-BD', { hour: '2-digit', minute: '2-digit' }) : 'এই মাত্র',
          p: app.position === 'cs_admin' ? 'CS অ্যাডমিন' : 'VA',
          i: name.trim().charAt(0) || '?',
          isReal: true,
          id: app.id
        };
      }),
    ...simulatedApplicants.map((app, idx) => ({ ...app, isReal: false, id: `sim-${idx}` }))
  ].slice(0, 3);

  return (
    <section className="relative px-6 py-12 lg:py-32 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-24 items-center overflow-hidden">
      <motion.div 
        animate={{ 
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute -top-24 -right-24 w-72 h-72 lg:w-96 lg:h-96 bg-brand-blue/10 rounded-full blur-3xl -z-10" 
      />
      <motion.div 
        animate={{ 
          scale: [1, 1.3, 1],
          x: [0, 50, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
        className="absolute top-1/2 -left-24 w-48 h-48 lg:w-64 lg:h-64 bg-brand-glow/10 rounded-full blur-3xl -z-10" 
      />

      <motion.div
        initial={{ opacity: 0, x: -50 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center lg:text-left order-1 lg:order-none"
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-blue/20 bg-brand-blue/5 text-brand-blue text-[10px] font-semibold tracking-widest uppercase mb-8"
        >
          <span className="w-2 h-2 rounded-full bg-brand-blue animate-ping" />
          বিশ্বস্ত ই-কমার্স ক্যারিয়ার প্ল্যাটফর্ম
        </motion.div>
        
        <h1 className="font-display text-[42px] sm:text-6xl lg:text-7xl font-extrabold text-brand-deep leading-[1.1] tracking-tighter mb-8">
          ভবিষ্যতের জন্য <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-blue via-brand-glow to-brand-blue bg-[length:200%_auto] animate-gradient-x underline decoration-brand-blue/20 underline-offset-8">সঠিক ক্যারিয়ার</span> <br />
          গড়ে তুলুন আমাদের সাথে
        </h1>
        
        <p className="text-slate-600 text-lg lg:text-xl leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0 text-balance font-medium">
          ShopVerse-এ কাজ করার অর্থ হলো স্বচ্ছতা, পেশাদারিত্ব এবং উজ্জ্বল ভবিষ্যৎ। আমাদের সাথে যোগ দিয়ে নিজেকে ই-কমার্স জগতের একজন দক্ষ পেশাদার হিসেবে প্রমাণ করুন।
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
          <motion.button 
            whileHover={{ scale: 1.05, y: -4 }}
            whileTap={{ scale: 0.95 }}
            onClick={onApply}
            className="group relative bg-brand-deep text-white px-10 py-5 rounded-2xl font-display font-bold text-lg overflow-hidden transition-all shadow-2xl shadow-brand-deep/20"
          >
            <div className="absolute inset-0 bg-linear-to-r from-brand-blue to-brand-glow opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative flex items-center justify-center gap-3">
              🚀 আবেদন শুরু করুন <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </motion.button>
        </div>

        <div className="flex items-center justify-center lg:justify-start gap-8 opacity-60">
          <div className="flex flex-col">
            <span className="font-display font-black text-2xl text-brand-deep">১০০%</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">নিরাপদ পোর্টাল</span>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="flex flex-col">
            <span className="font-display font-black text-2xl text-brand-deep">২৪/৭</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">সাপোর্ট সিস্টেম</span>
          </div>
          <div className="w-px h-8 bg-slate-200" />
          <div className="flex flex-col">
            <span className="font-display font-black text-2xl text-brand-deep">০%</span>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-400">আবেদন ফি</span>
          </div>
        </div>
      </motion.div>

      <motion.div
        id="search-section"
        initial={{ opacity: 0, scale: 0.9, x: 50 }}
        whileInView={{ opacity: 1, scale: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative order-2 lg:order-none"
      >
        <div className="relative z-10 bg-white p-6 sm:p-10 rounded-[40px] shadow-premium border border-white">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <History className="w-5 h-5 text-brand-blue" />
              <h4 className="text-xs font-black text-brand-deep uppercase tracking-widest">আবেদন ট্র্যাকিং</h4>
            </div>
          </div>

          <form className="space-y-4 mb-10" onSubmit={(e) => { e.preventDefault(); onSearch(sId, sPass); }}>
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-blue transition-colors" />
              <input 
                type="text" 
                placeholder="সার্চ আইডি (SV-XXXXXX-XXX)"
                value={sId}
                onChange={e => { setSId(e.target.value); }}
                className="w-full pl-11 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-brand-blue/50 focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all text-sm font-bold"
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-brand-blue transition-colors" />
              <input 
                type="password" 
                placeholder="সিকিউরিটি পাসওয়ার্ড"
                value={sPass}
                onChange={e => { setSPass(e.target.value); }}
                className="w-full pl-11 pr-4 py-4 rounded-2xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-brand-blue/50 focus:ring-4 focus:ring-brand-blue/5 outline-none transition-all text-sm font-bold"
              />
            </div>
            
            {searchError && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-4 rounded-2xl bg-red-50 border border-red-100"
              >
                <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
                <p className="text-[11px] text-red-600 font-bold">{searchError}</p>
              </motion.div>
            )}

            <motion.button 
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={searchLoading}
              className="w-full bg-brand-deep text-white py-4 rounded-2xl font-bold hover:bg-brand-blue transition-all shadow-xl shadow-brand-deep/10 text-sm flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {searchLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'স্টেটাস চেক করুন'}
            </motion.button>
          </form>

          <div className="pt-8 border-t border-slate-100">
             <div className="flex items-center justify-between mb-6">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">শূন্যপদ আপডেট</p>
                <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[9px] font-black uppercase tracking-tighter">Live</div>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-50 border border-white hover:border-brand-blue/20 transition-all">
                  <p className="text-2xl font-display font-black text-brand-blue">{stats?.cs_admin_vacancies || 0}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">CS অ্যাডমিন</p>
                </div>
                <div className="p-4 rounded-2xl bg-slate-50 border border-white hover:border-brand-blue/20 transition-all">
                  <p className="text-2xl font-display font-black text-emerald-600">{stats?.va_vacancies || 0}</p>
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">VA পজিশন</p>
                </div>
             </div>
          </div>
        </div>
        
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -bottom-10 -left-10 z-20 hidden lg:block"
        >
          <div className="bg-white p-5 rounded-2xl shadow-premium border border-slate-100 flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle2 className="w-6 h-6" />
             </div>
             <div>
                <p className="text-xs font-bold text-brand-deep">সফল নিয়োগ</p>
                <p className="text-[10px] text-slate-400 font-medium">{stats?.hired_count || 0}+ জন সদস্য</p>
             </div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
};
