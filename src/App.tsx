/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, FormEvent, MouseEvent } from 'react';
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
  MessageCircle,
  Camera,
  X,
  Copy,
  Check
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

import { Step, ApplicationData, ApplicationStatus } from './types';
import { BRANDS } from './data';
import { SubmittedScreen } from './components/SubmittedScreen';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { TrustSection } from './components/TrustSection';
import { AdminDashboard } from './components/AdminDashboard';
import { ProcessSection } from './components/ProcessSection';
import { ValuesSection } from './components/ValuesSection';
import { 
  AboutUs, 
  CareerDesk, 
  PrivacyPolicy, 
  TermsConditions, 
  SupportPortal 
} from './components/InfoViews';
import { StatusView } from './components/StatusView';

// --- Constants ---

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

// --- Sub-components for Form ---

const Brand: React.FC<{ logo: string, name: string, color?: string }> = ({ logo, name, color }) => (
    <div className="flex items-center gap-2 md:gap-4 px-4 md:px-8 py-3 md:py-4 rounded-xl md:rounded-2xl bg-white/50 border border-slate-100/50 backdrop-blur-sm grayscale opacity-40 hover:grayscale-0 hover:opacity-100 hover:border-brand-blue/20 hover:bg-white transition-all duration-500 cursor-default group shrink-0">
    <div className={`w-8 h-8 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center text-xl md:text-2xl shadow-sm border border-slate-50 transition-transform group-hover:scale-110 ${color || 'bg-slate-50'}`}>
      {logo}
    </div>
    <span className="font-display font-extrabold text-sm md:text-lg text-slate-800 tracking-tight">{name}</span>
  </div>
);

const Progress = ({ step }: { step: Step }) => (
  <div className="flex items-center justify-between gap-1 sm:gap-2 mb-10 max-w-lg mx-auto">
    {[
      { s: 1, bn: 'ব্যক্তিগত', en: 'Personal' },
      { s: 2, bn: 'অভিজ্ঞতা', en: 'Experience' },
      { s: 3, bn: 'দক্ষতা', en: 'Skills' },
      { s: 4, bn: 'ডকুমেন্ট', en: 'Documents' }
    ].map((item) => (
      <div key={item.s} className="flex flex-col items-center gap-2 flex-1 last:flex-none">
        <div className="flex items-center gap-1 sm:gap-2 w-full">
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-display font-bold text-sm transition-all duration-500 flex-shrink-0 ${
            step >= item.s ? 'bg-brand-deep text-white shadow-xl shadow-brand-deep/20 scale-110' : 'bg-slate-50 border border-slate-100 text-slate-300'
          }`}>
            {step > item.s ? <CheckCircle2 className="w-5 h-5" /> : item.s}
          </div>
          {item.s < 4 && <div className={`h-[2px] flex-1 rounded-full transition-all duration-700 ${step > item.s ? 'bg-brand-blue' : 'bg-slate-100'}`} />}
        </div>
        <div className="flex flex-col items-center">
          <span className={`text-[8px] font-black uppercase tracking-[0.2em] ${step >= item.s ? 'text-brand-deep' : 'text-slate-300'}`}>
            {item.en}
          </span>
          <span className={`text-[10px] font-bold hidden sm:block ${step >= item.s ? 'text-slate-500' : 'text-slate-200'}`}>
            {item.bn}
          </span>
        </div>
      </div>
    ))}
  </div>
);

const Field = ({ labelBn, labelEn, required, children }: { labelBn: string, labelEn: string, required?: boolean, children: React.ReactNode }) => (
  <div className="space-y-3">
    <div className="flex items-end justify-between">
      <label className="flex flex-col">
        <span className="text-sm lg:text-base font-black text-brand-deep tracking-tight">{labelBn} {required && <span className="text-red-500">*</span>}</span>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{labelEn}</span>
      </label>
    </div>
    {children}
  </div>
);

const UploadBox = ({ labelBn, labelEn, icon: Icon, onFileSelect, isUploaded, progress, previewUrl }: any) => {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className={`relative h-48 rounded-3xl border-2 border-dashed transition-all cursor-pointer flex flex-col items-center justify-center gap-3 overflow-hidden group
        ${isUploaded ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-200 bg-slate-50 hover:bg-white hover:border-brand-blue/50'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => inputRef.current?.click()}
    >
      <input 
        type="file" 
        ref={inputRef} 
        className="hidden" 
        accept={labelEn.includes('Photo') ? 'image/*' : '.pdf,.doc,.docx,image/*'}
        onChange={e => e.target.files?.[0] && onFileSelect(e.target.files[0])} 
      />

      {previewUrl ? (
        <div className="absolute inset-0">
          <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-[2px]" />
        </div>
      ) : null}

      {progress > 0 && progress < 100 && (
        <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-30 flex flex-col items-center justify-center p-6 text-center">
          <div className="relative w-20 h-20 mb-4">
             <svg className="w-full h-full -rotate-90">
               <circle
                 cx="40"
                 cy="40"
                 r="36"
                 stroke="currentColor"
                 strokeWidth="4"
                 fill="transparent"
                 className="text-slate-100"
               />
               <motion.circle
                 cx="40"
                 cy="40"
                 r="36"
                 stroke="currentColor"
                 strokeWidth="4"
                 fill="transparent"
                 strokeDasharray="226.2"
                 initial={{ strokeDashoffset: 226.2 }}
                 animate={{ strokeDashoffset: 226.2 - (226.2 * progress) / 100 }}
                 className="text-brand-blue"
                 strokeLinecap="round"
               />
             </svg>
             <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-black text-brand-deep font-mono">{Math.round(progress)}%</span>
             </div>
          </div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-brand-blue animate-pulse">ফাইল আপলোড হচ্ছে...</p>
        </div>
      )}

      <div className="relative z-10 flex flex-col items-center text-center px-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${
          isUploaded ? 'bg-emerald-500 text-white' : 'bg-white text-slate-400 shadow-sm group-hover:scale-110 group-hover:text-brand-blue'
        }`}>
          {isUploaded ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
        </div>
        <div className="mt-2">
          <p className={`text-[11px] font-black uppercase tracking-widest ${isUploaded ? 'text-emerald-700' : 'text-slate-500'}`}>{labelEn}</p>
          <p className={`text-xs font-bold ${isUploaded ? 'text-emerald-600' : 'text-slate-400'}`}>{isUploaded ? 'আপলোড হয়েছে' : labelBn}</p>
        </div>
      </div>

      <AnimatePresence>
        {isHovered && !isUploaded && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute inset-0 bg-brand-blue/90 backdrop-blur-sm flex flex-col items-center justify-center text-white"
          >
            <Upload className="w-8 h-8 mb-2 animate-bounce" />
            <p className="font-bold text-sm">সিলেক্ট করুন</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// --- Main App Component ---

export default function App() {
  const [view, setView] = useState<'home' | 'form' | 'status' | 'admin' | 'about' | 'career' | 'privacy' | 'terms' | 'support'>('home');
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
  const [copiedField, setCopiedField] = useState<string | null>(null);

  const handleCopy = (text: string, field: string) => {
    if (!text) return;
    navigator.clipboard.writeText(text).then(() => {
      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    });
  };

  // Global Data
  const [stats, setStats] = useState<{ cs_admin_vacancies: number, va_vacancies: number, hired_count: number } | null>(null);
  const [recentApplicants, setRecentApplicants] = useState<any[]>([]);

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
    window.scrollTo(0, 0);
  };

  const handleBack = (e?: MouseEvent) => {
    e?.preventDefault();
    if (step > 1) setStep(prev => (prev - 1) as Step);
    else {
      resetForm();
      setView('home');
    }
    window.scrollTo(0, 0);
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
    try {
      const result = await submitApplication(formData);
      setSubmissionResult({ displayId: result.displayId, password: result.password });
      setSubmitting(false);
      setSubmitted(true);
      window.scrollTo(0, 0);
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

      const app = await getApplicationByDisplayId(searchId, searchPass);
      if (app) {
        setCurrentApp(app);
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

  const handleFileUpload = async (file: File, label: string) => {
    try {
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
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'ফাইল আপলোড ব্যর্থ হয়েছে।';
      alert(`ফাইল আপলোড ব্যর্থ হয়েছে: ${errorMessage}`);
      setUploadProgress(prev => {
        const next = { ...prev };
        delete next[label];
        return next;
      });
    }
  };

  // Admin Data logic moved to components or simplified
  const [allApplications, setAllApplications] = useState<any[]>([]);

  const refreshAdminData = async () => {
    try {
      const [r, s] = await Promise.all([getRecentApplications(100), getStats()]);
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

  if (view === 'about') return <AboutUs onBack={() => setView('home')} />;
  if (view === 'career') return <CareerDesk onBack={() => setView('home')} />;
  if (view === 'privacy') return <PrivacyPolicy onBack={() => setView('home')} />;
  if (view === 'terms') return <TermsConditions onBack={() => setView('home')} />;
  if (view === 'support') return <SupportPortal onBack={() => setView('home')} />;

  if (view === 'home') {
    return (
      <div className="bg-slate-50 min-h-screen overflow-y-auto overflow-x-hidden">
        <Navbar 
          onApply={() => { resetForm(); setView('form'); }} 
          onHistory={() => {
            const h = document.getElementById('search-section');
            h?.scrollIntoView({ behavior: 'smooth' });
          }} 
          onAbout={() => setView('about')}
          onSupport={() => setView('support')}
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

        <section className="px-6 py-10 bg-slate-50 relative overflow-hidden">
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
        
        <section className="px-6 py-24 bg-white">
           <div className="max-w-4xl mx-auto p-12 lg:p-20 rounded-[50px] bg-linear-to-br from-brand-deep to-slate-900 text-white text-center relative overflow-hidden shadow-3xl shadow-brand-deep/30">
              <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/20 blur-3xl -z-10" />
              <h2 className="font-display text-4xl lg:text-6xl font-black mb-8 tracking-tighter">আপনার ক্যারিয়ারের যাত্রা শুরু করুন আজই</h2>
              <p className="text-slate-400 text-lg mb-12 max-w-lg mx-auto font-medium">নিরাপদ এবং উজ্জ্বল ভবিষ্যতের জন্য এখনই আবেদন করুন। বাছাই প্রক্রিয়ার প্রতিটি ধাপে আমরা আপনার সাথে আছি।</p>
              <button 
                onClick={() => { resetForm(); setView('form'); }}
                className="bg-brand-blue hover:bg-brand-glow text-white px-12 py-5 rounded-2xl font-display font-black text-xl transition-all shadow-xl hover:scale-105 active:scale-95"
              >
                ফ্রি আবেদন করুন
              </button>
           </div>
        </section>

        <footer className="px-6 py-12 border-t border-slate-100 bg-white">
          <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-brand-blue flex items-center justify-center text-white">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <span className="font-display font-black text-xl text-brand-deep">ShopVerse</span>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">© 2026-2027 ShopVerse Recruitment System. All Rights Reserved.</p>
            <div className="flex flex-wrap justify-center gap-6 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <button onClick={() => setView('about')} className="hover:text-brand-blue transition-colors">আমাদের সম্পর্কে</button>
              <button onClick={() => setView('career')} className="hover:text-brand-blue transition-colors">ক্যারিয়ার ডেস্ক</button>
              <button onClick={() => setView('privacy')} className="hover:text-brand-blue transition-colors">প্রাইভেসি পলিসি</button>
              <button onClick={() => setView('terms')} className="hover:text-brand-blue transition-colors">টার্মস অ্যান্ড কন্ডিশন</button>
              <button onClick={() => setView('support')} className="hover:text-brand-blue transition-colors">সাপোর্ট</button>
            </div>
          </div>
        </footer>
      </div>
    );
  }

  if (view === 'status' && currentApp) {
    return <StatusView currentApp={currentApp} onBack={() => setView('home')} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 lg:py-20 px-6 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-8">
          <div className="flex items-center gap-4 cursor-pointer" onClick={handleBack}>
            <div className="w-12 h-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 hover:text-brand-blue transition-all shadow-sm">
              <ArrowLeft className="w-6 h-6" />
            </div>
            <div className="text-left">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">ফিরে যান</p>
              <h3 className="font-display font-black text-xl text-brand-deep italic">ShopVerse Career</h3>
            </div>
          </div>
          <Progress step={step} />
        </div>

        <section className="relative">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.div
                key="form"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white rounded-[40px] shadow-premium p-8 lg:p-16 border border-white"
              >
                <form onSubmit={handleSubmit} className="space-y-12">
                  {step === 1 && (
                    <motion.div
                      key="step1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-8"
                    >
                      <div className="grid md:grid-cols-2 gap-8">
                        <Field labelBn="আপনার পুরো নাম" labelEn="Full Name" required>
                          <input 
                            type="text" 
                            placeholder="উদা: রাকিব আহমেদ"
                            value={formData.fullName}
                            onChange={e => updateField('fullName', e.target.value)}
                            className="w-full px-6 py-4 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:bg-white focus:border-brand-blue transition-all font-bold text-brand-deep placeholder:text-slate-300"
                          />
                        </Field>
                        <Field labelBn="জন্ম তারিখ" labelEn="Date of Birth" required>
                          <input 
                            type="date" 
                            value={formData.dob}
                            onChange={e => updateField('dob', e.target.value)}
                            className="w-full px-6 py-4 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:bg-white focus:border-brand-blue transition-all font-bold text-brand-deep"
                          />
                        </Field>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8">
                        <Field labelBn="ইমেইল অ্যাড্রেস" labelEn="Email Address" required>
                          <input 
                            type="email" 
                            placeholder="example@mail.com"
                            value={formData.email}
                            onChange={e => updateField('email', e.target.value)}
                            className="w-full px-6 py-4 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:bg-white focus:border-brand-blue transition-all font-bold text-brand-deep placeholder:text-slate-300"
                          />
                        </Field>
                        <Field labelBn="মোবাইল নম্বর" labelEn="Phone Number" required>
                          <input 
                            type="tel" 
                            placeholder="017XXXXXXXX"
                            value={formData.phone}
                            onChange={e => updateField('phone', e.target.value)}
                            className="w-full px-6 py-4 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:bg-white focus:border-brand-blue transition-all font-bold text-brand-deep placeholder:text-slate-300"
                          />
                        </Field>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8">
                        <Field labelBn="হোয়াটসঅ্যাপ নম্বর (ঐচ্ছিক)" labelEn="WhatsApp Number (Optional)">
                          <input 
                            type="tel" 
                            value={formData.whatsapp}
                            onChange={e => updateField('whatsapp', e.target.value)}
                            className="w-full px-6 py-4 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:bg-white focus:border-brand-blue transition-all font-bold text-brand-deep"
                          />
                        </Field>
                        <Field labelBn="আপনার শহর" labelEn="City" required>
                          <select 
                            value={formData.city}
                            onChange={e => updateField('city', e.target.value)}
                            className="w-full px-6 py-4 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:bg-white focus:border-brand-blue transition-all font-bold text-brand-deep"
                          >
                            <option value="">শহর নির্বাচন করুন</option>
                            <option value="Dhaka">ঢাকা</option>
                            <option value="Chittagong">চট্টগ্রাম</option>
                            <option value="Sylhet">সিলেট</option>
                            <option value="Rajshahi">রাজশাহী</option>
                            <option value="Khulna">খুলনা</option>
                            <option value="Barisal">বরিশাল</option>
                            <option value="Rangpur">রংপুর</option>
                            <option value="Mymensingh">ময়মনসিংহ</option>
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
                      <Field labelBn="পজিশন নির্বাচন করুন" labelEn="Select Desired Position" required>
                        <div className="grid grid-cols-2 gap-4">
                          {[
                            { id: 'cs_admin', bn: 'CS অ্যাডমিন', en: 'CS Admin', icon: MessageCircle },
                            { id: 'va', bn: 'VA পজিশন', en: 'Virtual Assistant', icon: Briefcase }
                          ].map(role => (
                            <button
                              key={role.id}
                              type="button"
                              onClick={() => updateField('position', role.id)}
                              className={`p-6 md:p-8 rounded-3xl border-2 transition-all flex flex-col items-center gap-4 group ${
                                formData.position === role.id 
                                  ? 'border-brand-blue bg-brand-blue/5 text-brand-blue shadow-xl shadow-brand-blue/10 scale-105' 
                                  : 'border-slate-100 text-slate-400 grayscale hover:grayscale-0'
                              }`}
                            >
                              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                                formData.position === role.id ? 'bg-brand-blue text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-brand-blue/10'
                              }`}>
                                <role.icon className="w-6 h-6" />
                              </div>
                              <div className="text-center">
                                <h4 className="font-display font-black text-lg tracking-tight leading-none mb-1">{role.bn}</h4>
                                <span className="text-[10px] font-black uppercase tracking-widest">{role.en}</span>
                              </div>
                            </button>
                          ))}
                        </div>
                      </Field>

                      <Field labelBn="অভিজ্ঞতার লেভেল" labelEn="Experience Level" required>
                        <div className="flex flex-wrap gap-3">
                          {['নতুন (Fresher)', '১-২ বছর', '৩-৫ বছর', '৫+ বছর'].map(val => (
                            <button
                              key={val}
                              type="button"
                              onClick={() => updateField('experience', val)}
                              className={`px-8 py-4 rounded-2xl border-2 font-bold transition-all ${
                                formData.experience === val 
                                  ? 'border-brand-blue bg-brand-blue/5 text-brand-blue shadow-md' 
                                  : 'border-slate-100 text-slate-400'
                              }`}
                            >
                              {val}
                            </button>
                          ))}
                        </div>
                      </Field>

                      <div className="grid md:grid-cols-2 gap-8">
                        <Field labelBn="আগের কোম্পানি (যদি থাকে)" labelEn="Previous Company (If any)">
                          <input 
                            type="text" 
                            placeholder="কোম্পানির নাম লিখুন"
                            value={formData.previousCompany}
                            onChange={e => updateField('previousCompany', e.target.value)}
                            className="w-full px-6 py-4 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:bg-white focus:border-brand-blue transition-all font-bold text-brand-deep"
                          />
                        </Field>
                        <Field labelBn="কাজের ধরন" labelEn="Work Preferred" required>
                           <div className="flex gap-4">
                             {['Remote', 'Office'].map(mode => (
                               <button 
                                 key={mode}
                                 type="button"
                                 onClick={() => updateField('workType', mode)}
                                 className={`flex-1 py-4 rounded-xl font-bold border-2 transition-all ${formData.workType === mode ? 'bg-brand-blue border-brand-blue text-white shadow-lg' : 'border-slate-100 text-slate-400'}`}
                               >
                                 {mode}
                               </button>
                             ))}
                           </div>
                        </Field>
                      </div>
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
                      <Field labelBn="আপনার ইংরেজি দক্ষতা" labelEn="English Proficiency" required>
                        <div className="flex items-center gap-1 sm:gap-4 justify-between bg-slate-50 p-6 rounded-3xl border border-slate-100">
                          {[1, 2, 3, 4, 5].map(star => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => updateField('englishRating', star)}
                              className="group flex flex-col items-center gap-1 transition-transform active:scale-90"
                            >
                              <Star className={`w-8 h-8 sm:w-10 sm:h-10 transition-colors ${
                                formData.englishRating >= star ? 'fill-amber-400 text-amber-400' : 'text-slate-200 group-hover:text-slate-300'
                              }`} />
                              <span className={`text-[8px] font-black uppercase tracking-widest ${formData.englishRating === star ? 'text-brand-deep' : 'text-slate-300'}`}>
                                {star === 1 ? 'Poor' : star === 3 ? 'Good' : star === 5 ? 'Fluency' : ''}
                              </span>
                            </button>
                          ))}
                        </div>
                      </Field>

                      <Field labelBn="আপনার সেরা দক্ষতাগুলো" labelEn="Select Top Skills">
                         <div className="flex flex-wrap gap-2">
                           {['Customer Support', 'Order Tracking', 'Social Media', 'Data Entry', 'Communication', 'Multitasking', 'Problem Solving'].map(skill => (
                             <button
                               key={skill}
                               type="button"
                               onClick={() => {
                                 const next = formData.skills.includes(skill) 
                                   ? formData.skills.filter(s => s !== skill) 
                                   : [...formData.skills, skill];
                                 updateField('skills', next);
                               }}
                               className={`px-6 py-3 rounded-full border-2 text-[10px] font-black uppercase tracking-widest transition-all ${
                                 formData.skills.includes(skill) ? 'bg-brand-blue border-brand-blue text-white shadow-lg shadow-brand-blue/20' : 'border-slate-100 text-slate-400 hover:border-brand-blue/30'
                               }`}
                             >
                               {skill}
                             </button>
                           ))}
                         </div>
                      </Field>

                      <Field labelBn="প্রত্যাশিত মাসিক বেতন" labelEn="Expected Monthly Salary" required>
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
                          Supporting documents (CV & Photo) help us process your application faster. Max file size: 5MB per file.
                        </p>
                      </div>

                      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                        <UploadBox 
                          labelBn="প্রোফাইল ফটো"
                          labelEn="Profile Photo"
                          icon={Camera} 
                          onFileSelect={(file: File) => handleFileUpload(file, 'photo')}
                          isUploaded={!!formData.imageUrls.photo}
                          progress={uploadProgress['photo']}
                          previewUrl={previews['photo']}
                        />
                        <UploadBox 
                          labelBn="সিভি/রেজুমে"
                          labelEn="CV / Resume"
                          icon={FileText} 
                          onFileSelect={(file: File) => handleFileUpload(file, 'cv')}
                          isUploaded={!!formData.imageUrls.cv}
                          progress={uploadProgress['cv']}
                          previewUrl={previews['cv']}
                        />
                        <UploadBox 
                          labelBn="পরিচয়পত্র"
                          labelEn="NID / ID Card"
                          icon={ShieldCheck} 
                          onFileSelect={(file: File) => handleFileUpload(file, 'nid')}
                          isUploaded={!!formData.imageUrls.nid}
                          progress={uploadProgress['nid']}
                          previewUrl={previews['nid']}
                        />
                      </div>

                      <Field labelBn="সোশ্যাল প্রোফাইল" labelEn="Social Profile (FB/LinkedIn)">
                        <input 
                          type="url" 
                          placeholder="https://linkedin.com/in/..."
                          value={formData.facebookLink}
                          onChange={e => updateField('facebookLink', e.target.value)}
                          className="w-full px-6 py-4 rounded-xl border border-slate-100 bg-slate-50 outline-none focus:bg-white focus:border-brand-blue transition-all font-bold text-brand-deep placeholder:text-slate-300"
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
                        <span className="text-xs text-slate-500 font-bold leading-relaxed">
                          আমি নিশ্চিত করছি যে তথ্যাদি সঠিক এবং আমি ShopVerse শর্তাবলীর সাথে একমত। (I confirm the data is accurate and agree to terms).
                        </span>
                      </label>
                    </motion.div>
                  )}
                </form>

                <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-6 mt-16 pt-10 border-t border-slate-50">
                  <div className="w-full md:w-auto">
                    {step > 1 && (
                      <button 
                        onClick={handleBack}
                        className="w-full md:w-auto px-10 py-5 rounded-2xl font-bold flex items-center justify-center gap-2 text-slate-400 hover:text-brand-blue hover:bg-brand-blue/5 transition-all uppercase text-[10px] tracking-widest"
                      >
                        <ArrowLeft className="w-4 h-4" /> আগের ধাপ (Back)
                      </button>
                    )}
                  </div>

                  <div className="w-full md:w-auto flex flex-col items-end gap-3">
                     {formError && (
                        <motion.span 
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="text-xs font-bold text-red-500 bg-red-50 px-4 py-2 rounded-lg border border-red-100"
                        >
                          {formError}
                        </motion.span>
                     )}
                     
                     {step < 4 ? (
                       <button
                         onClick={handleNext}
                         className="w-full md:w-auto bg-brand-deep text-white px-12 py-5 rounded-2xl font-display font-black text-lg transition-all shadow-xl shadow-brand-deep/20 hover:bg-brand-blue hover:translate-x-1"
                       >
                         পরবর্তী ধাপ (Next)
                       </button>
                     ) : (
                       <button
                         onClick={handleSubmit}
                         disabled={submitting}
                         className="w-full md:w-auto bg-brand-blue text-white px-16 py-6 rounded-3xl font-display font-black text-xl transition-all shadow-2xl shadow-brand-blue/30 hover:bg-brand-glow hover:scale-105 active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3"
                       >
                         {submitting ? (
                           <>
                             <Loader2 className="w-6 h-6 animate-spin" />
                             প্রসেসিং হচ্ছে...
                           </>
                         ) : (
                           <>
                             আবেদন জমা দিন <Send className="w-6 h-6" />
                           </>
                         )}
                       </button>
                     )}
                  </div>
                </div>
              </motion.div>
            ) : (
              <SubmittedScreen 
                submissionResult={submissionResult}
                onBackHome={() => { resetForm(); setView('home'); }}
                onCopy={handleCopy}
                copiedField={copiedField}
              />
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
}
