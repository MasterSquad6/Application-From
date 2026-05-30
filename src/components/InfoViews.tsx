import React from 'react';
import { motion } from 'motion/react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  FileText, 
  Users, 
  MessageCircle, 
  Globe, 
  Star, 
  Briefcase, 
  Award,
  Zap
} from 'lucide-react';

interface InfoViewProps {
  onBack: () => void;
}

const Layout: React.FC<{ title: string, bnTitle: string, children: React.ReactNode, onBack: () => void }> = ({ title, bnTitle, children, onBack }) => (
  <div className="min-h-screen bg-white">
    <div className="max-w-4xl mx-auto px-6 py-12 lg:py-24">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-500 hover:text-brand-blue font-bold text-sm mb-12 transition-all group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" /> ফিরে যান
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="prose prose-slate max-w-none"
      >
        <div className="mb-16">
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-brand-blue mb-4 block">{title}</span>
          <h1 className="font-display text-4xl lg:text-6xl font-black text-brand-deep tracking-tighter leading-tight">{bnTitle}</h1>
        </div>
        <div className="space-y-12">
          {children}
        </div>
      </motion.div>
    </div>
  </div>
);

export const AboutUs: React.FC<InfoViewProps> = ({ onBack }) => (
  <Layout title="About ShopVerse" bnTitle="আমাদের সম্পর্কে" onBack={onBack}>
    <section className="space-y-6">
      <p className="text-xl text-slate-600 leading-relaxed font-medium">
        ShopVerse একটি আধুনিক ই-কমার্স ক্যারিয়ার সলিউশন প্ল্যাটফর্ম। আমরা বিশ্বাস করি যে একটি দক্ষ টিমই পারে একটি বিজনেসকে অনন্য উচ্চতায় নিয়ে যেতে। আমাদের যাত্রা শুরু হয়েছে ই-কমার্স ইন্ডাস্ট্রিতে দক্ষ জনবল এবং সঠিক কর্মসংস্থানের মধ্যে একটি সেতুবন্ধন তৈরির লক্ষ্য নিয়ে।
      </p>
      
      <div className="grid md:grid-cols-2 gap-8 my-12">
        <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100">
           <Globe className="w-10 h-10 text-brand-blue mb-6" />
           <h3 className="text-xl font-bold text-brand-deep mb-2">গ্লোবাল ভিশন</h3>
           <p className="text-sm text-slate-500 font-medium">আমরা বিশ্বের বিভিন্ন প্রান্তের ই-কমার্স প্ল্যাটফর্মের সাথে কাজ করছি এবং দেশীয় ট্যালেন্টকে গ্লোবাল মার্কেটে পরিচিত করছি।</p>
        </div>
        <div className="p-8 rounded-3xl bg-brand-blue/5 border border-brand-blue/10">
           <Award className="w-10 h-10 text-brand-blue mb-6" />
           <h3 className="text-xl font-bold text-brand-deep mb-2">বিশ্বাসযোগ্যতা</h3>
           <p className="text-sm text-slate-500 font-medium">গত কয়েক বছরে আমরা ৩০টিরও বেশি প্রতিষ্ঠিত কোম্পানির সাথে কাজ করেছি এবং শত শত সফল নিয়োগ সম্পন্ন করেছি।</p>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-brand-deep">কেন আমরা অনন্য?</h2>
      <p className="text-slate-600 leading-relaxed font-medium">
        ShopVerse কোনো সাধারণ রিক্রুটমেন্ট ফার্ম নয়। আমরা ই-কমার্সের গভীর থেকে রিক্রুটমেন্ট প্রসেস পরিচালনা করি। বর্তমানে আমরা **৩০টিরও বেশি শীর্ষস্থানীয় ই-কমার্স এবং রিটেইল ব্র্যান্ডের** অফিশিয়াল রিক্রুটমেন্ট পার্টনার হিসেবে কাজ করছি। আমাদের প্রতিটি নিয়োগ প্রক্রিয়া শতভাগ ফ্রি এবং মেধাভিত্তিক।
      </p>
      <ul className="space-y-4">
        {['সরাসরি ইন্ডাস্ট্রি কানেকশন', 'দক্ষতা ভিত্তিক বাছাই', 'ক্যারিয়ার গ্রোথ সাপোর্ট', 'সম্পূর্ণ ডিজিটাল রিক্রুটমেন্ট'].map((item, i) => (
          <li key={i} className="flex items-center gap-3 font-bold text-slate-700">
            <Zap className="w-5 h-5 text-brand-glow" /> {item}
          </li>
        ))}
      </ul>
    </section>
  </Layout>
);

export const CareerDesk: React.FC<InfoViewProps> = ({ onBack }) => (
  <Layout title="Career Desk" bnTitle="ক্যারিয়ার ডেস্ক" onBack={onBack}>
    <section className="space-y-8">
      <p className="text-xl text-slate-600 leading-relaxed font-medium">
        ShopVerse ক্যারিয়ার ডেস্ক মূলত তাদের জন্য যারা ই-কমার্স সেক্টরে নিজেদের ক্যারিয়ার গড়তে আগ্রহী। আমরা শুধু জব দিচ্ছি না, আমরা আপনাকে একটি পেশাদার ক্যারিয়ার পাথ তৈরি করতে সাহায্য করছি।
      </p>

      <div className="p-10 rounded-[40px] bg-linear-to-br from-brand-deep to-slate-900 text-white">
        <h3 className="text-2xl font-bold mb-4">ভবিষ্যতের প্রস্ততি</h3>
        <p className="text-slate-400 mb-8 font-medium">ই-কমার্স সেক্টরে এখনকার চাহিদা অনুযায়ী আমরা মূলত দুটি প্রধান রোলে নিয়োগ দিয়ে থাকি:</p>
        <div className="grid sm:grid-cols-2 gap-6">
           <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
              <h4 className="text-brand-glow font-black mb-2">CS অ্যাডমিন</h4>
              <p className="text-xs text-slate-300">কাস্টমার রিলেশন এবং অর্ডার ম্যানেজমেন্টের জন্য দক্ষ টিম লিডার বা এক্সিকিউটিভ হিসেবে ক্যারিয়ার গড়ার সুযোগ।</p>
           </div>
           <div className="bg-white/10 p-6 rounded-2xl border border-white/10">
              <h4 className="text-brand-glow font-black mb-2">ভার্চুয়াল অ্যাসিস্ট্যান্ট (VA)</h4>
              <p className="text-xs text-slate-300">অ্যাডমিনিস্ট্রেটিভ কাজ, ডাটা এন্ট্রি এবং টেকনিক্যাল সাপোর্টের মাধ্যমে বিজনেসের প্রতিটি ধাপ মসৃণ রাখার দায়িত্ব।</p>
           </div>
        </div>
      </div>

      <h2 className="text-2xl font-bold text-brand-deep">আমাদের রিক্রুটমেন্ট ইকোসিস্টেম</h2>
      <p className="text-slate-600 leading-relaxed font-medium">
        আমরা বর্তমানে **৩০টিরও বেশি পার্টনার কোম্পানিকে** সাপোর্ট দিচ্ছি যারা নিয়মিত তাদের টিমে নতুন মেধা খুঁজছে। আপনি যখন আমাদের পোর্টালে আবেদন করছেন, তখন আপনার প্রোফাইলটি একাধিক বিশ্বস্ত কোম্পানির কাছে পৌঁছানোর সুযোগ তৈরি হচ্ছে। 
      </p>
    </section>
  </Layout>
);

export const PrivacyPolicy: React.FC<InfoViewProps> = ({ onBack }) => (
  <Layout title="Privacy Policy" bnTitle="গোপনীয়তা নীতি" onBack={onBack}>
    <section className="space-y-6 text-slate-600 font-medium">
      <p className="text-lg">ShopVerse আপনার তথ্যের গোপনীয়তাকে সর্বোচ্চ গুরুত্ব দেয়। আমাদের এই প্ল্যাটফর্মটি ব্যবহারের সময় আপনার যেসব তথ্য আমরা সংগ্রহ করি এবং তা যেভাবে সুরক্ষিত রাখি, নিচে তা বিস্তারিত জানানো হলো:</p>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-xl font-bold text-brand-deep mb-3 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-brand-blue" /> ১. তথ্য সংগ্রহ
          </h3>
          <p>আমরা আপনার নাম, ফোন নম্বর, ইমেইল, জন্ম তারিখ এবং আপনার আপলোড করা সিভি বা ডক্যুমেন্টসমূহ সংগ্রহ করি শুধুমাত্র নিয়োগ প্রক্রিয়ার স্বার্থে।</p>
        </div>

        <div>
          <h3 className="text-xl font-bold text-brand-deep mb-3 flex items-center gap-2">
            <Users className="w-5 h-5 text-brand-blue" /> ২. তথ্যের ব্যবহার
          </h3>
          <p>আপনার তথ্যসমূহ শুধুমাত্র আমাদের রিক্রুটমেন্ট টিম এবং যেসব কোম্পানিতে আপনি আবেদনের জন্য উপযুক্ত হতে পারেন, তাদের সাথে শেয়ার করা হয়। কোনো প্রকার থার্ড-পার্টি প্রমোশন বা মার্কেটিং কাজে আপনার তথ্য বিক্রি করা হয় না।</p>
        </div>

        <div>
          <h3 className="text-xl font-bold text-brand-deep mb-3 flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-blue" /> ৩. সিকিউরিটি
          </h3>
          <p>আমাদের ডেটাবেজ অত্যন্ত উন্নত মানের সিকিউরিটি প্রোটোকল মেনে পরিচালনা করা হয়। আপনার আবেদনের জন্য যে পাসওয়ার্ডটি দেওয়া হয়, সেটি আপনার আইডেন্টিটি সুরক্ষিত রাখার একটি মাধ্যম।</p>
        </div>
      </div>
    </section>
  </Layout>
);

export const TermsConditions: React.FC<InfoViewProps> = ({ onBack }) => (
  <Layout title="Terms & Conditions" bnTitle="শর্তাবলী" onBack={onBack}>
    <section className="space-y-6 text-slate-600 font-medium">
      <p>ShopVerse রিক্রুটমেন্ট পোর্টালে আবেদন করার মাধ্যমে আপনি নিম্নলিখিত শর্তাবলীতে সম্মত হচ্ছেন:</p>
      
      <div className="space-y-6">
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100 italic">
          "আমরা কোনোভাবেই কোনো প্রকার আবেদন ফি গ্রহণ করি না। কেউ যদি সরাসরি বা পরোক্ষভাবে ShopVerse এর নামে টাকা দাবি করে, তবে তার দায়ভার কোম্পানি বহন করবে না।"
        </div>
        
        <ol className="list-decimal pl-6 space-y-4">
          <li>আবেদনে প্রদত্ত সকল তথ্য সঠিক এবং সত্য হতে হবে। কোনো ভুল তথ্য প্রমাণিত হলে আবেদনটি বাতিল করা হবে।</li>
          <li>আবেদন আইডি এবং পাসওয়ার্ড আপনার নিজের দায়িত্বে সংরক্ষণ করতে হবে।</li>
          <li>আমরা ৩০টিরও বেশি কোম্পানির জন্য লোক নিয়োগ দিচ্ছি, তাই আপনার উপযুক্ততা অনুযায়ী যেকোনো একটিতে আপনাকে রেফার করা হতে পারে।</li>
          <li>নির্বাচন প্রক্রিয়ার সকল চূড়ান্ত সিদ্ধান্ত ShopVerse অ্যাডমিন প্যানেল সংরক্ষণ করে।</li>
        </ol>
      </div>
    </section>
  </Layout>
);

export const SupportPortal: React.FC<InfoViewProps> = ({ onBack }) => (
  <Layout title="Support Portal" bnTitle="সাপোর্ট পোর্টাল" onBack={onBack}>
    <section className="space-y-8">
      <div className="text-center p-12 rounded-[40px] bg-slate-50 border border-slate-100 flex flex-col items-center">
         <div className="w-20 h-20 rounded-full bg-brand-blue/10 flex items-center justify-center text-brand-blue mb-6">
            <MessageCircle className="w-10 h-10" />
         </div>
         <h2 className="text-2xl font-bold text-brand-deep mb-4 uppercase tracking-tight">আপনার সাহায্য কি প্রয়োজন?</h2>
         <p className="text-slate-500 font-medium max-w-md">আপনার আবেদনের আইডি হারিয়ে গেলে বা অ্যাপ্লিকেশন সংক্রান্ত কোনো সমস্যা হলে আমাদের সাপোর্ট টিমের সাথে কথা বলুন।</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-8">
        <div className="p-8 rounded-3xl border-2 border-slate-100 hover:border-brand-blue/30 transition-all">
           <h4 className="font-bold text-brand-deep mb-4">সরাসরি যোগাযোগ</h4>
           <div className="space-y-4">
              <p className="flex items-center gap-3 text-sm font-bold text-slate-600"><Star className="w-4 h-4 text-brand-glow" /> ফেইসবুক পেজ ইনবক্স</p>
              <p className="flex items-center gap-3 text-sm font-bold text-slate-600"><Star className="w-4 h-4 text-brand-glow" /> হোয়াটসঅ্যাপ হেল্পলাইন (সকাল ১০ - রাত ৮)</p>
           </div>
        </div>
        <div className="p-8 rounded-3xl border-2 border-slate-100 hover:border-brand-blue/30 transition-all">
           <h4 className="font-bold text-brand-deep mb-4">কারিগরি সমস্যা?</h4>
           <p className="text-xs text-slate-400 font-medium leading-relaxed">
             যদি ওয়েবসাইটে ফাইল আপলোড করতে সমস্যা হয় বা ‘আবেদন সাবমিট’ বাটন কাজ না করে, তবে ব্রাউজার ক্যাশ ক্লিয়ার করে পুনরায় চেষ্টা করুন। এরপরও সমস্যা থাকলে আমাদের জানান।
           </p>
        </div>
      </div>
    </section>
  </Layout>
);
