/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  Clock, 
  Users, 
  CheckCircle2, 
  X, 
  MessageCircle, 
  ShieldCheck, 
  Building2, 
  Zap, 
  Star,
  Search,
  Lock,
  History
} from 'lucide-react';
import { ApplicationStatus } from '../types';

interface StatusViewProps {
  currentApp: ApplicationStatus;
  onBack: () => void;
}

export const StatusView: React.FC<StatusViewProps> = ({ currentApp, onBack }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'hired':
        return {
          icon: CheckCircle2,
          color: 'bg-emerald-500',
          textColor: 'text-emerald-600',
          borderColor: 'border-emerald-500',
          bgColor: 'bg-emerald-50',
          label: 'নিযুক্ত (Hired)',
          description: 'অভিনন্দন! আপনি আমাদের টিমে সফলভাবে নিয়োগপ্রাপ্ত হয়েছেন।'
        };
      case 'interview':
        return {
          icon: Users,
          color: 'bg-brand-blue',
          textColor: 'text-brand-blue',
          borderColor: 'border-brand-blue',
          bgColor: 'bg-brand-blue/5',
          label: 'ইন্টারভিউ (Interview)',
          description: 'আমাদের HR টিম আপনার প্রোফাইল পছন্দ করেছে। শীঘ্রই ইন্টারভিউয়ের জন্য যোগাযোগ করা হবে।'
        };
      case 'rejected':
        return {
          icon: X,
          color: 'bg-red-500',
          textColor: 'text-red-600',
          borderColor: 'border-red-500',
          bgColor: 'bg-red-50',
          label: 'অনুমোদিত নয় (Rejected)',
          description: 'দুঃখিত, এই মুহূর্তে আপনার প্রোফাইলটি আমাদের প্রয়োজনের সাথে সামঞ্জস্যপূর্ণ নয়।'
        };
      default:
        return {
          icon: Clock,
          color: 'bg-amber-500',
          textColor: 'text-amber-600',
          borderColor: 'border-amber-500',
          bgColor: 'bg-amber-50',
          label: 'পেন্ডিং (Pending)',
          description: 'আপনার আবেদনটি বর্তমানে আমাদের HR রিক্রুটমেন্ট টিম গুরুত্ব সহকারে পর্যালোচনা করছে।'
        };
    }
  };

  const config = getStatusConfig(currentApp.status);
  const StatusIcon = config.icon;

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl w-full"
      >
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-brand-blue font-bold text-sm mb-6 transition-all group lg:mb-10"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> ফিরে যান
        </button>

        <div className="bg-white rounded-[40px] shadow-premium overflow-hidden border border-white grid lg:grid-cols-5">
          {/* Main Status Panel */}
          <div className="lg:col-span-3 p-8 md:p-12 border-b lg:border-b-0 lg:border-r border-slate-50">
            <div className="flex flex-col items-center text-center">
              <motion.div 
                initial={{ rotate: -10, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                transition={{ type: "spring", damping: 12 }}
                className={`w-24 h-24 rounded-[32px] flex items-center justify-center text-white shadow-2xl mb-8 ${config.color} shadow-${config.color.split('-')[1]}/30`}
              >
                <StatusIcon className="w-12 h-12" />
              </motion.div>
              
              <h2 className="font-display text-3xl font-black text-brand-deep tracking-tighter mb-4">
                আবেদনের বর্তমান অবস্থা
              </h2>
              
              <div className="flex items-center gap-2 mb-8">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">আবেদন আইডি:</span>
                <span className="font-mono font-bold text-brand-blue bg-brand-blue/5 px-4 py-1.5 rounded-full text-sm">
                  {currentApp.displayId}
                </span>
              </div>

              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`inline-flex items-center gap-3 px-10 py-5 rounded-2xl border-2 font-bold mb-8 transition-all ${config.borderColor} ${config.bgColor} ${config.textColor}`}
              >
                <div className={`w-3 h-3 rounded-full animate-ping ${config.color}`} />
                <span className="uppercase tracking-[0.2em]">{config.label}</span>
              </motion.div>

              <div className="w-full text-left p-8 rounded-3xl bg-slate-50 border border-slate-100 mb-10 relative group">
                <div className="absolute -top-3 left-6 px-3 py-1 bg-white border border-slate-100 rounded-lg text-[9px] font-black uppercase text-slate-400 tracking-widest shadow-sm">
                  অফিশিয়াল রিক্রুটমেন্ট মেসেজ (Official Update)
                </div>
                <div className="space-y-4">
                  <p className="text-slate-700 font-bold leading-relaxed text-sm md:text-base">
                    "{currentApp.adminNote || 'আপনার আবেদনটি আমাদের ডেটাবেজে সফলভাবে সংরক্ষিত হয়েছে। আমাদের অভিজ্ঞ HR টিম এবং ডেডিকেটেড রিক্রুটমেন্ট প্যানেল আপনার প্রোফাইলটি অত্যন্ত গাম্ভীর্যের সাথে যাচাই করছে।'}"
                  </p>
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed">
                    মনে রাখবেন, ShopVerse বর্তমানে **৩০টিরও বেশি শীর্ষস্থানীয় ই-কমার্স ও গ্লোবাল ব্র্যান্ডের** অফিশিয়াল রিক্রুটমেন্ট পার্টনার হিসেবে কাজ করছে। আমরা আপনার ক্যাশ বা কোনো প্রকার ফি দাবি করি না—আমাদের নিয়োগ প্রক্রিয়া সম্পূর্ণ মেধাভিত্তিক এবং স্বচ্ছ।
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                 <div className="p-5 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center gap-4">
                    <ShieldCheck className="w-6 h-6 text-emerald-500 shrink-0" />
                    <div className="text-left">
                       <p className="text-[9px] font-black text-emerald-700 uppercase tracking-widest leading-none mb-1">নিরাপত্তা</p>
                       <p className="text-[11px] font-bold text-emerald-600">আপনার তথ্য সুরক্ষিত</p>
                    </div>
                 </div>
                 <div className="p-5 rounded-2xl bg-brand-blue/5 border border-brand-blue/10 flex items-center gap-4">
                    <Building2 className="w-6 h-6 text-brand-blue shrink-0" />
                    <div className="text-left">
                       <p className="text-[9px] font-black text-brand-blue uppercase tracking-widest leading-none mb-1">ডায়রেক্ট</p>
                       <p className="text-[11px] font-bold text-brand-blue">৩০+ কোম্পানির পার্টনার</p>
                    </div>
                 </div>
              </div>
            </div>
          </div>

          {/* Info Side Panel */}
          <div className="lg:col-span-2 bg-slate-50/50 p-8 md:p-10 flex flex-col justify-center">
            <div className="mb-10 text-center lg:text-left">
               <h4 className="font-display font-black text-xl text-brand-deep mb-4 tracking-tight">কেন ShopVerse?</h4>
               <p className="text-slate-500 text-xs font-medium leading-relaxed">
                 আমরা শুধুমাত্র একটি পোর্টাল নই, আমরা একটি প্রফেশনাল ইকোসিস্টেম। আমাদের সাথে যুক্ত হওয়া মানে আপনার ক্যারিয়ারকে অন্য উচ্চতায় নিয়ে যাওয়া।
               </p>
            </div>

            <div className="space-y-6">
              {[
                { icon: Zap, t: 'দ্রুত বাছাই প্রক্রিয়া', d: 'আমাদের HR টিম সর্বোচ্চ ৭২ ঘণ্টার মধ্যে প্রসেস শুরু করে।' },
                { icon: Building2, t: '৩০+ পার্টনার কোম্পানি', d: 'আমরা প্রতিষ্ঠিত ৩০টির বেশি ব্র্যান্ডের হয়ে নিয়োগ দিচ্ছি।' },
                { icon: Star, t: 'সরাসরি পার্টনার নেটওয়ার্ক', d: 'আপনার প্রোফাইল সরাসরি সিদ্ধান্ত গ্রহণকারীদের কাছে পৌঁছায়।' },
                { icon: History, t: 'লাইভ স্ট্যাটাস ট্র্যাকিং', d: 'আবেদনের প্রতিটি ধাপ আপনি লাইভ দেখতে পারবেন।' }
              ].map((item, i) => (
                <motion.div 
                  initial={{ x: 20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="flex gap-4 group"
                >
                  <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-brand-blue shrink-0 group-hover:bg-brand-blue group-hover:text-white transition-all">
                    <item.icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-[13px] font-bold text-brand-deep mb-1">{item.t}</h5>
                    <p className="text-[11px] text-slate-400 font-medium leading-tight">{item.d}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-12 p-6 rounded-3xl bg-linear-to-br from-brand-deep to-slate-800 text-white relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-brand-blue/10 blur-2xl -z-10 group-hover:scale-150 transition-transform duration-700" />
               <p className="text-[10px] font-black uppercase tracking-widest text-brand-glow mb-2">জরুরি সাপোর্ট</p>
               <p className="text-xs font-medium text-slate-300 leading-relaxed mb-4">
                 আবেদন সংক্রান্ত কোনো সাহায্য প্রয়োজন? আমাদের ফেইসবুক পেজে মেসেজ দিন।
               </p>
               <button className="flex items-center gap-2 text-[11px] font-black uppercase tracking-widest text-white group-hover:text-brand-glow transition-colors">
                 ইনবক্স করুন <MessageCircle className="w-4 h-4" />
               </button>
            </div>
            
            <button 
              onClick={onBack}
              className="mt-10 w-full bg-white text-slate-500 py-4 rounded-2xl font-bold text-xs hover:bg-slate-100 transition-all shadow-sm border border-slate-100 uppercase tracking-widest"
            >
              ট্র্যাকিং থেকে বের হোন
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
