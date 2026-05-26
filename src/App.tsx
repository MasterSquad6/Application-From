/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, ChangeEvent, MouseEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  ChevronRight, 
  ShieldCheck, 
  Users, 
  BarChart3, 
  Globe, 
  Clock, 
  TrendingUp, 
  CheckCircle2, 
  ArrowLeft,
  Mail,
  Phone,
  FileText,
  Briefcase,
  Layers,
  Star,
  Send,
  Upload,
  AlertCircle,
  Loader2,
  Search,
  Lock,
  History,
  FileSearch,
  MessageCircle,
  Camera,
  X
} from 'lucide-react';
import { 
  submitApplication, 
  uploadToImageKit, 
  getApplicationByDisplayId, 
  updateApplicationStatus,
  getStats,
  getRecentApplications,
  updateStats
} from './lib/firebase';

// --- Types ---

type Step = 1 | 2 | 3 | 4;

interface ApplicationData {
  fullName: string;
  dob: string;
  email: string;
  phone: string;
  whatsapp: string;
  city: string;
  gender: string;
  position: string;
  experience: string;
  workType: string;
  hoursPerDay: number;
  previousCompany: string;
  bio: string;
  platforms: string[];
  skills: string[];
  tools: string[];
  englishRating: number;
  salaryExpectation: string;
  facebookLink: string;
  agree: boolean;
  imageUrls: Record<string, string>;
}

interface ApplicationStatus {
  id: string;
  displayId: string;
  password?: string;
  status: string;
  adminNote?: string;
  fullName: string;
  position: string;
  submittedAt?: any;
}

const initialData: ApplicationData = {
  fullName: '',
  dob: '',
  email: '',
  phone: '',
  whatsapp: '',
  city: '',
  gender: '',
  position: '',
  experience: '',
  workType: 'Remote',
  hoursPerDay: 8,
  previousCompany: '',
  bio: '',
  platforms: [],
  skills: [],
  tools: [],
  englishRating: 0,
  salaryExpectation: '',
  facebookLink: '',
  agree: false,
  imageUrls: {},
};

const BRANDS = [
  { l: '🛒', n: 'Shopify', c: 'bg-emerald-50' },
  { l: '📦', n: 'WooCommerce', c: 'bg-purple-50' },
  { l: '🔥', n: 'Daraz', c: 'bg-orange-100' },
  { l: '🥬', n: 'Chaldal', c: 'bg-green-50' },
  { l: '🏬', n: 'Evaly', c: 'bg-red-50' },
  { l: '🍎', n: 'Pickaboo', c: 'bg-slate-50' },
  { l: '🛍️', n: 'Aarong', c: 'bg-amber-50' },
  { l: '🎨', n: 'Shajgoj', c: 'bg-pink-50' },
  { l: '✨', n: 'Othoba', c: 'bg-blue-50' },
  { l: '🏮', n: 'Alibaba', c: 'bg-orange-50' },
  { l: '👠', n: 'Rokomari', c: 'bg-red-50' },
  { l: '👟', n: 'Bata BD', c: 'bg-red-50' },
  { l: '👗', n: 'PriyoShop', c: 'bg-blue-50' },
  { l: '🚚', n: 'Pathao', c: 'bg-red-50' },
  { l: '💎', n: 'Diamond World', c: 'bg-blue-50' },
  { l: '⚡', n: 'Amana Big', c: 'bg-yellow-50' },
  { l: '📱', n: 'Gadget & Gear', c: 'bg-slate-100' },
  { l: '🥛', n: 'Khaas Food', c: 'bg-green-50' },
];

// --- Components ---

const Brand: React.FC<{ logo: string, name: string, color?: string }> = ({ logo, name, color }) => (
    <div className="flex items-center gap-2 md:gap-4 px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl bg-white/50 border border-slate-100/50 backdrop-blur-sm grayscale opacity-40 hover:grayscale-0 hover:opacity-100 hover:border-brand-blue/20 hover:bg-white transition-all duration-500 cursor-default group shrink-0">
    <div className={`w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center text-xl md:text-2xl shadow-sm border border-slate-50 transition-transform group-hover:scale-110 ${color || 'bg-slate-50'}`}>
      {logo}
    </div>
    <span className="font-display font-extrabold text-sm md:text-lg text-slate-800 tracking-tight">{name}</span>
  </div>
);

const Navbar = ({ onApply, onHistory }: { onApply: () => void, onHistory: () => void }) => (
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
    
    <div className="flex items-center gap-4">
      <button 
        onClick={onHistory}
        className="hidden md:flex items-center gap-2 text-slate-500 hover:text-brand-blue transition-colors px-4 py-2 font-bold text-sm"
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

const Hero = ({ onApply, onSearch, searchError, searchLoading, recentApplicants, stats }: { 
  onApply: () => void, 
  onSearch: (id: string, pass: string) => void,
  searchError: string | null,
  searchLoading: boolean,
  recentApplicants: any[],
  stats: { cs_admin_vacancies: number, va_vacancies: number, hired_count: number } | null
}) => {
  const [simulatedApplicants, setSimulatedApplicants] = useState<{n:string, t:string, p:string, i:string}[]>([
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
      {/* Dynamic Background Elements */}
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
        
        {/* Floating Decoration */}
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




const TrustSection = () => (
  <section className="px-6 py-24 bg-brand-deep text-white relative overflow-hidden">
    <motion.div 
      animate={{ opacity: [0.05, 0.1, 0.05] }}
      transition={{ duration: 5, repeat: Infinity }}
      className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" 
    />
    <div className="max-w-7xl mx-auto relative z-10">
      <div className="grid lg:grid-cols-2 gap-16 items-center">
        <motion.div
           initial={{ opacity: 0, x: -30 }}
           whileInView={{ opacity: 1, x: 0 }}
           viewport={{ once: true }}
        >
          <div className="w-20 h-20 rounded-3xl bg-white/10 flex items-center justify-center mb-10 backdrop-blur-xl border border-white/10 shadow-3xl">
            <ShieldCheck className="w-10 h-10 text-brand-glow" />
          </div>
          <h2 className="font-display text-4xl lg:text-6xl font-black mb-8 tracking-tighter leading-tight">
            নিরাপদ আবেদন, <br />
            <span className="text-brand-glow">স্বচ্ছ ক্যারিয়ার</span>
          </h2>
          <p className="text-slate-400 text-lg sm:text-xl leading-relaxed mb-12 max-w-lg font-medium">
            ShopVerse একটি প্রফেশনাল কমিউনিটি। আমাদের এখানে কোনো হিডেন চার্জ বা আবেদন ফি নেই। আমরা মেধা এবং দক্ষতার মূল্যায়ন করি।
          </p>
          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { t: 'কোণ ফ্রি নেই', d: '১০০% ফ্রি আবেদন প্রক্রিয়া' },
              { t: 'তথ্য সুরক্ষা', d: 'আপনার তথ্য আমাদের কাছে নিরাপদ' },
              { t: 'দ্রুত রেসপন্স', d: '৭২ ঘণ্টার মধ্যে আবেদনের ফলাফল' },
              { t: 'সরাসরি ইন্টারভিউ', d: 'যোগ্যদের জন্য সরাসরি ডাক' }
            ].map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                   <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                   <h5 className="font-bold text-sm mb-1">{item.t}</h5>
                   <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{item.d}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
        
        <div className="grid grid-cols-2 gap-4 sm:gap-8">
           {[
             { icon: Globe, label: 'গ্লোবাল ভিশন', val: '৩+ মার্কেট' },
             { icon: Users, label: 'এক্সপার্ট টিম', val: '১০০+ সদস্য' },
             { icon: BarChart3, label: 'সাফল্যের হার', val: '৯৫% গ্রোথ' },
             { icon: Clock, label: 'সাপোর্ট', val: '২৪/৭ লাইভ' },
           ].map((stat, i) => (
             <motion.div 
               key={i}
               initial={{ opacity: 0, y: 30 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: i * 0.1 }}
               whileHover={{ y: -10, backgroundColor: "rgba(255,255,255,0.08)" }}
               className="p-8 sm:p-10 rounded-[40px] bg-white/5 border border-white/10 backdrop-blur-md transition-all group"
             >
               <stat.icon className="w-10 h-10 text-brand-glow mb-6 group-hover:scale-110 transition-transform" />
               <h5 className="text-2xl font-display font-black mb-1 lg:text-3xl tracking-tight">{stat.label}</h5>
               <p className="text-[11px] text-slate-500 font-black uppercase tracking-[0.3em]">{stat.val}</p>
             </motion.div>
           ))}
        </div>
      </div>
    </div>
  </section>
);

// --- Form Components ---

const Progress = ({ step }: { step: Step }) => (
  <div className="flex items-center justify-between gap-1 sm:gap-2 mb-10 max-w-md mx-auto">
    {[
      { s: 1, l: 'ব্যক্তিগত' },
      { s: 2, l: 'অভিজ্ঞতা' },
      { s: 3, l: 'দক্ষতা' },
      { s: 4, l: 'ডকুমেন্ট' }
    ].map((item) => (
      <div key={item.s} className="flex flex-col items-center gap-2 flex-1 last:flex-none">
        <div className="flex items-center gap-1 sm:gap-2 w-full">
          <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-display font-bold text-xs sm:text-sm transition-all duration-500 flex-shrink-0 ${
            step >= item.s ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30' : 'bg-white border-2 border-slate-100 text-slate-300'
          }`}>
            {step > item.s ? <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" /> : item.s}
          </div>
          {item.s < 4 && <div className={`h-1 flex-1 rounded-full transition-all duration-500 ${step > item.s ? 'bg-brand-blue' : 'bg-slate-100'}`} />}
        </div>
        <span className={`text-[8px] sm:text-[10px] font-black uppercase tracking-widest ${step >= item.s ? 'text-brand-blue' : 'text-slate-300'}`}>
          {item.l}
        </span>
      </div>
    ))}
  </div>
);

const Field: React.FC<{ label: string, required?: boolean, children: React.ReactNode }> = ({ label, required, children }) => (
  <div className="space-y-2">
    <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest pl-1">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    {children}
  </div>
);

const UploadBox: React.FC<{ 
  label: string, 
  icon: any, 
  onFileSelect: (f: File) => void, 
  isUploaded: boolean, 
  progress?: number, 
  accept?: string,
  previewUrl?: string 
}> = ({ label, icon: Icon, onFileSelect, isUploaded, progress, accept, previewUrl }) => (
  <label className={`relative group flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed transition-all cursor-pointer h-[180px] overflow-hidden ${
    isUploaded ? 'border-brand-blue bg-brand-blue/5' : 'border-slate-200 bg-slate-50 hover:border-brand-blue/30'
  }`}>
    {previewUrl && (
      <div className="absolute inset-0 z-0 opacity-20 group-hover:opacity-10 transition-opacity">
        <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
      </div>
    )}
    
    <div className="relative z-10 flex flex-col items-center gap-2">
      <div className={`p-3 rounded-xl transition-all ${isUploaded ? 'bg-brand-blue text-white shadow-lg' : 'bg-white text-slate-400 group-hover:scale-110'}`}>
        <Icon className="w-6 h-6" />
      </div>
      <span className={`text-[10px] font-black uppercase tracking-widest ${isUploaded ? 'text-brand-blue' : 'text-slate-500'}`}>{label}</span>
      
      {isUploaded && !progress && (
        <div className="mt-1 flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full border border-emerald-100">
          <CheckCircle2 className="w-3 h-3" />
          <span className="text-[10px] font-black">আপলোড সম্পন্ন</span>
        </div>
      )}
    </div>

    <input type="file" className="hidden" accept={accept || "image/*"} onChange={(e) => e.target.files && onFileSelect(e.target.files[0])} />
    
    {progress !== undefined && progress > 0 && progress < 100 && (
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-white/90 p-4 transition-all backdrop-blur-sm">
        <div className="relative w-16 h-16 flex items-center justify-center mb-2">
          <svg className="w-full h-full -rotate-90">
            <circle cx="32" cy="32" r="28" fill="transparent" stroke="currentColor" strokeWidth="4" className="text-slate-100" />
            <circle 
              cx="32" cy="32" r="28" fill="transparent" stroke="currentColor" strokeWidth="4" 
              strokeDasharray={176}
              strokeDashoffset={176 - (176 * progress) / 100}
              className="text-brand-blue transition-all duration-300" 
            />
          </svg>
          <span className="absolute font-black text-xs text-brand-blue">{Math.round(progress)}%</span>
        </div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest animate-pulse">ফাইল আপলোড হচ্ছে</p>
      </div>
    )}
  </label>
);

const Tag: React.FC<{ label: string, active: boolean, onClick: () => void }> = ({ label, active, onClick }) => (
  <button 
    type="button"
    onClick={onClick}
    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
      active 
        ? 'bg-brand-blue text-white shadow-md' 
        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
    }`}
  >
    {label}
  </button>
);

// --- Admin Dashboard Component ---

const AdminDashboard = ({ 
  applicants, 
  stats, 
  onClose, 
  onUpdateStatus, 
  onUpdateStats,
  refreshData
}: { 
  applicants: any[], 
  stats: any, 
  onClose: () => void,
  onUpdateStatus: (id: string, status: string, note: string) => Promise<any>,
  onUpdateStats: (cs: number, va: number, hired: number) => Promise<any>,
  refreshData: () => void
}) => {
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [csVac, setCsVac] = useState(stats?.cs_admin_vacancies || 0);
  const [vaVac, setVaVac] = useState(stats?.va_vacancies || 0);
  const [hired, setHired] = useState(stats?.hired_count || 0);
  const [updating, setUpdating] = useState(false);
  const [search, setSearch] = useState('');

  const filtered = applicants.filter(a => 
    a.fullName?.toLowerCase().includes(search.toLowerCase()) || 
    a.phone?.includes(search) ||
    a.displayId?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="bg-brand-deep text-white px-6 py-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-6 h-6 text-brand-glow" />
          <h2 className="font-display font-extrabold text-xl">SV-Admin Control</h2>
        </div>
        <button 
          onClick={onClose} 
          className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-xl font-bold text-sm transition-all group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> 
          ড্যাশবোর্ড বন্ধ করুন
        </button>
      </nav>

      <main className="flex-1 p-6 lg:p-12 max-w-7xl mx-auto w-full space-y-10">
        {/* Quick Stats Section */}
        <section className="grid sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Users className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">মোট আবেদন</span>
            </div>
            <p className="text-3xl font-display font-black text-brand-deep">{applicants.length}</p>
          </div>
          <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-400">
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">নিয়োগপ্রাপ্ত</span>
            </div>
            <p className="text-3xl font-display font-black text-emerald-600">{stats?.hired_count || 0}</p>
          </div>
          <div className="bg-white p-6 rounded-[24px] border border-slate-100 shadow-sm space-y-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Briefcase className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">সক্রিয় শূন্যপদ</span>
            </div>
            <p className="text-3xl font-display font-black text-brand-blue">{(stats?.cs_admin_vacancies || 0) + (stats?.va_vacancies || 0)}</p>
          </div>
        </section>

        <div className="grid lg:grid-cols-3 gap-10">
          {/* Vacancy Management */}
          <section className="lg:col-span-1 bg-white p-8 rounded-[32px] border border-slate-100 shadow-xl self-start space-y-6">
            <h3 className="text-sm font-black text-brand-deep uppercase tracking-widest flex items-center gap-2 italic">
              <TrendingUp className="w-4 h-4" /> ভ্যাকেন্সি আপডেট করুন
            </h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">CS অ্যাডমিন ভ্যাকেন্সি</label>
                <input type="number" value={csVac} onChange={e => setCsVac(Number(e.target.value))} className="w-full p-4 rounded-xl border border-slate-100 focus:border-brand-blue outline-none text-sm font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">VA ভ্যাকেন্সি</label>
                <input type="number" value={vaVac} onChange={e => setVaVac(Number(e.target.value))} className="w-full p-4 rounded-xl border border-slate-100 focus:border-brand-blue outline-none text-sm font-bold" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">মোট নিয়োগ</label>
                <input type="number" value={hired} onChange={e => setHired(Number(e.target.value))} className="w-full p-4 rounded-xl border border-slate-100 focus:border-brand-blue outline-none text-sm font-bold" />
              </div>
              <button 
                disabled={updating}
                onClick={async () => {
                  setUpdating(true);
                  const { updateStats } = await import('./lib/firebase');
                  await updateStats(csVac, vaVac, hired);
                  setUpdating(false);
                  refreshData();
                  alert('ভ্যাকেন্সি সফলভাবে আপডেট হয়েছে!');
                }}
                className="w-full bg-brand-deep text-white py-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-brand-blue transition-all disabled:opacity-50"
              >
                {updating ? <Loader2 className="w-4 h-4 animate-spin" /> : 'সব সেভ করুন'}
              </button>
            </div>
          </section>

          {/* Applicant List */}
          <section className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-brand-deep uppercase tracking-widest italic">আবেদনকারীর তালিকা ({filtered.length})</h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="খুঁজুন..." 
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  className="pl-10 pr-4 py-2 bg-white rounded-full border border-slate-100 text-xs font-bold w-48 sm:w-64 focus:border-brand-blue outline-none" 
                />
              </div>
            </div>

            <div className="grid gap-4">
              <AnimatePresence mode="popLayout">
                {filtered.map(app => (
                  <motion.div 
                    layout
                    key={app.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => setSelectedApp(app)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer group ${selectedApp?.id === app.id ? 'bg-brand-blue text-white border-brand-blue shadow-lg' : 'bg-white border-slate-100 hover:border-brand-blue/30'}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${selectedApp?.id === app.id ? 'bg-white/20' : 'bg-slate-50 text-brand-blue'}`}>
                          {app.fullName?.charAt(0) || '?'}
                        </div>
                        <div>
                          <p className={`font-bold ${selectedApp?.id === app.id ? 'text-white' : 'text-brand-deep'}`}>{app.fullName}</p>
                          <p className={`text-[10px] font-medium ${selectedApp?.id === app.id ? 'text-white/70' : 'text-slate-400'}`}>ID: {app.displayId} • {app.phone}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest ${
                          app.status === 'hired' ? 'bg-emerald-500 text-white' : 
                          app.status === 'interview' ? 'bg-amber-400 text-white' : 
                          app.status === 'rejected' ? 'bg-red-500 text-white' : 
                          'bg-slate-100 text-slate-500'
                        }`}>
                          {app.status}
                        </span>
                        <p className={`text-[9px] mt-2 font-medium ${selectedApp?.id === app.id ? 'text-white/50' : 'text-slate-300'}`}>
                          {app.submittedAt?.toDate?.()?.toLocaleDateString('bn-BD')}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </section>
        </div>
      </main>

      {/* Edit Modal */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-100 flex items-center justify-center p-6 sm:p-10">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedApp(null)}
              className="absolute inset-0 bg-brand-deep/80 backdrop-blur-md"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row"
            >
              <div className="md:w-1/2 p-10 bg-slate-50 border-r border-slate-200 overflow-y-auto max-h-[40vh] md:max-h-[80vh]">
                <h4 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">আবেদনকারীর বিবরণ</h4>
                <div className="space-y-6">
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">পজিশন</p>
                    <p className="font-bold text-brand-deep capitalize">{selectedApp.position}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">ইমেইল</p>
                      <p className="font-bold text-brand-deep text-xs break-all">{selectedApp.email}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">ফোন নম্বর</p>
                      <p className="font-bold text-brand-deep">{selectedApp.phone}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">WhatsApp</p>
                      <p className="font-bold text-brand-deep">{selectedApp.whatsapp || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">লিঙ্গ</p>
                      <p className="font-bold text-brand-deep capitalize">{selectedApp.gender}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">ঠিকানা</p>
                      <p className="font-bold text-brand-deep">{selectedApp.city}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">জন্ম তারিখ</p>
                      <p className="font-bold text-brand-deep">{selectedApp.dob}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">অভিজ্ঞতা</p>
                      <p className="font-bold text-brand-deep">{selectedApp.experience}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">ইংরেজি দক্ষতা</p>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-brand-deep">{selectedApp.englishRating}/5</span>
                        <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">কাজের ধরন</p>
                      <p className="font-bold text-brand-deep">{selectedApp.workType}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">প্রতিদিনের সময়</p>
                      <p className="font-bold text-brand-deep">{selectedApp.hoursPerDay} ঘন্টা</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase">বেতন প্রত্যাশা</p>
                    <p className="font-bold text-brand-deep">{selectedApp.salaryExpectation}</p>
                  </div>
                  {selectedApp.facebookLink && (
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Facebook প্রোফাইল</p>
                      <a href={selectedApp.facebookLink} target="_blank" rel="noreferrer" className="text-xs font-bold text-brand-blue hover:underline break-all">
                        {selectedApp.facebookLink}
                      </a>
                    </div>
                  )}
                  {selectedApp.previousCompany && (
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">পূর্ববর্তী কোম্পানি</p>
                      <p className="font-bold text-brand-deep">{selectedApp.previousCompany}</p>
                    </div>
                  )}
                  {selectedApp.bio && (
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">বায়ো / তথ্য</p>
                      <p className="text-xs font-medium text-slate-600 bg-white p-3 rounded-xl border border-slate-100">{selectedApp.bio}</p>
                    </div>
                  )}
                  {selectedApp.platforms?.length > 0 && (
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">পরিচিত প্ল্যাটফর্মসমূহ</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedApp.platforms.map((p: string) => (
                          <span key={p} className="px-2 py-1 bg-purple-50 text-purple-600 text-[10px] font-bold rounded-md">
                            {p}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedApp.skills?.length > 0 && (
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">দক্ষতা (Skills)</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedApp.skills.map((s: string) => (
                          <span key={s} className="px-2 py-1 bg-brand-blue/5 text-brand-blue text-[10px] font-bold rounded-md">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedApp.tools?.length > 0 && (
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mb-2">ব্যবহৃত টুলস</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedApp.tools.map((t: string) => (
                          <span key={t} className="px-2 py-1 bg-slate-100 text-slate-500 text-[10px] font-bold rounded-md">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase mb-3">ডকুমেন্টস (ক্লিক করুন বড় করতে)</p>
                    <div className="grid grid-cols-3 gap-3">
                       {Object.entries(selectedApp.imageUrls || {}).map(([label, url]) => (
                         <div 
                           key={label} 
                           onClick={() => setLightboxUrl(url as string)}
                           className="group/img relative aspect-square rounded-xl overflow-hidden border-2 border-slate-200 bg-white cursor-zoom-in hover:border-brand-blue transition-all"
                         >
                           <img src={url as string} alt={label} className="w-full h-full object-cover" />
                           <div className="absolute inset-0 bg-black/0 group-hover/img:bg-black/20 flex items-center justify-center transition-colors">
                             <Search className="w-4 h-4 text-white opacity-0 group-hover/img:opacity-100 scale-50 group-hover/img:scale-100 transition-all" />
                           </div>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:w-1/2 p-10 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-brand-blue uppercase tracking-widest">স্ট্যাটাস আপডেট</h4>
                  <button onClick={() => setSelectedApp(null)} className="text-slate-400 hover:text-red-500 transition-colors"><ArrowLeft className="w-5 h-5" /></button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {['pending', 'interview', 'hired', 'rejected'].map(s => (
                      <button 
                        key={s}
                        onClick={() => {
                          const updated = {...selectedApp, status: s};
                          setSelectedApp(updated);
                        }}
                        className={`px-4 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          selectedApp.status === s ? 'bg-brand-deep text-white shadow-lg' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-2 pt-4">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">এডমিন নোট</label>
                    <textarea 
                      value={selectedApp.adminNote || ''}
                      onChange={e => setSelectedApp({...selectedApp, adminNote: e.target.value})}
                      placeholder="অ্যাডমিনের মন্তব্য লিখুন..."
                      className="w-full h-32 p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:border-brand-blue outline-none text-sm font-medium resize-none transition-all"
                    />
                  </div>

                  <button 
                    disabled={updating}
                    onClick={async () => {
                      setUpdating(true);
                      try {
                        await onUpdateStatus(selectedApp.id, selectedApp.status, selectedApp.adminNote || '');
                        await refreshData();
                        setSelectedApp(null);
                        alert('আবেদনটি সফলভাবে আপডেট করা হয়েছে!');
                      } catch (err) {
                        alert('আপডেট করতে সমস্যা হয়েছে।');
                      } finally {
                        setUpdating(false);
                      }
                    }}
                    className="w-full bg-brand-deep hover:bg-brand-blue text-white py-4 rounded-2xl font-display font-bold transition-all shadow-xl shadow-brand-deep/20 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle2 className="w-5 h-5" /> সেভ করুন</>}
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxUrl && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setLightboxUrl(null)}
              className="absolute inset-0 bg-black/95 backdrop-blur-sm"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-5xl w-full h-full flex flex-col items-center justify-center"
            >
              <button 
                onClick={() => setLightboxUrl(null)}
                className="absolute top-0 right-0 p-4 text-white hover:text-brand-glow transition-colors z-10"
              >
                <X className="w-10 h-10" />
              </button>
              <img 
                src={lightboxUrl} 
                alt="Full View" 
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl shadow-brand-glow/10" 
              />
              <a 
                href={lightboxUrl} 
                target="_blank" 
                rel="noreferrer"
                className="mt-6 px-8 py-3 bg-white/10 hover:bg-white/20 text-white rounded-full font-bold text-sm backdrop-blur-md border border-white/20 flex items-center gap-2 transition-all"
              >
                ডাউনলোড / হাই কোয়ালিটি ভিউ <ArrowLeft className="w-4 h-4 rotate-180" />
              </a>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProcessSection = () => (
  <section className="px-6 py-24 bg-white overflow-hidden">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="font-display text-4xl font-extrabold text-brand-deep mb-4 tracking-tight">কিভাবে শুরু করবেন?</h2>
        <p className="text-slate-500 font-medium max-w-xl mx-auto">আমাদের নিয়োগ প্রক্রিয়া অত্যন্ত স্বচ্ছ এবং সহজ। মাত্র ৪টি পদক্ষেপে যোগ দিন আমাদের টিমে।</p>
      </div>

      <div className="grid md:grid-cols-4 gap-8 relative">
        <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-slate-100 -z-10" />
        {[
          { icon: FileText, title: 'আবেদন করুন', desc: 'আপনার বিস্তারিত তথ্য এবং প্রয়োজনীয় ডকুমেন্ট দিয়ে ফর্মটি পূরণ করুন।' },
          { icon: Search, title: 'বাছাই প্রক্রিয়া', desc: 'আমাদের টিম আপনার তথ্য যাচাই করবে এবং যোগ্য হলে ইন্টারভিউয়ের জন্য ডাকবে।' },
          { icon: MessageCircle, title: 'ইন্টারভিউ', desc: 'অনলাইন বা অফলাইন ইন্টারভিউয়ের মাধ্যমে আপনার দক্ষতা যাচাই করা হবে।' },
          { icon: CheckCircle2, title: 'নিয়োগ সম্পন্ন', desc: 'ইন্টারভিউ সফল হলে আপনি আমাদের টিমে আনুষ্ঠানিকভাবে যোগ দেবেন।' },
        ].map((step, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="flex flex-col items-center text-center group"
          >
            <div className="w-16 h-16 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center text-brand-blue mb-6 group-hover:bg-brand-blue group-hover:text-white transition-all group-hover:rotate-6 group-hover:scale-110 shadow-sm">
              <step.icon className="w-8 h-8" />
            </div>
            <h4 className="font-display font-bold text-lg text-brand-deep mb-3 uppercase tracking-tight">{step.title}</h4>
            <p className="text-sm text-slate-500 leading-relaxed px-4">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

const ValuesSection = () => (
  <section className="px-6 py-24 bg-slate-50">
    <div className="max-w-7xl mx-auto">
      <div className="grid lg:grid-cols-3 gap-12">
        {[{ icon: Star, title: 'উৎকর্ষতা', desc: 'আমরা আমাদের প্রতিটি কাজে সর্বোচ্চ মান বজায় রাখতে প্রতিশ্রুতিবদ্ধ।' }, { icon: ShieldCheck, title: 'স্বচ্ছতা', desc: 'সকল নিয়োগ প্রক্রিয়া উন্মুক্ত এবং পক্ষপাতহীনভাবে সম্পন্ন করা হয়।' }, { icon: TrendingUp, title: 'প্রবৃদ্ধি', desc: 'আমরা আমাদের প্রতিটি সদস্যের ক্যারিয়ার এবং ব্যক্তিগত গ্রোথে বিশ্বাসী।' }].map((v, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="p-10 rounded-[40px] bg-white border border-slate-100 shadow-sm hover:shadow-xl transition-all"
          >
            <div className="w-14 h-14 rounded-2xl bg-brand-blue/5 flex items-center justify-center text-brand-blue mb-8">
              <v.icon className="w-7 h-7" />
            </div>
            <h4 className="font-display font-black text-2xl text-brand-deep mb-4">{v.title}</h4>
            <p className="text-slate-500 leading-relaxed font-medium">{v.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default function App() {
  const [view, setView] = useState<'home' | 'form' | 'status' | 'admin'>('home');
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<ApplicationData>(initialData);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState<{displayId: string, password: string} | null>(null);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});
  const [previews, setPreviews] = useState<Record<string, string>>({});
  
  // Status View States
  const [searchId, setSearchId] = useState('');
  const [searchPass, setSearchPass] = useState('');
  const [currentApp, setCurrentApp] = useState<ApplicationStatus | null>(null);
  const [searchLoading, setSearchLoading] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // Global Data
  const [stats, setStats] = useState<{ cs_admin_vacancies: number, va_vacancies: number, hired_count: number } | null>(null);
  const [recentApplicants, setRecentApplicants] = useState<any[]>([]);

  // Admin View States
  const [adminNote, setAdminNote] = useState('');
  const [adminStatus, setAdminStatus] = useState('');

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const fetchGlobalData = async () => {
      try {
        const [s, r] = await Promise.all([getStats(), getRecentApplications(10)]);
        setStats(s);
        setRecentApplicants(r);
      } catch (err) {
        console.error('Error fetching global stats:', err);
      }
    };

    if (view === 'home') {
      fetchGlobalData();
    }
  }, [view, step]);

  const updateField = (field: keyof ApplicationData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formError) setFormError(null);
  };

  const handleNext = (e?: MouseEvent) => {
    e?.preventDefault();
    setFormError(null);

    // Per-step Validation
    if (step === 1) {
      if (!formData.fullName || formData.fullName.length < 3) {
        setFormError('দয়া করে আপনার পুরো নাম সঠিকভাবে লিখুন।');
        return;
      }
      if (!formData.dob) {
        setFormError('আপনার জন্ম তারিখ প্রদান করুন।');
        return;
      }
      if (!formData.email || !formData.email.includes('@')) {
        setFormError('সঠিক ইমেইল অ্যাড্রেস প্রদান করুন।');
        return;
      }
      if (!formData.phone || formData.phone.length < 11) {
        setFormError('সঠিক ১১ ডিজিটের মোবাইল নম্বর প্রদান করুন।');
        return;
      }
    }

    if (step === 2) {
      if (!formData.position) {
        setFormError('দয়া করে একটি পদ নির্বাচন করুন।');
        return;
      }
      if (!formData.experience) {
        setFormError('আপনার অভিজ্ঞতার স্তর নির্বাচন করুন।');
        return;
      }
    }

    if (step === 3) {
      if (formData.englishRating === 0) {
        setFormError('দয়া করে আপনার ইংরেজি দক্ষতা রেট করুন।');
        return;
      }
      if (!formData.salaryExpectation) {
        setFormError('প্রত্যাশিত বেতন সীমা নির্বাচন করুন।');
        return;
      }
    }

    if (step < 4) setStep(prev => (prev + 1) as Step);
  };

  const handleBack = (e?: MouseEvent) => {
    e?.preventDefault();
    if (step > 1) setStep(prev => (prev - 1) as Step);
    else {
      resetForm();
      setView('home');
    }
  };

  const resetForm = () => {
    setFormData(initialData);
    setStep(1);
    setSubmitted(false);
    setSubmissionResult(null);
    setPreviews({});
    setUploadProgress({});
    setSearchId('');
    setSearchPass('');
    setSearchError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);
    if (step < 4) return;
    
    // Final Validation
    if (Object.keys(formData.imageUrls).length < 1) {
      setFormError('দয়া করে অন্তত একটি ডকুমেন্টস (সিভি বা পরিচয়পত্র) আপলোড করুন।');
      return;
    }

    if (!formData.agree) {
      setFormError('আপনাকে অবশ্যই শর্তাবলীতে একমত হতে হবে।');
      return;
    }

    setSubmitting(true);
    // Simulating a professional processing delay
    await new Promise(r => setTimeout(r, 2000));
    
    try {
      const result = await submitApplication(formData);
      setSubmissionResult({ displayId: result.displayId, password: result.password });
      setSubmitting(false);
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      setFormError('আবেদন জমা দেওয়ায় সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      setSubmitting(false);
    }
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchId) return;

    setSearchLoading(true);
    setSearchError(null);
    try {
      // Secret Admin Entry: ID "admin" + Pass "admin2026"
      if (searchId.toLowerCase() === 'admin' && searchPass === 'admin2026') {
        setView('admin');
        return;
      }

      console.log(`[App] Searching for displayId: ${searchId}`);
      const app = await getApplicationByDisplayId(searchId, searchPass);
      if (app) {
        setCurrentApp(app);
        setAdminStatus(app.status);
        setAdminNote(app.adminNote || '');
        setView('status');
      } else {
        setSearchError('ভুল আইডি বা পাসওয়ার্ড। দয়া করে পুনরায় চেক করুন।');
      }
    } catch (error: any) {
      setSearchError(error.message || 'অনুসন্ধানে সমস্যা হয়েছে।');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleAdminUpdate = async () => {
    if (!currentApp) return;
    setSubmitting(true);
    try {
      await updateApplicationStatus(currentApp.id, adminStatus, adminNote);
      alert('স্ট্যাটাস আপডেট সফল হয়েছে!');
      const updated = await getApplicationByDisplayId(currentApp.displayId);
      setCurrentApp(updated);
    } catch (error) {
      alert('আপডেট করা সম্ভব হয়নি।');
    } finally {
      setSubmitting(false);
    }
  };

  const handleFileUpload = async (file: File, label: string) => {
    try {
      console.log(`[App] Uploading ${label}...`);
      
      // Generate Preview
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setPreviews(prev => ({ ...prev, [label]: url }));
      }

      setUploadProgress(prev => ({ ...prev, [label]: 1 }));
      
      const url = await uploadToImageKit(file, (progress) => {
        setUploadProgress(prev => ({ ...prev, [label]: progress }));
      });
      
      updateField('imageUrls', { ...formData.imageUrls, [label]: url });
      setUploadProgress(prev => ({ ...prev, [label]: 100 }));
      console.log(`[App] ${label} upload complete!`);
    } catch (error) {
      console.error(`[App] ${label} upload failed:`, error);
      const errorMessage = error instanceof Error ? error.message : 'ফাইল আপলোড ব্যর্থ হয়েছে।';
      alert(`ফাইল আপলোড ব্যর্থ হয়েছে: ${errorMessage}`);
      setUploadProgress(prev => {
        const next = { ...prev };
        delete next[label];
        return next;
      });
    }
  };

  // Admin Data
  const [allApplications, setAllApplications] = useState<any[]>([]);

  const refreshAdminData = async () => {
    try {
      const fb = await import('./lib/firebase');
      const [r, s] = await Promise.all([fb.getRecentApplications(100), fb.getStats()]);
      setAllApplications(r);
      setStats(s);
    } catch (err) {
      console.error('Admin data fetch failed:', err);
    }
  };

  useEffect(() => {
    if (view === 'admin') {
      refreshAdminData();
    }
  }, [view]);

  if (view === 'admin') {
    return (
      <AdminDashboard 
        applicants={allApplications}
        stats={stats}
        onClose={() => setView('home')}
        onUpdateStatus={updateApplicationStatus}
        onUpdateStats={updateStats}
        refreshData={refreshAdminData}
      />
    );
  }

  if (view === 'home') {
    return (
      <div className="bg-slate-50 min-h-screen overflow-y-auto overflow-x-hidden">
        <Navbar 
          onApply={() => { resetForm(); setView('form'); }} 
          onHistory={() => {
            const h = document.getElementById('search-section');
            h?.scrollIntoView({ behavior: 'smooth' });
          }} 
        />
        <Hero 
          onApply={() => { resetForm(); setView('form'); }} 
          onSearch={(id, pass) => {
            setSearchId(id);
            setSearchPass(pass);
            handleSearch({ preventDefault: () => {} } as any);
          }}
          searchError={searchError}
          searchLoading={searchLoading}
          recentApplicants={recentApplicants}
          stats={stats}
        />

        <ProcessSection />

        <section id="search-section" className="px-6 py-10 bg-slate-50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto flex flex-col items-center">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-10">Trusted Operations for Global Brands</p>
            <div className="flex flex-wrap justify-center gap-4 lg:gap-8 opacity-40">
              {BRANDS.map((b, i) => (
                <Brand key={i} logo={b.l} name={b.n} color={b.c} />
              ))}
            </div>
          </div>
        </section>

        <TrustSection />
        
        <ValuesSection />
        
        {/* Professional CTA Section */}
        <section className="px-6 py-24 bg-white">
           <motion.div 
             initial={{ opacity: 0, y: 30 }}
             whileInView={{ opacity: 1, y: 0 }}
             viewport={{ once: true }}
             className="max-w-5xl mx-auto bg-brand-deep rounded-[60px] p-12 lg:p-24 text-center text-white relative overflow-hidden shadow-3xl"
           >
              <div className="absolute inset-0 bg-linear-to-br from-brand-blue/20 to-transparent pointer-events-none" />
              <h2 className="font-display text-4xl lg:text-7xl font-black mb-8 tracking-tighter leading-tight relative z-10">আপনার ক্যারিয়ারের পরবর্তী <br /> ধাপ আজই শুরু করুন</h2>
              <p className="text-slate-400 text-lg lg:text-xl mb-12 max-w-2xl mx-auto relative z-10 font-medium">আমরা আপনার মেধা এবং আগ্রহের অপেক্ষায় আছি। এখনই আবেদন করুন এবং ShopVerse টিমের অংশ হন।</p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => { resetForm(); setView('form'); }}
                className="relative z-10 bg-white text-brand-deep px-12 py-6 rounded-3xl font-display font-black text-xl hover:bg-brand-glow hover:text-white transition-all shadow-2xl"
              >
                🚀 আবেদন চালু করুন
              </motion.button>
           </motion.div>
        </section>

        <footer className="px-6 py-24 border-t border-slate-100 bg-white">
           <div className="max-w-7xl mx-auto grid lg:grid-cols-4 gap-16">
              <div className="lg:col-span-2 space-y-10">
                 <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-brand-blue flex items-center justify-center shadow-xl shadow-brand-blue/20">
                       <ShoppingBag className="text-white w-7 h-7" />
                    </div>
                    <span className="font-display font-black text-3xl tracking-tighter text-brand-deep">ShopVerse</span>
                 </div>
                 <p className="text-slate-500 max-w-md text-lg leading-relaxed font-medium">ShopVerse একটি আধুনিক ই-commerce সমাধান। আমাদের মিশন হলো প্রযুক্তি এবং দক্ষ জনশক্তির সমন্বয়ে সেরা কাস্টমার এক্সপেরিয়েন্স নিশ্চিত করা।</p>
                 <div className="flex gap-4">
                    {[Mail, Phone, Globe].map((Icon, i) => (
                       <div key={i} className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-400 hover:text-brand-blue hover:bg-brand-blue/5 transition-all cursor-pointer border border-slate-100">
                          <Icon className="w-5 h-5" />
                       </div>
                    ))}
                 </div>
              </div>
              <div className="space-y-8">
                 <h5 className="font-bold text-brand-deep uppercase tracking-widest text-xs">জরুরি লিংক</h5>
                 <ul className="space-y-5">
                    {['আমাদের সম্পর্কে', 'ক্যারিয়ার ডেস্ক', 'গোপনীয়তা নীতি', 'শর্তাবলী', 'সাপোর্ট পোর্টাল'].map((l, i) => (
                       <li key={i} className="text-slate-500 hover:text-brand-blue cursor-pointer transition-colors font-bold text-sm">{l}</li>
                    ))}
                 </ul>
              </div>
              <div className="space-y-8">
                 <h5 className="font-bold text-brand-deep uppercase tracking-widest text-xs">অফিস ঠিকানা</h5>
                 <p className="text-slate-500 text-sm leading-relaxed font-bold">লেভেল ৪, শপভার্স টাওয়ার, <br />বনানী ঢাকা - ১২১৩, বাংলাদেশ</p>
                 <div className="pt-4 border-t border-slate-100">
                    <p className="text-brand-blue font-bold text-sm">support@shopverse.com</p>
                    <p className="text-slate-400 text-[10px] font-bold mt-1 uppercase tracking-widest">২৪/৭ ইমেইল সাপোর্ট</p>
                 </div>
              </div>
           </div>
           <div className="max-w-7xl mx-auto pt-16 mt-16 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8">
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">© ২০২৬ ShopVerse Operations. All Rights Reserved.</p>
              <div className="flex gap-8">
                 <p className="text-slate-300 text-xs font-bold uppercase tracking-widest">Security Verified</p>
                 <p className="text-slate-300 text-xs font-bold uppercase tracking-widest">Safe Portal</p>
              </div>
           </div>
        </footer>
      </div>
    );
  }

  // --- FORM VIEW ---

  return (
    <div className="bg-slate-50 min-h-screen py-10 px-6 overflow-y-auto">
      <div className="max-w-3xl mx-auto">
        <button 
          onClick={handleBack}
          className="flex items-center gap-2 text-slate-500 hover:text-brand-blue transition-colors mb-10 font-bold text-sm tracking-tight"
        >
          <ArrowLeft className="w-4 h-4" /> হোমে ফিরে যান
        </button>

        {!submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[32px] shadow-premium p-8 lg:p-12 border border-slate-100 relative overflow-hidden"
          >
            {submitting && (
              <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-50 flex flex-col items-center justify-center gap-4">
                <div className="w-12 h-12 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
                <p className="font-display font-bold text-brand-deep">আবেদন জমা দেওয়া হচ্ছে...</p>
              </div>
            )}

            <div className="text-center mb-12">
              <h2 className="font-display text-3xl font-extrabold text-brand-deep mb-2">আমাদের টিমে যোগ দিন</h2>
              <p className="text-slate-400 text-sm">নিচের আবেদনটি সম্পন্ন করুন — এটি করতে প্রায় ৫ মিনিট সময় লাগবে।</p>
            </div>

            <Progress step={step} />

            <form onSubmit={handleSubmit} noValidate className="space-y-10">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="step1"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-6"
                  >
                    <div className="grid md:grid-cols-2 gap-6">
                      <Field label="আপনার পুরো নাম (Full Name)" required>
                        <input 
                          type="text" 
                          placeholder="উদা: আবদুল্লাহ আল মামুন"
                          value={formData.fullName}
                          onChange={e => updateField('fullName', e.target.value)}
                          className="w-full px-5 py-3.5 lg:px-6 lg:py-4 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-brand-blue outline-none transition-all text-sm lg:text-base"
                        />
                      </Field>
                      <Field label="জন্ম তারিখ (Date of Birth)" required>
                        <input 
                          type="date" 
                          value={formData.dob}
                          onChange={e => updateField('dob', e.target.value)}
                          className="w-full px-5 py-3.5 lg:px-6 lg:py-4 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-brand-blue outline-none transition-all text-sm lg:text-base"
                        />
                      </Field>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <Field label="ইমেইল অ্যাড্রেস (Email Address)" required>
                        <input 
                          type="email" 
                          placeholder="name@example.com"
                          value={formData.email}
                          onChange={e => updateField('email', e.target.value)}
                          className="w-full px-5 py-3.5 lg:px-6 lg:py-4 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-brand-blue outline-none transition-all text-sm lg:text-base"
                        />
                      </Field>
                      <Field label="মোবাইল নম্বর (Phone Number)" required>
                        <input 
                          type="tel" 
                          placeholder="01XXX-XXXXXX"
                          value={formData.phone}
                          onChange={e => updateField('phone', e.target.value)}
                          className="w-full px-5 py-3.5 lg:px-6 lg:py-4 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-brand-blue outline-none transition-all text-sm lg:text-base"
                        />
                      </Field>
                    </div>
                    <div className="grid md:grid-cols-2 gap-6">
                      <Field label="শহর (City)">
                        <input 
                          type="text" 
                          placeholder="ঢাকা / চট্টগ্রাম..."
                          value={formData.city}
                          onChange={e => updateField('city', e.target.value)}
                          className="w-full px-5 py-3.5 lg:px-6 lg:py-4 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-brand-blue outline-none transition-all text-sm lg:text-base"
                        />
                      </Field>
                      <Field label="লিঙ্গ (Gender)">
                        <select 
                          value={formData.gender}
                          onChange={e => updateField('gender', e.target.value)}
                          className="w-full px-6 py-4 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-brand-blue outline-none transition-all appearance-none"
                        >
                          <option value="">লিঙ্গ নির্বাচন করুন</option>
                          <option value="male">পুরুষ</option>
                          <option value="female">মহিলা</option>
                          <option value="other">অন্যান্য</option>
                        </select>
                      </Field>
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="step2"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <Field label="যে পদের জন্য আবেদন করছেন" required>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {[
                          { id: 'cs_admin', label: 'CS অ্যাডমিন', icon: Mail },
                          { id: 'va', label: 'ভার্চুয়াল অ্যাসিস্ট্যান্ট', icon: Globe },
                        ].map(pos => (
                          <button
                            key={pos.id}
                            type="button"
                            onClick={() => updateField('position', pos.id)}
                            className={`flex items-center gap-4 p-5 rounded-2xl border-2 transition-all ${
                              formData.position === pos.id 
                                ? 'border-brand-blue bg-brand-blue/5 text-brand-blue' 
                                : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-brand-blue/20'
                            }`}
                          >
                            <pos.icon className="w-6 h-6" />
                            <span className="font-bold">{pos.label}</span>
                          </button>
                        ))}
                      </div>
                    </Field>
                    
                    <div className="grid md:grid-cols-2 gap-6">
                      <Field label="অভিজ্ঞতার স্তর" required>
                        <select 
                          value={formData.experience}
                          onChange={e => updateField('experience', e.target.value)}
                          className="w-full px-6 py-4 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-brand-blue outline-none transition-all"
                        >
                          <option value="">অভিজ্ঞতা নির্বাচন করুন</option>
                          <option value="fresher">ফ্রেশার (০-৬ মাস)</option>
                          <option value="junior">জুনিয়র (৬ মাস - ১ বছর)</option>
                          <option value="mid">মিড (১-৩ বছর)</option>
                          <option value="senior">সিনিয়র (৩+ বছর)</option>
                        </select>
                      </Field>
                      <Field label="দৈনিক কত সময় দিতে পারবেন?">
                        <div className="px-2 pt-4">
                          <input 
                            type="range" 
                            min="1" 
                            max="12" 
                            value={formData.hoursPerDay}
                            onChange={e => updateField('hoursPerDay', parseInt(e.target.value))}
                            className="w-full accent-brand-blue h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-[10px] font-bold text-slate-400 mt-2 uppercase tracking-widest">
                            <span>১ ঘণ্টা</span>
                            <span className="text-brand-blue font-black">{formData.hoursPerDay} ঘণ্টা / দিন</span>
                            <span>১২ ঘণ্টা</span>
                          </div>
                        </div>
                      </Field>
                    </div>

                    <Field label="নিজের সম্পর্কে কিছু বলুন (Self Bio)">
                      <textarea 
                        rows={4}
                        placeholder="আপনার অভিজ্ঞতা ও কেন আপনি এই পদের জন্য যোগ্য তা লিখুন..."
                        value={formData.bio}
                        onChange={e => updateField('bio', e.target.value)}
                        className="w-full px-6 py-4 rounded-xl border border-slate-100 bg-slate-50 focus:bg-white focus:border-brand-blue outline-none transition-all resize-none"
                      />
                    </Field>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="step3"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <Field label="যেসব ই-কমার্স প্ল্যাটফর্ম আপনি জানেন">
                      <div className="flex flex-wrap gap-2">
                        {['Shopify', 'WooCommerce', 'Daraz', 'Facebook Shop', 'Instagram', 'Amazon'].map(it => (
                          <Tag 
                            key={it} 
                            label={it} 
                            active={formData.platforms.includes(it)}
                            onClick={() => {
                              const next = formData.platforms.includes(it) 
                                ? formData.platforms.filter(x => x !== it)
                                : [...formData.platforms, it];
                              updateField('platforms', next);
                            }}
                          />
                        ))}
                      </div>
                    </Field>

                    <Field label="আপনার প্রধান দক্ষতাসমূহ">
                      <div className="flex flex-wrap gap-2">
                        {['Customer Chat', 'Order Management', 'Product Listing', 'Meta Business', 'Excel/Sheets', 'Returns/Refunds'].map(it => (
                          <Tag 
                            key={it} 
                            label={it} 
                            active={formData.skills.includes(it)}
                            onClick={() => {
                              const next = formData.skills.includes(it) 
                                ? formData.skills.filter(x => x !== it)
                                : [...formData.skills, it];
                              updateField('skills', next);
                            }}
                          />
                        ))}
                      </div>
                    </Field>

                    <Field label="ইংরেজি ভাষায় দক্ষতা" required>
                      <div className="flex flex-col items-center gap-4 py-4 rounded-2xl bg-slate-50 border border-slate-100">
                        <div className="flex gap-2">
                          {[1,2,3,4,5].map(i => (
                            <button
                              key={i}
                              type="button"
                              onClick={() => updateField('englishRating', i)}
                              className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                                formData.englishRating >= i ? 'bg-amber-400 text-white shadow-lg' : 'bg-white text-slate-200'
                              }`}
                            >
                              <Star className={`w-6 h-6 ${formData.englishRating >= i ? 'fill-current' : ''}`} />
                            </button>
                          ))}
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                          {formData.englishRating === 0 ? 'আপনার দক্ষতা রেট করুন' : 
                           formData.englishRating === 5 ? 'পেশাদার পর্যায়ে দক্ষতা' : 
                           formData.englishRating > 3 ? 'চমৎকার' : 'কথোপকথনযোগ্য'}
                        </p>
                      </div>
                    </Field>

                    <Field label="প্রত্যাশিত মাসিক বেতন (টাকায়)" required>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        {['৮,০০০–১২,০০০', '১২,০০০–২০,০০০', '২০,০০০+'].map(val => (
                          <button
                            key={val}
                            type="button"
                            onClick={() => updateField('salaryExpectation', val)}
                            className={`p-4 rounded-xl border-2 font-bold transition-all ${
                              formData.salaryExpectation === val
                                ? 'border-brand-blue bg-brand-blue/5 text-brand-blue shadow-md'
                                : 'border-slate-100 text-slate-400'
                            }`}
                          >
                            ৳ {val}
                          </button>
                        ))}
                      </div>
                    </Field>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="step4"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="space-y-8"
                  >
                    <div className="p-6 bg-brand-blue/5 border border-brand-blue/10 rounded-2xl flex gap-4">
                      <AlertCircle className="w-6 h-6 text-brand-blue flex-shrink-0" />
                      <p className="text-xs text-slate-600 leading-relaxed">
                        আপনার সিভি এবং পরিচয়পত্রের ছবি অ্যাপ্লিকেশানকে আরও শক্তিশালী করবে। প্রতিটি ফাইল সর্বোচ্চ ৫ মেগাবাইট হতে পারবে।
                      </p>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                      <UploadBox 
                        label="প্রোফাইল ফটো" 
                        icon={Camera} 
                        onFileSelect={(file) => handleFileUpload(file, 'photo')}
                        isUploaded={!!formData.imageUrls.photo}
                        progress={uploadProgress['photo']}
                        previewUrl={previews['photo']}
                      />
                      <UploadBox 
                        label="সিভি/রেজুমে" 
                        icon={FileText} 
                        onFileSelect={(file) => handleFileUpload(file, 'cv')}
                        isUploaded={!!formData.imageUrls.cv}
                        progress={uploadProgress['cv']}
                        previewUrl={previews['cv']}
                      />
                      <UploadBox 
                        label="জাতীয় পরিচয়পত্র" 
                        icon={ShieldCheck} 
                        onFileSelect={(file) => handleFileUpload(file, 'nid')}
                        isUploaded={!!formData.imageUrls.nid}
                        progress={uploadProgress['nid']}
                        previewUrl={previews['nid']}
                      />
                    </div>

                    <Field label="সোশ্যাল প্রোফাইল (ফেসবুক/লিঙ্কডইন)">
                      <input 
                        type="url" 
                        placeholder="https://facebook.com/..."
                        value={formData.facebookLink}
                        onChange={e => updateField('facebookLink', e.target.value)}
                        className="w-full px-6 py-4 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:bg-white focus:border-brand-blue transition-all"
                      />
                    </Field>

                    <label className="flex items-start gap-4 p-6 rounded-2xl bg-slate-50 border border-slate-100 cursor-pointer group">
                      <div 
                        onClick={() => updateField('agree', !formData.agree)}
                        className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                          formData.agree ? 'bg-brand-blue border-brand-blue text-white' : 'bg-white border-slate-200'
                        }`}
                      >
                        {formData.agree && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <span className="text-xs text-slate-500 font-medium leading-relaxed">
                        আমি নিশ্চিত করছি যে প্রকাশিত সকল তথ্য সঠিক এবং আমি ShopVerse-এর গোপনীয়তা নীতির সাথে একমত।
                      </span>
                    </label>
                  </motion.div>
                )}
              </AnimatePresence>

              {formError && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3"
                >
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
                  <p className="text-sm font-bold text-red-600">{formError}</p>
                </motion.div>
              )}

              <div className="flex flex-col sm:flex-row gap-4 pt-10 border-t border-slate-50">
                <button 
                  type="button"
                  onClick={(e) => handleBack(e)}
                  className="w-full sm:flex-1 px-8 py-4 lg:py-5 rounded-2xl border-2 border-slate-100 text-slate-400 font-display font-bold hover:bg-slate-50 transition-colors"
                >
                  {step === 1 ? 'বাতিল' : 'পেছনে'}
                </button>
                {step < 4 ? (
                  <button 
                    type="button"
                    onClick={(e) => handleNext(e)}
                    className="w-full sm:flex-[2] bg-brand-deep text-white px-8 py-4 lg:py-5 rounded-2xl font-display font-bold text-lg hover:bg-brand-blue transition-colors shadow-xl shadow-brand-blue/20"
                  >
                    চালিয়ে যান
                  </button>
                ) : (
                  <button 
                    type="submit"
                    disabled={!formData.agree || submitting}
                    className="w-full sm:flex-[2] bg-brand-blue text-white px-8 py-4 lg:py-5 rounded-2xl font-display font-bold text-lg hover:bg-brand-glow transition-all shadow-xl shadow-brand-blue/30 disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
                  >
                    আবেদন জমা দিন
                  </button>
                )}
              </div>
            </form>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-[40px] shadow-premium p-10 lg:p-16 text-center border border-slate-50"
          >
            <div className="w-20 h-20 rounded-full bg-emerald-50 text-emerald-500 flex items-center justify-center mx-auto mb-8 border-4 border-white shadow-xl">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <h2 className="font-display text-3xl font-extrabold text-brand-deep mb-4 tracking-tight leading-tight">আবেদন সফলভাবে গ্রহণ করা হয়েছে!</h2>
            <p className="text-slate-500 text-sm lg:text-base mb-10 max-w-lg mx-auto leading-relaxed">
              ধন্যবাদ! আপনার আবেদনটি আমাদের সার্ভারে জমা হয়েছে। আমাদের <span className="font-bold text-brand-blue">HR রিক্রুটমেন্ট টিম</span> আপনার অভিজ্ঞতা এবং তথ্যাদি গুরুত্ব সহকারে পর্যালোচনা করবে। সাধারণত ৩-৫ কার্যদিবসের মধ্যে পরবর্তী ধাপ সম্পর্কে জানানো হয়।
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col items-center group hover:border-brand-blue/30 transition-all">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">আবেদন আইডি (Application ID)</span>
                <span className="font-mono font-bold text-brand-blue text-2xl tracking-tighter">
                  {submissionResult?.displayId || 'SV-XXX-XXX'}
                </span>
              </div>
              <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col items-center group hover:border-brand-glow/30 transition-all">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">সিকিউরিটি পাসওয়ার্ড (Password)</span>
                <span className="font-mono font-bold text-brand-glow text-2xl tracking-[0.2em] bg-brand-deep px-6 py-2 rounded-xl">
                  {submissionResult?.password || 'XXXXXX'}
                </span>
              </div>
            </div>

            <div className="p-6 rounded-3xl bg-linear-to-br from-amber-50 to-orange-50 border border-amber-100 flex gap-4 text-left mb-10 shadow-sm">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm flex-shrink-0">
                <Lock className="w-6 h-6 text-amber-500" />
              </div>
              <div>
                <h4 className="text-sm font-black text-amber-900 mb-1">পাসওয়ার্ডটি অবশ্যই সংরক্ষণ করুন!</h4>
                <p className="text-[11px] text-amber-800 font-medium leading-relaxed">
                  আপনার আবেদনের অবস্থা (Pending, Approved, বা Rejected) জানতে এই আইডি এবং পাসওয়ার্ডটি অত্যন্ত জরুরি। হোমপেজের <span className="underline">"হিস্টোরি"</span> সেকশনে গিয়ে আপনি যেকোনো সময় আপনার আবেদনের বর্তমান আপডেট দেখতে পারবেন।
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => { resetForm(); setView('home'); }}
                className="flex-1 bg-brand-deep text-white px-10 py-5 rounded-2xl font-display font-black tracking-tight hover:bg-brand-blue transition-all active:scale-95 shadow-xl shadow-brand-deep/20"
              >
                হোমে ফিরে যান
              </button>
            </div>
          </motion.div>
        )}
      </div>

      {/* STATUS VIEW MODAL */}
      <AnimatePresence>
        {view === 'status' && currentApp && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-deep/80 backdrop-blur-xl"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-white w-full max-w-lg rounded-[40px] shadow-2xl p-8 lg:p-12 relative overflow-hidden"
            >
              <button 
                onClick={() => setView('home')}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors"
              >
                <AlertCircle className="w-5 h-5 rotate-45 text-slate-400" />
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-brand-blue/10 flex items-center justify-center text-brand-blue">
                  <FileSearch className="w-7 h-7" />
                </div>
                <div>
                  <h3 className="font-display font-black text-2xl text-brand-deep leading-none mb-1">আবেদনের তথ্য</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest italic">{currentApp.displayId}</p>
                </div>
              </div>

              <div className="space-y-6 mb-10">
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-100">
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">আবেদনকারী</p>
                      <p className="text-sm font-bold text-brand-deep">{currentApp.fullName}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">পদ</p>
                      <p className="text-sm font-bold text-brand-deep">{currentApp.position === 'cs_admin' ? 'CS অ্যাডমিন' : 'ভার্চুয়াল অ্যাসিস্ট্যান্ট'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">যোগাযোগ</p>
                      <p className="text-xs font-bold text-slate-600">{(currentApp as any).phone || 'N/A'}</p>
                    </div>
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-1">জমা দেওয়ার তারিখ</p>
                      <p className="text-xs font-bold text-slate-600">
                        {currentApp.submittedAt?.toDate ? currentApp.submittedAt.toDate().toLocaleDateString('bn-BD') : 'অজানা'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-6 border-t border-slate-200">
                    <div>
                      <p className="text-[10px] font-black text-slate-400 uppercase mb-2">বর্তমান অবস্থা (Status)</p>
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-wider ${
                        currentApp.status === 'approved' || currentApp.status === 'hired' ? 'bg-emerald-100 text-emerald-600' :
                        currentApp.status === 'rejected' ? 'bg-red-100 text-red-600' :
                        currentApp.status === 'interview' ? 'bg-brand-blue/10 text-brand-blue' :
                        'bg-amber-100 text-amber-600'
                      }`}>
                        <div className={`w-2 h-2 rounded-full animate-pulse ${
                          currentApp.status === 'approved' || currentApp.status === 'hired' ? 'bg-emerald-500' :
                          currentApp.status === 'rejected' ? 'bg-red-500' :
                          currentApp.status === 'interview' ? 'bg-brand-blue' :
                          'bg-amber-500'
                        }`} />
                        {currentApp.status === 'approved' || currentApp.status === 'hired' ? 'গৃহীত (Approved/Hired)' :
                         currentApp.status === 'rejected' ? 'বাতিল (Rejected)' :
                         currentApp.status === 'interview' ? 'ইন্টারভিউ (Interview)' :
                         'বিবেচনাধীন (Pending)'}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-6 rounded-3xl bg-brand-deep text-white shadow-xl shadow-brand-deep/20 relative overflow-hidden group">
                   <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                     <MessageCircle className="w-20 h-20" />
                   </div>
                   <h5 className="text-[10px] font-black uppercase tracking-[0.2em] opacity-50 mb-3 italic">অ্যাডমিন রেসপন্স</h5>
                   <p className="text-sm font-medium leading-relaxed italic">
                     {currentApp.adminNote || 'আপনার আবেদনটি বর্তমানে আমাদের নিয়োগকারী দল যাচাই করছে। দয়া করে ধৈর্য ধরুন।'}
                   </p>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={() => setView('home')}
                  className="flex-1 bg-brand-deep text-white py-4 rounded-2xl font-bold hover:bg-brand-blue transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  বন্ধ করুন
                </button>
                <button 
                  onClick={() => { resetForm(); setView('home'); }}
                  className="flex-1 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95 flex items-center justify-center gap-2"
                >
                  <ArrowLeft className="w-4 h-4" /> মেইন মেনু
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Redundant Admin Logic Removed */}
      </AnimatePresence>
    </div>
  );
}

