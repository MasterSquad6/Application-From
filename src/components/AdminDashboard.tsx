import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  BarChart3, 
  Clock, 
  Search, 
  X, 
  ArrowLeft, 
  CheckCircle2, 
  Loader2, 
  FileText, 
  Phone, 
  Mail, 
  Briefcase, 
  Star, 
  MessageCircle, 
  BriefcaseIcon,
  ShieldCheck,
  TrendingUp,
  Fingerprint
} from 'lucide-react';
import { ApplicationStatus } from '../types';

interface AdminDashboardProps {
  applicants: ApplicationStatus[];
  stats: { cs_admin_vacancies: number; va_vacancies: number; hired_count: number } | null;
  onClose: () => void;
  onUpdateStatus: (id: string, status: string, note: string) => Promise<void>;
  onUpdateStats: (stats: any) => Promise<void>;
  refreshData: () => Promise<void>;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ 
  applicants, 
  stats, 
  onClose, 
  onUpdateStatus, 
  onUpdateStats,
  refreshData 
}) => {
  const [selectedApp, setSelectedApp] = useState<any>(null);
  const [updating, setUpdating] = useState(false);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'applications' | 'settings'>('applications');
  
  // Settings State
  const [editStats, setEditStats] = useState(stats || { cs_admin_vacancies: 0, va_vacancies: 0, hired_count: 0 });

  const getStatusColor = (s: string) => {
    switch(s) {
      case 'hired': return 'bg-emerald-500';
      case 'interview': return 'bg-brand-blue';
      case 'rejected': return 'bg-red-500';
      default: return 'bg-amber-500';
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-300 font-sans selection:bg-brand-glow selection:text-brand-deep">
      {/* Sidebar */}
      <div className="fixed left-0 top-0 bottom-0 w-24 bg-slate-950 border-r border-white/5 flex flex-col items-center py-10 gap-10">
        <div className="w-12 h-12 rounded-2xl bg-brand-deep flex items-center justify-center shadow-2xl shadow-brand-blue/20">
          <ShieldCheck className="text-white w-6 h-6" />
        </div>
        
        <div className="flex flex-col gap-6">
          <button 
            onClick={() => setActiveTab('applications')}
            className={`p-4 rounded-2xl transition-all ${activeTab === 'applications' ? 'bg-brand-blue/20 text-brand-blue' : 'hover:bg-white/5'}`}
          >
            <Users className="w-6 h-6" />
          </button>
          <button 
            onClick={() => setActiveTab('settings')}
            className={`p-4 rounded-2xl transition-all ${activeTab === 'settings' ? 'bg-brand-blue/20 text-brand-blue' : 'hover:bg-white/5'}`}
          >
            <BarChart3 className="w-6 h-6" />
          </button>
        </div>

        <button onClick={onClose} className="mt-auto p-4 rounded-2xl hover:bg-red-500/20 text-slate-500 hover:text-red-500 transition-all">
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Main Content */}
      <div className="pl-32 pr-10 py-12">
        <header className="flex items-center justify-between mb-16">
          <div>
            <h1 className="font-display text-4xl font-black text-white tracking-tighter mb-2">এডমিন কন্ট্রোল সেন্টার</h1>
            <p className="text-slate-500 text-sm font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> 
              সিস্টেম লাইভ: {applicants.length} টি আবেদন
            </p>
          </div>

          <div className="flex items-center gap-4">
             <div className="bg-white/5 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-4">
                <div className="text-right">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">হায়ার্ড</p>
                   <p className="text-xl font-display font-black text-emerald-400">{stats?.hired_count || 0}</p>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="text-right">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">পেন্ডিং</p>
                   <p className="text-xl font-display font-black text-brand-glow">{applicants.filter(a => a.status === 'pending').length}</p>
                </div>
             </div>
          </div>
        </header>

        {activeTab === 'applications' ? (
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="xl:col-span-2 space-y-4">
               {applicants.map((app) => (
                 <motion.div 
                   key={app.id} 
                   layoutId={app.id}
                   onClick={() => setSelectedApp(app)}
                   className="bg-white/5 border border-white/5 rounded-3xl p-6 flex items-center gap-6 hover:bg-white/[0.08] hover:border-white/10 transition-all cursor-pointer group"
                 >
                   <div className="w-16 h-16 rounded-2xl bg-linear-to-br from-slate-800 to-slate-900 flex items-center justify-center text-2xl font-display font-black text-white group-hover:scale-110 transition-transform border border-white/10">
                     {app.fullName.charAt(0)}
                   </div>
                   <div className="flex-1">
                     <div className="flex items-center gap-3 mb-1">
                       <h3 className="font-display font-bold text-lg text-white tracking-tight">{app.fullName}</h3>
                       <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest text-white ${getStatusColor(app.status)}`}>
                         {app.status}
                       </span>
                     </div>
                     <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                       <span className="flex items-center gap-1.5"><Briefcase className="w-3 h-3" /> {app.position === 'cs_admin' ? 'CS অ্যাডমিন' : 'VA'}</span>
                       <span className="flex items-center gap-1.5"><Fingerprint className="w-3 h-3" /> {app.displayId}</span>
                     </div>
                   </div>
                   <div className="text-right">
                      <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-1">সাবমিটেড</p>
                      <p className="text-xs font-bold text-slate-400">
                        {app.submittedAt?.toDate ? app.submittedAt.toDate().toLocaleDateString('bn-BD') : 'N/A'}
                      </p>
                   </div>
                 </motion.div>
               ))}
            </div>
          </div>
        ) : (
          <div className="max-w-xl bg-white/5 border border-white/5 rounded-[40px] p-10">
             <h3 className="font-display text-2xl font-black text-white mb-8">সিস্টেম স্ট্যাটিসটিক্স</h3>
             <div className="space-y-6">
                {[
                  { label: 'CS অ্যাডমিন ভ্যাকেন্সি', key: 'cs_admin_vacancies' },
                  { label: 'VA পজিশন ভ্যাকেন্সি', key: 'va_vacancies' },
                  { label: 'মোট সফল নিয়োগ count', key: 'hired_count' }
                ].map((item) => (
                  <div key={item.key} className="space-y-2">
                    <label className="text-xs font-black text-slate-500 uppercase tracking-widest">{item.label}</label>
                    <input 
                      type="number" 
                      value={(editStats as any)[item.key]}
                      onChange={e => setEditStats(prev => ({ ...prev, [item.key]: parseInt(e.target.value) || 0 }))}
                      className="w-full bg-slate-950 border border-white/10 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:border-brand-blue transition-all"
                    />
                  </div>
                ))}
                
                <button 
                  onClick={async () => {
                    setUpdating(true);
                    try {
                      await onUpdateStats(editStats);
                      await refreshData();
                      alert('সেটিংস আপডেট সফল হয়েছে!');
                    } catch (err) {
                      alert('সেভ করতে সমস্যা হয়েছে।');
                    } finally {
                      setUpdating(false);
                    }
                  }}
                  className="w-full bg-brand-blue text-white py-5 rounded-2xl font-display font-black tracking-tight hover:bg-brand-glow transition-all flex items-center justify-center gap-2"
                >
                  {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : 'আপডেট সেভ করুন'}
                </button>
             </div>
          </div>
        )}
      </div>

      {/* App Details Overlay */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-[100] flex items-center justify-end p-6 pointer-events-none">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              onClick={() => setSelectedApp(null)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-md pointer-events-auto"
            />
            <motion.div
              initial={{ x: 600, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 600, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="relative w-full max-w-4xl h-full bg-slate-900 border-l border-white/10 shadow-3xl pointer-events-auto overflow-y-auto flex flex-col md:flex-row"
            >
              <div className="md:w-1/2 p-10 bg-slate-950/50 border-r border-white/5 space-y-10">
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-3xl bg-brand-deep flex items-center justify-center text-4xl font-display font-black text-white">
                    {selectedApp.fullName.charAt(0)}
                  </div>
                  <div>
                    <h2 className="text-3xl font-display font-black text-white tracking-tight mb-1">{selectedApp.fullName}</h2>
                    <p className="text-brand-glow font-bold text-sm tracking-widest uppercase">{selectedApp.position}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-8 pt-10 border-t border-white/5">
                  <div>
                    <p className="text-[10px] text-slate-500 font-black uppercase mb-3 tracking-widest">ব্যক্তিগত তথ্য</p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-sm font-bold text-slate-300">
                         <Phone className="w-4 h-4 text-slate-600" /> {selectedApp.phone}
                      </div>
                      <div className="flex items-center gap-3 text-sm font-bold text-slate-300">
                         <Mail className="w-4 h-4 text-slate-600" /> {selectedApp.email}
                      </div>
                      <div className="flex items-center gap-3 text-sm font-bold text-slate-300">
                         <Clock className="w-4 h-4 text-slate-600" /> {selectedApp.dob}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 font-black uppercase mb-3 tracking-widest">পেশাদারিত্ব</p>
                    <div className="space-y-4">
                      <div className="flex items-center gap-3 text-sm font-bold text-slate-300">
                         <BriefcaseIcon className="w-4 h-4 text-slate-600" /> {selectedApp.experience} (প্রাক্তন: {selectedApp.previousCompany || 'N/A'})
                      </div>
                      <div className="flex items-center gap-3 text-sm font-bold text-slate-300">
                         <TrendingUp className="w-4 h-4 text-slate-600" /> {selectedApp.salaryExpectation} টাকা
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-6 pt-10 border-t border-white/5">
                  {selectedApp.skills?.length > 0 && (
                    <div>
                      <p className="text-[10px] text-slate-500 font-black uppercase mb-3 tracking-widest">স্কিলস</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedApp.skills.map((t: string) => (
                          <span key={t} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-[10px] font-bold text-slate-400 capitalize">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div>
                    <p className="text-[10px] text-slate-500 font-black uppercase mb-3 tracking-widest">ডকুমেন্টস</p>
                    <div className="grid grid-cols-3 gap-3">
                       {Object.entries(selectedApp.imageUrls || {}).map(([label, url]) => (
                         <div 
                           key={label} 
                           onClick={() => setLightboxUrl(url as string)}
                           className="group/img relative aspect-square rounded-2xl overflow-hidden bg-white/5 border border-white/10 cursor-zoom-in hover:border-brand-glow transition-all"
                         >
                           <img src={url as string} alt={label} className="w-full h-full object-cover grayscale group-hover/img:grayscale-0" />
                           <div className="absolute inset-0 bg-black/0 group-hover/img:bg-brand-glow/20 flex items-center justify-center transition-colors">
                             <Search className="w-5 h-5 text-white opacity-0 group-hover/img:opacity-100 scale-50 group-hover/img:scale-100 transition-all" />
                           </div>
                         </div>
                       ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="md:w-1/2 p-10 flex flex-col gap-8">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black text-brand-glow uppercase tracking-widest underline underline-offset-8">স্ট্যাটাস আপডেট</h4>
                  <button onClick={() => setSelectedApp(null)} className="text-slate-500 hover:text-white transition-colors"><ArrowLeft className="w-6 h-6" /></button>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-3">
                    {['pending', 'interview', 'hired', 'rejected'].map(s => (
                      <button 
                        key={s}
                        onClick={() => {
                          const updated = {...selectedApp, status: s};
                          setSelectedApp(updated);
                        }}
                        className={`px-4 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                          selectedApp.status === s ? 'bg-brand-blue text-white shadow-xl scale-105' : 'bg-slate-950 text-slate-600 hover:text-slate-400 border border-white/5'
                        }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>

                  <div className="space-y-4 pt-4">
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest block">এডমিন কনফিডেনশিয়াল নোট</label>
                    <textarea 
                      value={selectedApp.adminNote || ''}
                      onChange={e => setSelectedApp({...selectedApp, adminNote: e.target.value})}
                      placeholder="আবেদন সম্পর্কে আপনার মতামত লিখুন..."
                      className="w-full h-40 p-6 rounded-3xl bg-slate-950 border border-white/10 focus:bg-slate-950 focus:border-brand-blue outline-none text-sm font-medium resize-none transition-all text-slate-300"
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
                    className="w-full bg-brand-deep text-white py-5 rounded-3xl font-display font-black transition-all shadow-3xl shadow-brand-deep/20 flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {updating ? <Loader2 className="w-5 h-5 animate-spin" /> : <><CheckCircle2 className="w-6 h-6" /> পরিবর্তন সেভ করুন</>}
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
              className="absolute inset-0 bg-slate-950/95 backdrop-blur-lg"
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
                className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-3xl shadow-brand-glow/20 border border-white/10" 
              />
              <a 
                href={lightboxUrl} 
                target="_blank" 
                rel="noreferrer"
                className="mt-8 px-10 py-4 bg-brand-blue text-white rounded-2xl font-display font-black text-sm shadow-2xl flex items-center gap-2 transition-all hover:bg-brand-glow"
              >
                হাই কোয়ালিটি ইমেজ দেখুন <ArrowLeft className="w-4 h-4 rotate-180" />
              </a>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
