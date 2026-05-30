import React from 'react';
import { motion } from 'motion/react';
import { CheckCircle2, Check, Copy, Lock } from 'lucide-react';

interface SubmittedScreenProps {
  submissionResult: { displayId: string; password: string } | null;
  onBackHome: () => void;
  onCopy: (text: string, field: string) => void;
  copiedField: string | null;
}

export const SubmittedScreen: React.FC<SubmittedScreenProps> = ({ 
  submissionResult, 
  onBackHome, 
  onCopy, 
  copiedField 
}) => (
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
      <div 
        onClick={() => onCopy(submissionResult?.displayId || '', 'id')}
        className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col items-center group hover:border-brand-blue/30 transition-all cursor-pointer relative overflow-hidden"
      >
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {copiedField === 'id' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">আবেদন আইডি (Application ID)</span>
        <span className="font-mono font-bold text-brand-blue text-2xl tracking-tighter">
          {submissionResult?.displayId || 'SV-XXX-XXX'}
        </span>
        {copiedField === 'id' && (
          <motion.span 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-[10px] font-bold text-emerald-500 mt-2 uppercase"
          >
            কপি করা হয়েছে (Copied)
          </motion.span>
        )}
      </div>
      <div 
        onClick={() => onCopy(submissionResult?.password || '', 'pass')}
        className="bg-slate-50 p-6 rounded-2xl border border-slate-100 flex flex-col items-center group hover:border-brand-glow/30 transition-all cursor-pointer relative overflow-hidden"
      >
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          {copiedField === 'pass' ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
        </div>
        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2">সিকিউরিটি পাসওয়ার্ড (Password)</span>
        <span className="font-mono font-bold text-brand-glow text-2xl tracking-[0.2em] bg-brand-deep px-6 py-2 rounded-xl">
          {submissionResult?.password || 'XXXXXX'}
        </span>
        {copiedField === 'pass' && (
          <motion.span 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-[10px] font-bold text-emerald-500 mt-2 uppercase"
          >
            কপি করা হয়েছে (Copied)
          </motion.span>
        )}
      </div>
    </div>

    <div className="p-6 rounded-3xl bg-linear-to-br from-amber-50 to-orange-50 border border-amber-100 flex gap-4 text-left mb-10 shadow-sm">
      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm flex-shrink-0">
        <Lock className="w-6 h-6 text-amber-500" />
      </div>
      <div>
        <h4 className="text-sm font-black text-amber-900 mb-1">পাসওয়ার্ডটি অবশ্যই সংরক্ষণ করুন!</h4>
        <p className="text-[11px] text-amber-800 font-medium leading-relaxed">
          আপনার আবেদনের অবস্থা (Pending, Approved, বা Rejected) জানতে এই আইডি এবং পাসওয়ার্ডটি অত্যন্ত জরুরি। হোমপেজের <span className="underline font-bold">"হিস্টোরি"</span> সেকশনে গিয়ে আপনি যেকোনো সময় আপনার আবেদনের বর্তমান আপডেট দেখতে পারবেন।
        </p>
      </div>
    </div>

    <div className="flex flex-col sm:flex-row gap-4">
      <button 
        onClick={() => {
          const text = `ShopVerse Application Details:\nID: ${submissionResult?.displayId}\nPassword: ${submissionResult?.password}`;
          onCopy(text, 'all');
        }}
        className="flex-1 bg-white border-2 border-brand-blue text-brand-blue px-10 py-5 rounded-2xl font-display font-black tracking-tight hover:bg-brand-blue/5 transition-all active:scale-95 flex items-center justify-center gap-2"
      >
        {copiedField === 'all' ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
        সব তথ্য কপি করুন
      </button>
      <button 
        onClick={onBackHome}
        className="flex-1 bg-brand-deep text-white px-10 py-5 rounded-2xl font-display font-black tracking-tight hover:bg-brand-blue transition-all active:scale-95 shadow-xl shadow-brand-deep/20"
      >
        হোমে ফিরে যান
      </button>
    </div>
  </motion.div>
);
