import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, CheckCircle2, Globe, Users, BarChart3, Clock } from 'lucide-react';

export const TrustSection = () => (
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
              { t: 'কোন ফি নেই', d: '১০০% ফ্রি আবেদন প্রক্রিয়া' },
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
