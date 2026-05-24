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
  Camera
} from 'lucide-react';
import { 
  submitApplication, 
  uploadToImageKit, 
  getApplicationByDisplayId, 
  updateApplicationStatus,
  getStats,
  getRecentApplications
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
    
    // Rotate simulated names every 45 minutes (simulated)
    const interval = setInterval(() => {
      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomPos = positions[Math.floor(Math.random() * positions.length)];
      setSimulatedApplicants(prev => [{ n: randomName, t: 'এইমাত্র', p: randomPos, i: randomName.charAt(0) }, ...prev.slice(0, 2)]);
    }, 2700000); 

    return () => clearInterval(interval);
  }, []);

  // Merge real firestore applicants with simulated ones
  const displayedApplicants = [
    ...recentApplicants
      .filter(app => app.fullName || app.name || app.displayName) // Only show real ones if they have some name data
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
  ].slice(0, 3); // Keep only top 3

  return (
    <section className="relative px-6 py-12 lg:py-32 max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 lg:gap-16 items-center overflow-hidden">
      {/* Decorative Blobs */}
      <div className="absolute -top-24 -right-24 w-72 h-72 lg:w-96 lg:h-96 bg-brand-blue/5 rounded-full blur-3xl -z-10" />
      <div className="absolute top-1/2 -left-24 w-48 h-48 lg:w-64 lg:h-64 bg-brand-glow/5 rounded-full blur-3xl -z-10" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center lg:text-left order-1 lg:order-none"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-brand-blue/20 bg-brand-blue/5 text-brand-blue text-[10px] font-semibold tracking-widest uppercase mb-8">
          <span className="w-2 h-2 rounded-full bg-brand-blue animate-ping" />
          E-Commerce Operations Team
        </div>
        
        <h1 className="font-display text-[40px] sm:text-6xl lg:text-7xl font-extrabold text-brand-deep leading-[1.1] lg:leading-[0.9] tracking-tighter mb-8 italic">
          হয়ে উঠুন <br />
          <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-blue via-brand-glow to-brand-blue bg-[length:200%_auto] animate-gradient-x">ShopVerse</span> <br />
          অ্যাডমিন
        </h1>
        
        <p className="text-slate-600 text-lg lg:text-xl leading-relaxed mb-10 max-w-lg mx-auto lg:mx-0 text-balance font-medium">
          আমাদের প্রিমিয়াম ই-কমার্স প্ল্যাটফর্মে CS Admin বা Virtual Assistant হিসেবে যোগ দিন। রিমোট কাজ এবং গ্লোবাল ক্যারিয়ার গ্রোথ আমাদের সাথে।
        </p>
        
        <div className="bg-white/60 backdrop-blur-md p-6 rounded-3xl border border-white mb-10 max-w-md mx-auto lg:mx-0 shadow-2xl shadow-brand-blue/5 text-left">
          <div className="flex items-center gap-2 mb-4">
            <History className="w-4 h-4 text-brand-blue" />
            <h4 className="text-xs font-black text-brand-deep uppercase tracking-widest">হিষ্ট্রোরি চেক করুন</h4>
          </div>
          <form className="space-y-3" onSubmit={(e) => { e.preventDefault(); onSearch(sId, sPass); }}>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="আপনার আইডি (SV-XXXXXX-XXX)"
                value={sId}
                onChange={e => { setSId(e.target.value); }}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-100 bg-white/80 focus:bg-white focus:border-brand-blue outline-none transition-all text-sm font-bold"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="password" 
                placeholder="পাসওয়ার্ড (৬ সংখ্যা)"
                value={sPass}
                onChange={e => { setSPass(e.target.value); }}
                className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-100 bg-white/80 focus:bg-white focus:border-brand-blue outline-none transition-all text-sm font-bold"
              />
            </div>
            
            {searchError && (
              <motion.div 
                initial={{ x: -10, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex items-start gap-2 p-3 rounded-xl bg-red-50 border border-red-100 mb-2"
              >
                <AlertCircle className="w-3.5 h-3.5 text-red-500 mt-0.5 flex-shrink-0" />
                <p className="text-[10px] text-red-600 font-bold leading-tight">{searchError}</p>
              </motion.div>
            )}

            <button 
              type="submit"
              disabled={searchLoading}
              className="w-full bg-brand-deep text-white py-3 rounded-xl font-bold hover:bg-brand-blue transition-all active:scale-95 shadow-lg shadow-brand-deep/10 text-sm flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {searchLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'আবেদন দেখুন'}
            </button>
          </form>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <button 
            onClick={onApply}
            className="group relative bg-brand-deep text-white px-10 py-5 rounded-2xl font-display font-bold text-lg overflow-hidden transition-all hover:translate-y-[-4px] active:translate-y-0 shadow-2xl shadow-brand-deep/20"
          >
            <div className="absolute inset-0 bg-linear-to-r from-brand-blue to-brand-glow opacity-0 group-hover:opacity-100 transition-opacity" />
            <span className="relative flex items-center justify-center gap-3">
              🚀 এখনই আবেদন করুন <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="relative order-2 lg:order-none"
      >
        <div className="relative z-10 bg-white p-6 sm:p-10 rounded-[32px] shadow-premium border border-white">
          <div className="flex items-center justify-between mb-8 lg:mb-10">
            <div>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">উপলব্ধ শূন্যপদ (Current Stock)</p>
              <h3 className="text-3xl sm:text-5xl font-display font-extrabold text-brand-deep">
                {(stats?.cs_admin_vacancies || 0) + (stats?.va_vacancies || 0)}
              </h3>
            </div>
            {stats && stats.hired_count > 0 && (
              <div className="text-right">
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-1">নিয়োগপ্রাপ্ত</p>
                <div className="flex items-center gap-1 justify-end">
                  <CheckCircle2 className="w-3 h-3 text-emerald-500" />
                  <span className="text-sm font-bold text-brand-deep">{stats.hired_count} জন</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-2 gap-4 mb-8 sm:mb-10">
            <div className="p-5 rounded-3xl bg-brand-blue text-white shadow-xl shadow-brand-blue/20">
              <h4 className="text-2xl sm:text-3xl font-display font-bold mb-1">{stats?.cs_admin_vacancies || 0}</h4>
              <p className="text-[10px] opacity-70 uppercase font-black tracking-wider">CS অ্যাডমিন</p>
            </div>
            <div className="p-5 rounded-3xl bg-emerald-600 text-white shadow-xl shadow-emerald-500/20">
              <h4 className="text-2xl sm:text-3xl font-display font-bold mb-1">{stats?.va_vacancies || 0}</h4>
              <p className="text-[10px] opacity-70 uppercase font-black tracking-wider">ভার্চুয়াল অ্যাসিস্ট্যান্ট</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">সাম্প্রতিক আবেদনসমূহ</p>
            <AnimatePresence mode="popLayout">
              {displayedApplicants.length > 0 ? displayedApplicants.map((app) => (
                <motion.div 
                  key={app.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-white hover:bg-white hover:shadow-sm transition-all group"
                >
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-xs font-bold text-brand-blue border border-slate-100 group-hover:scale-110 transition-transform">
                    {app.i}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-brand-deep">{app.n}</p>
                    <p className="text-[10px] text-slate-400 font-medium">{app.t}</p>
                  </div>
                  <span className={`text-[10px] font-black px-3 py-1.5 rounded-full tracking-tight ${app.p === 'VA' ? 'bg-emerald-50 text-emerald-600' : 'bg-brand-blue/10 text-brand-blue'}`}>
                    {app.p}
                  </span>
                </motion.div>
              )) : (
                <div className="text-center py-8 text-slate-300 text-sm italic font-medium">কোনো সাম্প্রতিক আবেদন নেই</div>
              )}
            </AnimatePresence>
          </div>
        </div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[105%] h-[105%] bg-linear-to-tr from-brand-blue/10 to-transparent rounded-[48px] -z-10 rotate-3 hidden sm:block" />
      </motion.div>
    </section>
  );
};

const TrustSection = () => (
  <section className="px-6 py-20 bg-brand-deep text-white relative overflow-hidden">
    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
    <div className="max-w-7xl mx-auto relative z-10">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mb-8 backdrop-blur-sm border border-white/10 shadow-2xl">
            <ShieldCheck className="w-8 h-8 text-brand-glow" />
          </div>
          <h2 className="font-display text-4xl lg:text-5xl font-extrabold mb-6 tracking-tight">
            নিরাপদ আবেদন — <br />
            <span className="text-brand-glow">কোনো টাকা লাগবে না</span>
          </h2>
          <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-lg">
            ShopVerse কখনোই কোনো আবেদনকারীর কাছ থেকে টাকা নেয় না। আমাদের হায়ারিং প্রক্রিয়া সম্পূর্ণ বিনামূল্যে। কেউ যদি চাকরির জন্য টাকা দাবি করে, তাহলে সেটি প্রতারণা।
          </p>
          <div className="grid grid-cols-2 gap-4">
            {[
              'কোনো আবেদন ফি নেই',
              'কোনো ট্রেনিং ফি নেই',
              '১০০% ফ্রি প্রসেস',
              'নিরাপদ তথ্য সুরক্ষা'
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span className="text-sm font-semibold">{item}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-4 lg:gap-6">
          {[
            { icon: Globe, label: '৩০+ ব্র্যান্ড পার্টনার', val: '৩টি দেশ' },
            { icon: Users, label: '১০০+ সক্রিয় অ্যাডমিন', val: '২টি শিফট' },
            { icon: BarChart3, label: '৫০০K+ টিকেট হ্যান্ডেল্ড', val: 'বার্ষিক' },
            { icon: Clock, label: '২৪/৭ অপারেশনস', val: 'অব্যাহত' },
          ].map((stat, i) => (
            <motion.div 
              key={i}
              whileHover={{ y: -5 }}
              className="p-6 sm:p-8 rounded-3xl bg-white/5 border border-white/10 backdrop-blur-sm"
            >
              <stat.icon className="w-6 h-6 sm:w-8 sm:h-8 text-brand-glow mb-4" />
              <h5 className="text-xl sm:text-2xl font-display font-bold mb-1 tracking-tight">{stat.label}</h5>
              <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em]">{stat.val}</p>
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
  };

  const handleNext = (e?: MouseEvent) => {
    e?.preventDefault();
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
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (step < 4) return;
    
    // Basic Validation
    if (!formData.fullName || formData.fullName.length < 3) {
      alert('দয়া করে আপনার পুরো নাম সঠিকভাবে লিখুন।');
      setStep(1);
      return;
    }

    if (!formData.phone || formData.phone.length < 10) {
      alert('দয়া করে সঠিক মোবাইল নম্বর প্রদান করুন।');
      setStep(1);
      return;
    }

    if (!formData.position) {
      alert('দয়া করে পদের নাম নির্বাচন করুন।');
      setStep(2);
      return;
    }
    
    // Check if at least one file is uploaded
    if (Object.keys(formData.imageUrls).length === 0) {
      alert('দয়া করে অন্তত একটি ডকুমেন্টস (সিভি বা পরিচয়পত্র) আপলোড করুন।');
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
      alert('আবেদন জমা দেওয়ায় সমস্যা হয়েছে। আবার চেষ্টা করুন।');
      setSubmitting(false);
    }
  };

  const handleSearch = async (e: FormEvent) => {
    e.preventDefault();
    if (!searchId) return;

    setSearchLoading(true);
    setSearchError(null);
    try {
      // Secret Admin Entry: ID "admin" + Pass "sv-admin-2026"
      if (searchId.toLowerCase() === 'admin' && searchPass === 'sv-admin-2026') {
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

        {/* Search History Quick Entry (Mobile) */}
        <section id="search-section" className="md:hidden px-6 pb-12">
           {/* Mobile search is already inside Hero but we keep this for consistency if needed */}
        </section>

        {/* Company Identity Highlight */}
        <section className="px-6 py-12 lg:py-24 max-w-7xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-[40px] lg:rounded-[60px] bg-white border border-slate-100 p-8 lg:p-24 shadow-2xl shadow-slate-200/50 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-8 lg:p-20 opacity-[0.03] pointer-events-none">
              <ShoppingBag className="w-64 h-64 lg:w-[400px] lg:h-[400px] text-brand-blue" />
            </div>
            
            <div className="relative z-10 grid lg:grid-cols-5 gap-16 lg:gap-20 items-center">
              <div className="lg:col-span-3">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-blue/10 text-brand-blue text-xs font-black uppercase tracking-widest mb-8">
                  <Star className="w-4 h-4 fill-current" />
                  Premium E-commerce Operations
                </div>
                <h2 className="font-display text-[32px] sm:text-5xl lg:text-7xl font-extrabold text-brand-deep leading-[1.1] tracking-tighter mb-8">
                  ShopVerse একটি বড় <br />
                  <span className="text-transparent bg-clip-text bg-linear-to-r from-brand-blue to-teal-500">ই-কমার্স অপারেশন্স</span> কোম্পানি
                </h2>
                <div className="h-2 w-24 bg-linear-to-r from-brand-blue to-teal-400 rounded-full mb-10" />
                <p className="text-slate-600 text-xl lg:text-3xl font-medium leading-normal mb-10 max-w-2xl text-balance">
                  আমরা বাংলাদেশের ৩০টিরও বেশি ই-কমার্স প্ল্যাটফর্মের সাথে সরাসরি যুক্ত এবং তাদের কাস্টমার সাপোর্ট ও অর্ডার ম্যানেজমেন্ট সেবা প্রদান করি।
                </p>
                
                <div className="grid grid-cols-2 sm:flex sm:flex-wrap gap-8 lg:gap-12">
                  <div className="flex flex-col">
                    <span className="text-4xl lg:text-5xl font-display font-black text-brand-deep">৩০+</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">প্ল্যাটফর্ম পার্টনার</span>
                  </div>
                  <div className="w-[1px] h-12 bg-slate-100 hidden sm:block" />
                  <div className="flex flex-col">
                    <span className="text-4xl lg:text-5xl font-display font-black text-brand-deep">১০০+</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">দক্ষ অ্যাডমিন</span>
                  </div>
                  <div className="w-[1px] h-12 bg-slate-100 hidden sm:block mx-4" />
                  <div className="flex flex-col col-span-2 sm:col-span-1">
                    <span className="text-4xl lg:text-5xl font-display font-black text-brand-deep italic">২০+</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">ইন্ডাস্ট্রি অ্যাওয়ার্ড</span>
                  </div>
                </div>
              </div>
              
              <div className="lg:col-span-2">
                <div className="grid grid-cols-2 gap-4 sm:gap-6">
                  {[
                    { label: 'কাস্টমার সাপোর্ট', icon: Mail, color: 'text-blue-600', bg: 'bg-blue-50' },
                    { label: 'অর্ডার প্রসেশিং', icon: ShoppingBag, color: 'text-emerald-600', bg: 'bg-emerald-50' },
                    { label: 'ভার্চুয়াল সাপোর্ট', icon: Globe, color: 'text-purple-600', bg: 'bg-purple-50' },
                    { label: 'এনালিটিক্স', icon: BarChart3, color: 'text-orange-600', bg: 'bg-orange-50' },
                  ].map((feat, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ y: -8 }}
                      className="p-6 sm:p-8 rounded-[32px] bg-slate-50 border border-slate-100 flex flex-col items-center text-center group transition-all hover:bg-white hover:shadow-xl hover:shadow-slate-200/50"
                    >
                      <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-[22px] ${feat.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                        <feat.icon className={`w-7 h-7 sm:w-8 sm:h-8 ${feat.color}`} />
                      </div>
                      <span className="text-xs sm:text-sm font-black text-slate-700 tracking-tight leading-tight">{feat.label}</span>
                    </motion.div>
                  ))}
                </div>
                
                <div className="mt-10 p-8 sm:p-10 rounded-[40px] bg-brand-deep text-white shadow-2xl shadow-brand-deep/30 relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50 mb-6 italic">Join the Elite Team</p>
                  <p className="text-xl sm:text-2xl font-display font-bold leading-tight mb-8">আমাদের দ্রুত বর্ধনশীল প্রতিষ্ঠানের অংশ হয়ে নিজের ভবিষ্যৎ গড়ুন।</p>
                  <button 
                    onClick={() => setView('form')}
                    className="w-full bg-brand-glow text-brand-deep py-5 rounded-2xl font-display font-black text-xl hover:bg-white transition-all transform hover:scale-[1.02] active:scale-95 shadow-xl shadow-brand-glow/20"
                  >
                    শুরু করুন
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
        
        {/* Network Marquee */}
        <section className="py-24 bg-white border-y border-slate-100 overflow-hidden relative">
          <div className="absolute inset-0 bg-linear-to-b from-slate-50/50 to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <div className="inline-block relative">
                <div className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[12px] lg:text-[14px] flex flex-col md:flex-row items-center justify-center gap-2 md:gap-3">
                  <span className="relative px-4 py-1.5 rounded-full bg-brand-blue/5 border border-brand-blue/20 text-brand-blue overflow-hidden group">
                    {/* Shimmer Effect */}
                    <motion.div 
                      animate={{ x: ['-100%', '200%'] }}
                      transition={{ repeat: Infinity, duration: 3, ease: "linear", repeatDelay: 1 }}
                      className="absolute inset-0 bg-linear-to-r from-transparent via-white/40 to-transparent skew-x-12"
                    />
                    ৩০+ ই-কমার্স প্ল্যাটফর্মে কাস্টমার সাপোর্ট
                  </span>
                  <span className="text-slate-400">Our Network</span>
                </div>
                <motion.div 
                  initial={{ width: 0 }}
                  whileInView={{ width: '100%' }}
                  transition={{ delay: 0.5, duration: 1 }}
                  className="absolute -bottom-4 left-0 h-[2px] bg-linear-to-r from-transparent via-brand-blue/30 to-transparent"
                />
              </div>
            </motion.div>
            
            <div className="mask-marquee overflow-hidden">
              <motion.div 
                animate={{ x: ["0%", "-50%"] }}
                transition={{ 
                  duration: 30, 
                  repeat: Infinity, 
                  ease: "linear" 
                }}
                className="flex whitespace-nowrap min-w-max hover:[animation-play-state:paused]"
              >
                <div className="flex gap-12 items-center px-6">
                  {BRANDS.map((b, i) => (
                    <Brand key={i} logo={b.l} name={b.n} color={b.c} />
                  ))}
                </div>
                <div className="flex gap-12 items-center px-6">
                  {BRANDS.map((b, i) => (
                    <Brand key={`clone-${i}`} logo={b.l} name={b.n} color={b.c} />
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        <TrustSection />
        
        {/* CTA Section */}
        <section className="px-6 py-12 lg:py-24 max-w-7xl mx-auto">
          <div className="rounded-[40px] lg:rounded-[60px] bg-linear-to-br from-brand-deep via-brand-blue to-teal-500 p-10 lg:p-32 relative overflow-hidden text-center shadow-3xl shadow-brand-blue/40 group">
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/10 rounded-full blur-[120px] -z-0 translate-x-1/2 -translate-y-1/2 group-hover:scale-110 transition-transform duration-1000" />
            <div className="relative z-10">
              <h2 className="font-display text-[32px] sm:text-5xl lg:text-7xl font-extrabold text-white mb-8 lg:mb-12 tracking-tighter leading-tight italic">
                আপনার ক্যারিয়ার গড়ার <br className="hidden sm:block" />
                সঠিক সময় এখনই
              </h2>
              <p className="text-white/80 text-lg lg:text-2xl mb-12 lg:mb-16 max-w-3xl mx-auto leading-relaxed font-medium">
                আমাদের অপারেশনস এক্সপার্টদের টিমে যোগ দিন। দ্রুত বর্ধনশীল ই-কমার্স ইন্ডাস্ট্রিতে নিজের দক্ষতা বাড়ান এবং সেরা ব্র্যান্ডের সাথে কাজ করুন।
              </p>
              <button 
                onClick={() => setView('form')}
                className="group inline-flex items-center gap-4 bg-brand-glow text-brand-deep px-10 py-5 lg:px-16 lg:py-8 rounded-[24px] font-display font-black text-xl lg:text-3xl hover:bg-white transition-all transform hover:scale-105 active:scale-95 shadow-2xl shadow-brand-glow/40"
              >
                আবেদন শুরু করুন
                <ChevronRight className="w-6 h-6 lg:w-8 lg:h-8 group-hover:translate-x-2 transition-transform" />
              </button>
            </div>
          </div>
        </section>

        <footer className="py-12 border-t border-slate-100 text-center text-slate-400 text-sm">
          © ২০২৬ ShopVerse — প্রিমিয়াম অপারেশনস সলিউশন। সর্বস্বত্ব সংরক্ষিত।
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

            <form onSubmit={handleSubmit} className="space-y-10">
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
                        currentApp.status === 'approved' ? 'bg-emerald-100 text-emerald-600' :
                        currentApp.status === 'rejected' ? 'bg-red-100 text-red-600' :
                        'bg-amber-100 text-amber-600'
                      }`}>
                        <div className={`w-2 h-2 rounded-full animate-pulse ${
                          currentApp.status === 'approved' ? 'bg-emerald-500' :
                          currentApp.status === 'rejected' ? 'bg-red-500' :
                          'bg-amber-500'
                        }`} />
                        {currentApp.status === 'approved' ? 'গৃহীত (Approved)' :
                         currentApp.status === 'rejected' ? 'বাতিল (Rejected)' :
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

              <button 
                onClick={() => setView('home')}
                className="w-full bg-slate-100 text-slate-600 py-4 rounded-2xl font-bold hover:bg-slate-200 transition-all active:scale-95"
              >
                বন্ধ করুন
              </button>
            </motion.div>
          </motion.div>
        )}

        {view === 'admin' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-brand-deep/90 backdrop-blur-xl"
          >
            <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl p-8 lg:p-12 relative max-h-[90vh] overflow-y-auto">
              <button 
                onClick={() => setView('home')}
                className="absolute top-6 right-6 w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors"
              >
                <AlertCircle className="w-5 h-5 rotate-45 text-slate-400" />
              </button>

              <h2 className="font-display font-black text-3xl mb-8 flex items-center gap-3">
                <ShieldCheck className="text-brand-blue" />
                অ্যাডমিন প্যানেল
              </h2>

              <div className="space-y-4 mb-10">
                <div className="flex gap-4">
                  <input 
                    type="text" 
                    placeholder="সার্চ আইডি (SV-XXX...)"
                    value={searchId}
                    onChange={e => setSearchId(e.target.value)}
                    className="flex-1 px-6 py-4 rounded-2xl border border-slate-100 bg-slate-50"
                  />
                  <button 
                    onClick={() => handleSearch({ preventDefault: () => {} } as any)}
                    className="px-8 bg-brand-blue text-white rounded-2xl font-bold"
                  >
                    খুঁজুন
                  </button>
                </div>

                {currentApp ? (
                  <div className="p-8 rounded-3xl border border-slate-100 bg-slate-50 space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <Field label="স্ট্যাটাস আপডেট করুন">
                        <select 
                          value={adminStatus} 
                          onChange={e => setAdminStatus(e.target.value)}
                          className="w-full px-6 py-4 rounded-xl border border-slate-200 bg-white"
                        >
                          <option value="pending">Pending</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </Field>
                      <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase mb-2">আবেদনকারী</p>
                        <p className="font-bold text-brand-deep">{currentApp.fullName}</p>
                        <p className="text-xs text-slate-400 mt-1">{currentApp.displayId}</p>
                      </div>
                    </div>

                    <Field label="রেসপন্স / নোট লিখুন">
                      <textarea 
                        rows={6}
                        value={adminNote}
                        onChange={e => setAdminNote(e.target.value)}
                        placeholder="অ্যাডমিন ফিডব্যাক এখানে লিখুন..."
                        className="w-full px-6 py-4 rounded-xl border border-slate-200 bg-white outline-none focus:border-brand-blue transition-all"
                      />
                    </Field>

                    <button 
                      onClick={handleAdminUpdate}
                      disabled={submitting}
                      className="w-full bg-brand-deep text-white py-5 rounded-2xl font-black text-lg hover:bg-brand-blue transition-all disabled:opacity-50"
                    >
                      {submitting ? 'আপডেট হচ্ছে...' : 'পরিবর্তন সেভ করুন'}
                    </button>
                  </div>
                ) : (
                  <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                    <p className="text-slate-400 font-medium">কোনো এন্ট্রি লোড করা নেই</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

