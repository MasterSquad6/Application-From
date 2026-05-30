import React from 'react';
import { motion } from 'motion/react';
import { FileText, Search, MessageCircle, CheckCircle2 } from 'lucide-react';

export const ProcessSection = () => (
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
