import React from 'react';
import { motion } from 'motion/react';
import { Star, ShieldCheck, TrendingUp } from 'lucide-react';

export const ValuesSection = () => (
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
