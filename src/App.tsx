import React, { useState, useEffect, useRef } from 'react';
import { 
  Camera, 
  Upload, 
  History, 
  MessageSquare, 
  LayoutDashboard, 
  Leaf, 
  Sun, 
  Moon, 
  ChevronRight, 
  AlertCircle, 
  CheckCircle2, 
  Download,
  X,
  Loader2,
  ArrowLeft,
  Scan,
  Bell,
  LogOut,
  Edit2,
  Send,
  Zap,
  Droplets,
  Wind,
  ShieldCheck,
  TrendingUp,
  Award,
  Sprout
} from 'lucide-react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { predictPlantDisease, PredictionResult, chatWithAssistant } from './services/geminiService';
import { format } from 'date-fns';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import toast, { Toaster } from 'react-hot-toast';
import axios from 'axios';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';

// --- Components ---

const LivingForestBackground = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const y2 = useTransform(scrollY, [0, 500], [0, -150]);

  return (
    <>
      <motion.div style={{ y: y1 }} className="forest-bg" />
      <div className="forest-overlay" />
      <div className="sun-rays" />
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-[-1]">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="particle"
            initial={{ 
              x: Math.random() * window.innerWidth, 
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{ 
              y: [null, Math.random() * -100 - 50],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              duration: Math.random() * 10 + 10, 
              repeat: Infinity,
              ease: "linear"
            }}
            style={{ 
              width: Math.random() * 10 + 5 + 'px', 
              height: Math.random() * 10 + 5 + 'px' 
            }}
          />
        ))}
      </div>
    </>
  );
};

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-cream z-[100] flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="flex flex-col items-center gap-4"
      >
        <div className="relative">
          <Leaf className="w-24 h-24 text-primary" />
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="absolute -bottom-12 left-1/2 -translate-x-1/2"
          >
            <h1 className="text-4xl font-display font-black tracking-tighter text-primary">LeafLens</h1>
          </motion.div>
        </div>
      </motion.div>
      
      <div className="absolute bottom-20 w-48 h-1 bg-slate-200 rounded-full overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 2, ease: "easeInOut" }}
          className="h-full bg-primary"
        />
      </div>
    </motion.div>
  );
};

const Onboarding = ({ onComplete }: { onComplete: () => void }) => {
  const [step, setStep] = useState(0);
  const content = [
    {
      title: "SCAN TO DISCOVER",
      description: "Open up a world of possibilities for your plants.",
      icon: Scan
    },
    {
      title: "AI DIAGNOSIS",
      description: "Get instant results for over 38+ plant diseases.",
      icon: LayoutDashboard
    }
  ];

  return (
    <div className="fixed inset-0 bg-cream z-[90] flex flex-col p-8">
      <div className="flex-1 flex flex-col items-center justify-center gap-12">
        <motion.div 
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative w-64 h-64 bg-white rounded-3xl shadow-xl flex items-center justify-center overflow-hidden"
        >
          <div className="absolute inset-4 border-2 border-primary/20 rounded-2xl border-dashed" />
          <div className="scan-line" />
          <Leaf className="w-32 h-32 text-primary/40" />
          <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
          <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
          <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
          <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
        </motion.div>

        <div className="text-center space-y-4 max-w-xs">
          <motion.h2 
            key={`t-${step}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-2xl font-display font-black text-primary"
          >
            {content[step].title}
          </motion.h2>
          <motion.p 
            key={`d-${step}`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-slate-500"
          >
            {content[step].description}
          </motion.p>
        </div>

        <div className="flex gap-2">
          {content.map((_, i) => (
            <div key={i} className={`w-2 h-2 rounded-full transition-all ${step === i ? 'w-6 bg-primary' : 'bg-slate-300'}`} />
          ))}
        </div>
      </div>

      <button 
        onClick={() => step < content.length - 1 ? setStep(step + 1) : onComplete()}
        className="btn-primary w-full"
      >
        {step === content.length - 1 ? "Get Started" : "Next"}
      </button>
    </div>
  );
};

const Navbar = ({ activeTab, setActiveTab, onProfileClick, userName, darkMode, setDarkMode, isNotificationOpen, setIsNotificationOpen, notifications, setNotifications }: any) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'scan', label: 'Scan & Diagnose', icon: Scan },
    { id: 'history', label: 'History', icon: History },
    { id: 'chat', label: 'Assistant', icon: MessageSquare },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] glass-card !rounded-none border-b border-white/10 px-6 py-4">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
              <Leaf className="w-6 h-6 text-white" />
            </div>
            <span className="font-display font-black text-2xl tracking-tighter text-primary">LeafLens</span>
          </div>

          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  activeTab === item.id 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl glass-card hover:scale-110 transition-transform"
          >
            {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              className="p-2.5 rounded-xl glass-card hover:scale-110 transition-transform relative"
            >
              <Bell className={`w-5 h-5 ${notifications.some(n => !n.read) ? 'text-accent' : 'text-slate-500'}`} />
              {notifications.some(n => !n.read) && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-white dark:border-slate-900 animate-pulse" />
              )}
            </button>

            <AnimatePresence>
              {isNotificationOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute top-full right-0 mt-4 w-80 glass-card rounded-3xl overflow-hidden shadow-2xl z-[110]"
                >
                  <div className="p-6 border-b border-white/10 bg-forest-deep/20">
                    <h4 className="font-display font-black text-primary">Forest Alerts</h4>
                  </div>
                  <div className="max-h-96 overflow-y-auto p-4 space-y-2 no-scrollbar">
                    {notifications.map((n, i) => (
                      <motion.div
                        key={n.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        onClick={() => {
                          setNotifications(prev => prev.map(notif => notif.id === n.id ? { ...notif, read: true } : notif));
                          setIsNotificationOpen(false);
                        }}
                        className="p-4 rounded-2xl hover:bg-white/5 transition-all cursor-pointer group flex items-start gap-3"
                      >
                        <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${
                          n.type === 'success' ? 'bg-accent' : 
                          n.type === 'warning' ? 'bg-amber-500' : 
                          n.type === 'error' ? 'bg-rose-500' : 'bg-blue-500'
                        }`} />
                        <p className="text-sm font-medium text-slate-400 group-hover:text-primary transition-colors">{n.text}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2" />

          <button 
            onClick={onProfileClick}
            className="flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-xl glass-card hover:scale-105 transition-transform"
          >
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-sm">
              {userName.charAt(0).toUpperCase()}
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-black text-primary leading-none">{userName}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Pro Member</p>
            </div>
          </button>
        </div>
      </div>
    </nav>
  );
};

const Footer = ({ onPrivacy, onTerms, onContact }: any) => (
  <footer className="mt-20 py-12 border-t border-slate-200 dark:border-slate-800">
    <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="flex items-center gap-2">
        <Leaf className="w-6 h-6 text-primary" />
        <span className="font-display font-black text-xl tracking-tighter text-primary">LeafLens</span>
      </div>
      <div className="flex gap-8 text-sm font-bold text-slate-400">
        <button onClick={onPrivacy} className="hover:text-primary transition-colors">Privacy Policy</button>
        <button onClick={onTerms} className="hover:text-primary transition-colors">Terms of Service</button>
        <button onClick={onContact} className="hover:text-primary transition-colors">Contact Support</button>
      </div>
      <p className="text-sm text-slate-400">© 2026 LeafLens AI. All rights reserved.</p>
    </div>
  </footer>
);

const EcoReportOverlay = ({ isOpen, onClose, data }: any) => {
  if (!data) return null;
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-forest-deep/60 backdrop-blur-xl"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 50 }}
            className="relative w-full max-w-4xl glass-card rounded-[60px] p-12 overflow-hidden max-h-[90vh] overflow-y-auto no-scrollbar"
          >
            <button onClick={onClose} className="absolute top-10 right-10 p-4 bg-white/10 rounded-2xl hover:bg-white/20 transition-colors z-20">
              <X className="w-6 h-6 text-slate-400" />
            </button>

            <div className="relative z-10 space-y-12">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-accent rounded-3xl flex items-center justify-center shadow-2xl shadow-accent/20">
                  <TrendingUp className="w-10 h-10 text-white" />
                </div>
                <div>
                  <h2 className="text-5xl font-display font-black text-primary">Detailed Eco Analysis</h2>
                  <p className="text-slate-400 font-bold uppercase tracking-widest mt-2">Specimen: {data.plantName}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { label: "Health Score", val: `${data.confidence}%`, icon: Zap, color: "accent" },
                  { label: "Soil Quality", val: "Optimal", icon: Sprout, color: "blue-500" },
                  { label: "Climate Compatibility", val: "92%", icon: Wind, color: "moss" },
                  { label: "Disease Risk", val: data.diseaseName.includes('Healthy') ? 'Low' : 'High', icon: AlertCircle, color: "rose-500" }
                ].map((stat, i) => (
                  <div key={i} className="glass-card p-6 rounded-3xl space-y-4">
                    <stat.icon className={`w-8 h-8 text-${stat.color}`} />
                    <div>
                      <p className="text-3xl font-black text-primary">{stat.val}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-8">
                <h3 className="text-3xl font-display font-black text-primary">Historical Plant Health Trends</h3>
                <div className="h-64 w-full glass-card p-8 rounded-[40px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={[
                      { name: 'Jan', val: 45 }, { name: 'Feb', val: 52 }, { name: 'Mar', val: 48 },
                      { name: 'Apr', val: 65 }, { name: 'May', val: 72 }, { name: 'Jun', val: 88 }
                    ]}>
                      <Area type="monotone" dataKey="val" stroke="#8fb339" fill="#8fb339" fillOpacity={0.1} strokeWidth={4} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="glass-card p-10 rounded-[40px] space-y-6">
                  <h4 className="text-2xl font-display font-black text-primary">Soil Improvement Suggestions</h4>
                  <ul className="space-y-4">
                    <li className="flex gap-4 items-start">
                      <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center shrink-0 mt-1">
                        <CheckCircle2 className="w-4 h-4 text-accent" />
                      </div>
                      <p className="text-slate-400 font-medium">Increase organic matter by adding compost or well-rotted manure.</p>
                    </li>
                    <li className="flex gap-4 items-start">
                      <div className="w-6 h-6 bg-accent/20 rounded-full flex items-center justify-center shrink-0 mt-1">
                        <CheckCircle2 className="w-4 h-4 text-accent" />
                      </div>
                      <p className="text-slate-400 font-medium">Monitor pH levels regularly to maintain a slightly acidic environment.</p>
                    </li>
                  </ul>
                </div>
                <div className="glass-card p-10 rounded-[40px] flex flex-col items-center justify-center text-center space-y-6">
                  <div className="w-24 h-24 bg-accent/20 rounded-full flex items-center justify-center">
                    <Award className="w-12 h-12 text-accent" />
                  </div>
                  <div>
                    <h4 className="text-2xl font-display font-black text-primary">Sustainability Score</h4>
                    <p className="text-5xl font-black text-accent mt-2">A+</p>
                  </div>
                  <p className="text-slate-400 font-medium">Your garden is contributing significantly to local biodiversity.</p>
                </div>
              </div>

              <div className="flex gap-6 pt-8 border-t border-white/10">
                <button className="flex-1 py-6 rounded-3xl bg-accent text-white font-black text-xl shadow-2xl shadow-accent/20 hover:scale-[1.02] transition-transform flex items-center justify-center gap-3">
                  <Download className="w-6 h-6" /> Download PDF Report
                </button>
                <button onClick={onClose} className="flex-1 py-6 rounded-3xl glass-card font-black text-xl hover:bg-white/10 transition-all">
                  Close Analysis
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const PrivacyModal = ({ isOpen, onClose }: any) => {
  const [agreed, setAgreed] = useState(false);
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-forest-deep/60 backdrop-blur-md" />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-2xl glass-card rounded-[50px] p-12 overflow-hidden max-h-[80vh] flex flex-col">
            <h2 className="text-4xl font-display font-black text-primary mb-8">Privacy Policy</h2>
            <div className="flex-1 overflow-y-auto pr-4 space-y-8 no-scrollbar text-slate-400 font-medium leading-relaxed">
              <section className="space-y-4">
                <h3 className="text-xl font-black text-primary">Data Collection Policy</h3>
                <p>We collect botanical data and images provided during scans to improve our AI models and provide accurate diagnoses. Your personal data is encrypted and never shared with third parties.</p>
              </section>
              <section className="space-y-4">
                <h3 className="text-xl font-black text-primary">AI Model Usage Policy</h3>
                <p>Our neural networks process your images locally and on secure cloud servers. We use anonymized data to train the next generation of plant health specialists.</p>
              </section>
              <section className="space-y-4">
                <h3 className="text-xl font-black text-primary">Image Processing Rules</h3>
                <p>Images are stored temporarily for analysis. You can request the deletion of your scan history at any time through the profile settings.</p>
              </section>
            </div>
            <div className="mt-10 pt-8 border-t border-white/10 flex flex-col gap-6">
              <label className="flex items-center gap-4 cursor-pointer group">
                <div 
                  onClick={() => setAgreed(!agreed)}
                  className={`w-8 h-8 rounded-xl border-2 transition-all flex items-center justify-center ${agreed ? 'bg-accent border-accent' : 'border-white/20 group-hover:border-accent'}`}
                >
                  {agreed && <CheckCircle2 className="w-5 h-5 text-white" />}
                </div>
                <span className="font-bold text-primary">I Agree to Data Policy</span>
              </label>
              <button onClick={onClose} className="w-full py-5 rounded-2xl bg-accent text-white font-black shadow-xl disabled:opacity-50" disabled={!agreed}>
                Continue
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const TermsModal = ({ isOpen, onClose }: any) => {
  const [expanded, setExpanded] = useState<number | null>(null);
  const sections = [
    { title: "Usage Guidelines", content: "LeafLens is intended for educational and preliminary diagnostic purposes. Always consult with a local agricultural expert for critical decisions." },
    { title: "AI Accuracy Disclaimer", content: "While our AI is 98% accurate, nature is complex. Results should be verified with physical inspection." },
    { title: "Responsible Pesticide Usage", content: "We recommend organic solutions first. If using chemical pesticides, follow all safety instructions and local laws." }
  ];
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-forest-deep/60 backdrop-blur-md" />
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative w-full max-w-2xl glass-card rounded-[50px] p-12 overflow-hidden">
            <h2 className="text-4xl font-display font-black text-primary mb-8">Terms of Service</h2>
            <div className="space-y-4">
              {sections.map((s, i) => (
                <div key={i} className="glass-card rounded-3xl overflow-hidden">
                  <button 
                    onClick={() => setExpanded(expanded === i ? null : i)}
                    className="w-full p-6 flex items-center justify-between text-left hover:bg-white/5 transition-colors"
                  >
                    <span className="font-black text-primary">{s.title}</span>
                    <ChevronRight className={`w-5 h-5 text-accent transition-transform ${expanded === i ? 'rotate-90' : ''}`} />
                  </button>
                  <AnimatePresence>
                    {expanded === i && (
                      <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                        <div className="p-6 pt-0 text-slate-400 font-medium leading-relaxed">
                          {s.content}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
            <button onClick={onClose} className="w-full mt-10 py-5 rounded-2xl bg-accent text-white font-black shadow-xl">
              Close Terms
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ContactModal = ({ isOpen, onClose }: any) => {
  const [submitted, setSubmitted] = useState(false);
  const handleSubmit = (e: any) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      onClose();
    }, 2000);
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[130] flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-forest-deep/60 backdrop-blur-md" />
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 50 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 50 }} className="relative w-full max-w-xl glass-card rounded-[50px] p-12 overflow-hidden">
            {submitted ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center py-12 text-center space-y-6">
                <div className="w-24 h-24 bg-accent rounded-full flex items-center justify-center shadow-2xl shadow-accent/20">
                  <CheckCircle2 className="w-12 h-12 text-white" />
                </div>
                <h3 className="text-3xl font-display font-black text-primary">Message Sent</h3>
                <p className="text-slate-400 font-medium">🌿 Support request submitted successfully.</p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <h2 className="text-4xl font-display font-black text-primary mb-4">Contact Support</h2>
                <div className="grid grid-cols-2 gap-4">
                  <input required type="text" placeholder="Name" className="glass-card px-6 py-4 rounded-2xl outline-none font-bold text-primary placeholder:text-slate-500" />
                  <input required type="email" placeholder="Email" className="glass-card px-6 py-4 rounded-2xl outline-none font-bold text-primary placeholder:text-slate-500" />
                </div>
                <select className="w-full glass-card px-6 py-4 rounded-2xl outline-none font-bold text-primary appearance-none bg-transparent">
                  <option className="bg-forest-deep">AI Accuracy Issue</option>
                  <option className="bg-forest-deep">Technical Bug</option>
                  <option className="bg-forest-deep">Account Support</option>
                  <option className="bg-forest-deep">Other</option>
                </select>
                <textarea required placeholder="Your Message" rows={4} className="w-full glass-card px-6 py-4 rounded-2xl outline-none font-bold text-primary placeholder:text-slate-500 resize-none" />
                <button type="submit" className="w-full py-5 rounded-2xl bg-accent text-white font-black shadow-xl hover:scale-[1.02] transition-all active:scale-95">
                  Send Message
                </button>
              </form>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const ProfileModal = ({ isOpen, onClose, userName, setUserName }: any) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(userName);

  const handleSave = () => {
    setUserName(tempName);
    localStorage.setItem('user_name', tempName);
    setIsEditing(false);
    toast.success('Profile updated successfully!', {
      style: {
        borderRadius: '16px',
        background: '#4a6d41',
        color: '#fff',
      },
    });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="relative w-full max-w-sm glass-card rounded-[40px] p-8 overflow-hidden"
          >
            <button onClick={onClose} className="absolute top-6 right-6 p-2 bg-slate-100 dark:bg-slate-800 rounded-full">
              <X className="w-5 h-5 text-slate-500" />
            </button>

            <div className="flex flex-col items-center gap-6 mt-4">
              <div className="relative">
                <div className="w-24 h-24 bg-gradient-to-br from-primary to-accent rounded-full flex items-center justify-center text-white text-3xl font-display font-black shadow-xl">
                  {userName.charAt(0).toUpperCase()}
                </div>
                <button className="absolute bottom-0 right-0 p-2 bg-white dark:bg-slate-800 rounded-full shadow-lg border border-slate-100 dark:border-slate-700">
                  <Camera className="w-4 h-4 text-primary" />
                </button>
              </div>

              <div className="text-center w-full space-y-4">
                {isEditing ? (
                  <div className="space-y-4">
                    <input 
                      type="text" 
                      value={tempName}
                      onChange={(e) => setTempName(e.target.value)}
                      className="w-full glass-card px-4 py-3 rounded-2xl outline-none text-center font-display font-bold text-xl text-primary"
                      placeholder="Enter name"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <button onClick={() => setIsEditing(false)} className="flex-1 py-3 rounded-2xl bg-slate-100 dark:bg-slate-800 font-bold text-slate-500">
                        Cancel
                      </button>
                      <button onClick={handleSave} className="flex-1 py-3 rounded-2xl bg-primary text-white font-bold shadow-lg shadow-primary/20">
                        Save
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1">
                    <h3 className="text-2xl font-display font-black text-primary">{userName}</h3>
                    <p className="text-sm text-slate-400">Plant Enthusiast</p>
                    <button 
                      onClick={() => setIsEditing(true)}
                      className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-accent hover:opacity-80"
                    >
                      <Edit2 className="w-4 h-4" /> Edit Profile
                    </button>
                  </div>
                )}
              </div>

              <div className="w-full border-t border-slate-100 dark:border-slate-800 pt-6 space-y-2">
                <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                  <div className="flex items-center gap-3">
                    <History className="w-5 h-5 text-slate-400 group-hover:text-primary" />
                    <span className="font-bold text-slate-600 dark:text-slate-300">Scan History</span>
                  </div>
                  <ChevronRight className="w-5 h-5 text-slate-300" />
                </button>
                <button className="w-full flex items-center justify-between p-4 rounded-2xl hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-colors group">
                  <div className="flex items-center gap-3">
                    <LogOut className="w-5 h-5 text-rose-400" />
                    <span className="font-bold text-rose-500">Logout</span>
                  </div>
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const Dashboard = ({ stats, onStartScan, userName, onProfileClick, setActiveTab, scanResult, onViewEcoReport }: any) => {
  const slogans = [
    "Plant Today. Protect Tomorrow.",
    "Nature is Intelligence.",
    "Grow Smart. Grow Green.",
    "Healing Earth with AI."
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* 🏡 IMMERSIVE HERO */}
      <section className="relative min-h-[80vh] flex items-center justify-center overflow-hidden rounded-[60px] glass-card border-none">
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1501854140801-50d01674aa3e?auto=format&fit=crop&q=80&w=2000" 
            className="w-full h-full object-cover opacity-40"
            alt="Forest"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-forest-deep/40 to-forest-deep" />
        </div>

        <div className="relative z-10 text-center max-w-4xl px-6 space-y-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/20 text-accent font-black text-xs uppercase tracking-widest">
              <Zap className="w-4 h-4" /> Powered by Advanced Neural Networks
            </div>
            <h1 className="text-7xl lg:text-8xl font-display font-black leading-none tracking-tighter text-primary">
              STEP INTO THE <br />
              <span className="text-accent">DIGITAL FOREST</span>
            </h1>
            <div className="flex flex-wrap justify-center gap-4">
              {slogans.map((s, i) => (
                <span key={i} className="text-sm font-bold text-slate-400 italic">“{s}”</span>
              ))}
            </div>
          </motion.div>

          {/* 🌱 3D ANIMATED GROWING PLANT */}
          <div className="relative h-64 flex items-center justify-center">
            <motion.div
              animate={{ 
                scale: [1, 1.05, 1],
                rotate: [0, 2, -2, 0]
              }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="relative"
            >
              <Sprout className="w-48 h-48 text-accent drop-shadow-[0_0_30px_rgba(143,179,57,0.5)]" />
              <motion.div 
                animate={{ opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute inset-0 bg-accent/20 blur-3xl rounded-full" 
              />
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            <button onClick={onStartScan} className="btn-forest group">
              <Camera className="w-6 h-6 group-hover:rotate-12 transition-transform" />
              Start Diagnosis
            </button>
            <button onClick={() => setActiveTab('chat')} className="px-10 py-5 rounded-2xl font-black text-lg glass-card hover:bg-white/10">
              Consult Assistant
            </button>
          </motion.div>
        </div>
      </section>

      {/* 🌍 ECO ANALYSIS REPORT SMART CARD */}
      <AnimatePresence>
        {scanResult && (
          <motion.section 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-12 rounded-[60px] relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 w-96 h-96 bg-accent/10 blur-[100px] rounded-full -mr-48 -mt-48 transition-all group-hover:bg-accent/20" />
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-12">
              <div className="flex items-center gap-8">
                <div className="w-24 h-24 bg-accent rounded-[40px] flex items-center justify-center shadow-2xl shadow-accent/20">
                  <TrendingUp className="w-12 h-12 text-white" />
                </div>
                <div>
                  <h2 className="text-4xl font-display font-black text-primary">Eco Analysis Report</h2>
                  <p className="text-slate-400 font-bold mt-2">Latest scan summary for your {scanResult.plantName}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-1">
                {[
                  { label: "Health Score", val: `${scanResult.confidence}%`, icon: Zap },
                  { label: "Soil Quality", val: "Optimal", icon: Sprout },
                  { label: "Climate", val: "92%", icon: Wind },
                  { label: "Disease Risk", val: scanResult.diseaseName.includes('Healthy') ? 'Low' : 'High', icon: AlertCircle }
                ].map((item, i) => (
                  <div key={i} className="text-center space-y-2">
                    <item.icon className="w-6 h-6 text-accent mx-auto" />
                    <p className="text-2xl font-black text-primary">{item.val}</p>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.label}</p>
                  </div>
                ))}
              </div>

              <button 
                onClick={onViewEcoReport}
                className="btn-forest group whitespace-nowrap"
              >
                View Detailed Eco Analysis
                <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* 📊 ANALYTICS PREVIEW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          whileHover={{ y: -10 }}
          className="lg:col-span-2 glass-card p-10 rounded-[50px] space-y-8"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-3xl font-display font-black text-primary">Garden Vitality</h3>
              <p className="text-slate-400 font-medium">Real-time health probability trend</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-2xl font-black text-accent">88%</p>
                <p className="text-xs font-bold text-slate-400 uppercase">Health Score</p>
              </div>
              <div className="w-16 h-16 rounded-full border-4 border-accent/20 border-t-accent animate-spin-slow" />
            </div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={[
                { name: 'Mon', val: 65 },
                { name: 'Tue', val: 72 },
                { name: 'Wed', val: 68 },
                { name: 'Thu', val: 85 },
                { name: 'Fri', val: 82 },
                { name: 'Sat', val: 90 },
                { name: 'Sun', val: 88 },
              ]}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8fb339" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8fb339" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff10" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1a2e1a', border: 'none', borderRadius: '12px', color: '#fff' }}
                  itemStyle={{ color: '#8fb339' }}
                />
                <Area type="monotone" dataKey="val" stroke="#8fb339" strokeWidth={4} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <div className="space-y-8">
          <div className="glass-card p-10 rounded-[50px] flex flex-col justify-between h-full">
            <div className="space-y-6">
              <div className="w-16 h-16 bg-accent/20 rounded-3xl flex items-center justify-center">
                <ShieldCheck className="w-8 h-8 text-accent" />
              </div>
              <h4 className="text-2xl font-display font-black text-primary">Eco Performance</h4>
              <div className="space-y-4">
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-slate-400">Carbon Offset</span>
                  <span className="text-accent">+2.4kg</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '65%' }} className="h-full bg-accent" />
                </div>
                <div className="flex justify-between text-sm font-bold">
                  <span className="text-slate-400">Water Saved</span>
                  <span className="text-accent">120L</span>
                </div>
                <div className="w-full h-2 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <motion.div initial={{ width: 0 }} animate={{ width: '80%' }} className="h-full bg-blue-500" />
                </div>
              </div>
            </div>
            <button 
              onClick={onViewEcoReport}
              className="mt-8 w-full py-4 rounded-2xl bg-forest-mid text-white font-black text-sm uppercase tracking-widest hover:bg-forest-deep transition-colors"
            >
              View Full Report
            </button>
          </div>
        </div>
      </div>

      {/* 📷 QUICK ACTIONS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "AI SCANNER", desc: "Futuristic lab-grade diagnosis.", icon: Scan, color: "accent", tab: 'scan' },
          { title: "ECO ANALYTICS", desc: "Track your green impact.", icon: TrendingUp, color: "blue-500", tab: 'dashboard' },
          { title: "NATURE CHAT", desc: "Intelligent botanical assistant.", icon: MessageSquare, color: "moss", tab: 'chat' }
        ].map((action, i) => (
          <motion.div
            key={i}
            whileHover={{ scale: 1.05 }}
            onClick={() => setActiveTab(action.tab)}
            className="glass-card p-10 rounded-[40px] cursor-pointer group"
          >
            <div className={`w-16 h-16 bg-${action.color}/10 rounded-3xl flex items-center justify-center mb-6 group-hover:rotate-12 transition-transform`}>
              <action.icon className={`w-8 h-8 text-${action.color}`} />
            </div>
            <h4 className="text-2xl font-display font-black text-primary">{action.title}</h4>
            <p className="text-slate-400 mt-2 font-medium">{action.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};


const ScanPage = ({ onResult, onCancel }: any) => {
  const [image, setImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraActive(true);
      }
    } catch (err) {
      setError("Could not access camera. Please check permissions.");
    }
  };

  const capturePhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext('2d');
      ctx?.drawImage(videoRef.current, 0, 0);
      const dataUrl = canvas.toDataURL('image/jpeg');
      setImage(dataUrl);
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      setIsCameraActive(false);
    }
  };

  const handlePredict = async () => {
    if (!image) return;
    setLoading(true);
    setError(null);
    try {
      const result = await predictPlantDisease(image);
      await axios.post('/api/history', {
        plant_name: result.plantName,
        disease_name: result.diseaseName,
        confidence: result.confidence,
        image_url: image,
        remedies: result
      });
      onResult(result, image);
    } catch (err) {
      setError("Prediction failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center py-10">
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-10"
      >
        <div className="space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-black text-xs uppercase tracking-widest">
            <Wind className="w-4 h-4" /> AI LAB INTERFACE
          </div>
          <h2 className="text-6xl font-display font-black text-primary leading-none">FUTURISTIC <br /> <span className="text-accent">SCANNER</span></h2>
          <p className="text-slate-400 text-xl font-medium leading-relaxed max-w-md">
            Our advanced botanical AI analyzes cellular patterns to detect anomalies with 99% accuracy.
          </p>
        </div>

        <div className="space-y-4">
          <button onClick={() => fileInputRef.current?.click()} className="btn-forest w-full group">
            <Upload className="w-6 h-6 group-hover:-translate-y-1 transition-transform" /> 
            Upload Specimen
            <input type="file" ref={fileInputRef} onChange={handleFileChange} className="hidden" accept="image/*" />
          </button>
          
          {!isCameraActive && !image && (
            <button onClick={startCamera} className="w-full py-5 rounded-2xl font-black text-lg glass-card flex items-center justify-center gap-3 hover:bg-white/10">
              <Camera className="w-6 h-6" /> Open AI Lens
            </button>
          )}

          {image && (
            <div className="flex gap-4">
              <button onClick={() => setImage(null)} className="flex-1 py-5 rounded-2xl font-black glass-card text-slate-400">
                Discard
              </button>
              <button onClick={handlePredict} className="flex-1 btn-forest">
                Analyze Now
              </button>
            </div>
          )}
        </div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative aspect-[4/5] rounded-[60px] overflow-hidden glass-card p-6"
      >
        <div className="w-full h-full rounded-[40px] overflow-hidden relative bg-forest-deep/20">
          {loading && (
            <div className="absolute inset-0 z-50 bg-forest-deep/60 backdrop-blur-md flex flex-col items-center justify-center gap-6 text-white">
              <div className="relative w-24 h-24">
                <Loader2 className="w-24 h-24 animate-spin text-accent" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <Leaf className="w-8 h-8 text-accent" />
                </div>
              </div>
              <p className="font-display font-black text-2xl tracking-[0.3em] animate-pulse">SCANNING CELLULAR DATA...</p>
            </div>
          )}

          {isCameraActive ? (
            <div className="w-full h-full relative">
              <video ref={videoRef} autoPlay playsInline className="w-full h-full object-cover" />
              <div className="scanner-laser" />
              <button 
                onClick={capturePhoto}
                className="absolute bottom-10 left-1/2 -translate-x-1/2 w-24 h-24 bg-white/20 backdrop-blur-xl rounded-full p-2 border-2 border-white/40 shadow-2xl group"
              >
                <div className="w-full h-full bg-white rounded-full flex items-center justify-center group-active:scale-90 transition-transform">
                  <div className="w-16 h-16 border-4 border-accent rounded-full" />
                </div>
              </button>
              <button 
                onClick={stopCamera}
                className="absolute top-8 right-8 p-4 bg-black/40 backdrop-blur-md rounded-2xl text-white hover:bg-black/60 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          ) : image ? (
            <div className="w-full h-full relative">
              <img src={image} className="w-full h-full object-cover" alt="Preview" />
              <div className="scanner-laser" />
            </div>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-8 text-slate-500">
              <div className="relative">
                <div className="w-32 h-32 bg-accent/10 rounded-full flex items-center justify-center">
                  <Scan className="w-16 h-16 text-accent/40" />
                </div>
                <motion.div 
                  animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.3, 0.1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                  className="absolute inset-0 bg-accent rounded-full"
                />
              </div>
              <div className="text-center space-y-2">
                <p className="font-black text-2xl text-primary">Awaiting Specimen</p>
                <p className="font-medium text-slate-400">Position leaf in frame for best results</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

const ResultPage = ({ result, image, onBack }: { result: PredictionResult, image: string, onBack: () => void }) => {
  const isHealthy = result.diseaseName.toLowerCase().includes('healthy');
  const reportRef = useRef<HTMLDivElement>(null);

  const downloadPDF = async () => {
    if (!reportRef.current) return;
    const canvas = await html2canvas(reportRef.current);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save(`plant-report-${result.plantName}.pdf`);
  };

  return (
    <div className="space-y-16 pb-20">
      <header className="flex flex-col md:flex-row items-center justify-between gap-8">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-4 glass-card rounded-2xl shadow-sm hover:scale-110 transition-transform">
            <ArrowLeft className="w-8 h-8 text-primary" />
          </button>
          <div>
            <h1 className="text-5xl font-display font-black text-primary">Analysis Result</h1>
            <p className="text-slate-400 font-medium">AI generated health report for your specimen</p>
          </div>
        </div>
        <button onClick={downloadPDF} className="btn-forest group">
          <Download className="w-6 h-6 group-hover:translate-y-1 transition-transform" /> 
          Export Report
        </button>
      </header>

      <div ref={reportRef} className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div className="relative aspect-[4/5] rounded-[60px] overflow-hidden shadow-2xl group glass-card p-4">
          <div className="w-full h-full rounded-[40px] overflow-hidden relative">
            <img src={image} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt="Scanned leaf" />
            <div className="absolute inset-0 bg-gradient-to-t from-forest-deep via-transparent to-transparent" />
            <div className="absolute bottom-12 left-12 right-12 text-white">
              <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full text-xs font-black uppercase tracking-widest mb-6 ${
                isHealthy ? 'bg-accent' : 'bg-rose-500'
              }`}>
                {isHealthy ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                {isHealthy ? 'Healthy Specimen' : 'Pathogen Detected'}
              </div>
              <h2 className="text-6xl font-display font-black leading-none">{result.plantName}</h2>
              <p className="text-2xl text-white/80 font-medium mt-4 italic">“{result.diseaseName}”</p>
            </div>
            <div className="scanner-laser !opacity-40" />
          </div>
        </div>

        <div className="space-y-10">
          <div className="glass-card p-12 rounded-[50px] space-y-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8 opacity-10">
              <ShieldCheck className="w-32 h-32 text-accent" />
            </div>
            <div className="flex items-center justify-between relative z-10">
              <h3 className="text-3xl font-display font-black text-primary">AI Diagnosis</h3>
              <div className="flex items-center gap-2 px-6 py-2 bg-accent/20 text-accent rounded-full text-sm font-black">
                <Zap className="w-4 h-4" /> {result.confidence}% Match
              </div>
            </div>
            <p className="text-xl text-slate-400 leading-relaxed font-medium relative z-10">{result.description}</p>
          </div>

          <div className="glass-card p-12 rounded-[50px] space-y-8">
            <h3 className="text-3xl font-display font-black text-primary">Botanical Remedies</h3>
            <div className="grid grid-cols-1 gap-6">
              {result.remedies.map((r, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex gap-6 p-6 bg-forest-deep/5 rounded-3xl border border-white/10 group hover:bg-forest-deep/10 transition-colors"
                >
                  <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center shrink-0 group-hover:rotate-12 transition-transform">
                    <Droplets className="w-6 h-6 text-accent" />
                  </div>
                  <p className="text-lg text-slate-400 font-bold leading-relaxed">{r}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {!isHealthy && (
            <div className="glass-card p-12 rounded-[50px] space-y-8 border-rose-500/20">
              <h3 className="text-3xl font-display font-black text-rose-500">Targeted Solutions</h3>
              <div className="flex flex-wrap gap-4">
                {result.pesticides.map((p, i) => (
                  <span key={i} className="px-8 py-3 bg-rose-500/10 text-rose-500 rounded-2xl text-sm font-black uppercase tracking-widest border border-rose-500/20">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-8">
        <button onClick={onBack} className="flex-1 py-6 rounded-3xl glass-card font-black text-xl hover:bg-white/10 transition-all">
          Return to Dashboard
        </button>
        <button onClick={() => window.location.reload()} className="flex-1 btn-forest">
          Start New Analysis
        </button>
      </div>
    </div>
  );
};

const HistoryPage = () => {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axios.get('/api/history');
        setHistory(res.data);
      } catch (err) {
        toast.error('Failed to load history');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;

  if (history.length === 0) {
    return (
      <div className="col-span-full glass-card p-20 rounded-[40px] text-center space-y-6">
        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto">
          <History className="w-10 h-10 text-slate-300" />
        </div>
        <div className="space-y-2">
          <h3 className="text-2xl font-display font-black text-primary">No History Yet</h3>
          <p className="text-slate-400 max-w-xs mx-auto">Start scanning your plants to see your history here.</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {history.map((item) => (
        <motion.div 
          key={item.id} 
          whileHover={{ y: -8 }}
          className="glass-card p-6 rounded-[32px] flex flex-col gap-6 group"
        >
          <div className="relative aspect-video rounded-2xl overflow-hidden">
            <img src={item.image_url} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt="" />
            <div className="absolute top-4 right-4 px-3 py-1 bg-black/40 backdrop-blur-md rounded-lg text-[10px] font-black text-white uppercase tracking-widest">
              {format(new Date(item.created_at), 'MMM d')}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="font-display font-black text-primary text-xl">{item.plant_name}</h3>
              <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                <ChevronRight className="w-4 h-4 text-primary" />
              </div>
            </div>
            <p className="text-sm text-slate-500 font-medium line-clamp-1">{item.disease_name}</p>
          </div>
        </motion.div>
      ))}
    </>
  );
};

const AssistantPage = ({ userName }: { userName: string }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai', text: string }[]>([
    { role: 'ai', text: `Greetings, ${userName}. I am LeafLens AI, your botanical intelligence. How can I assist your garden today?` }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setLoading(true);
    try {
      const res = await chatWithAssistant(userMsg);
      setMessages(prev => [...prev, { role: 'ai', text: res || '' }]);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'ai', text: 'Connection to forest intelligence lost. Please retry.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[75vh] glass-card rounded-[60px] overflow-hidden border-none">
      <div className="bg-forest-deep/20 px-12 py-8 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 bg-accent rounded-[20px] flex items-center justify-center shadow-[0_0_30px_rgba(143,179,57,0.3)]">
              <Leaf className="w-8 h-8 text-white" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-4 border-forest-deep rounded-full" />
          </div>
          <div>
            <p className="text-2xl font-display font-black text-primary leading-none">LeafLens AI</p>
            <p className="text-xs text-slate-400 font-black uppercase tracking-widest mt-2">Botanical Intelligence Active</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Response Time</span>
            <span className="text-accent font-black">~0.4s</span>
          </div>
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-12 space-y-10 no-scrollbar bg-forest-deep/5">
        {messages.map((m, i) => (
          <motion.div 
            key={i} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`max-w-[75%] p-8 rounded-[40px] shadow-xl ${
              m.role === 'user' 
                ? 'bg-accent text-white rounded-tr-none shadow-accent/20' 
                : 'glass-card text-slate-600 dark:text-slate-300 rounded-tl-none'
            }`}>
              <p className="text-lg leading-relaxed font-medium whitespace-pre-wrap">{m.text}</p>
            </div>
          </motion.div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="glass-card p-8 rounded-[40px] rounded-tl-none">
              <div className="flex gap-2">
                <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1 }} className="w-2 h-2 bg-accent rounded-full" />
                <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.2 }} className="w-2 h-2 bg-accent rounded-full" />
                <motion.div animate={{ scale: [1, 1.5, 1] }} transition={{ repeat: Infinity, duration: 1, delay: 0.4 }} className="w-2 h-2 bg-accent rounded-full" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="p-10 bg-forest-deep/20 border-t border-white/10">
        <div className="flex gap-6 max-w-4xl mx-auto">
          <input 
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyPress={e => e.key === 'Enter' && handleSend()}
            className="flex-1 glass-card px-10 py-6 rounded-[30px] outline-none text-lg font-bold border-none focus:ring-2 ring-accent/50 transition-all placeholder:text-slate-500"
            placeholder="Ask anything about your plants..."
          />
          <button onClick={handleSend} className="w-20 h-20 bg-accent text-white rounded-[30px] flex items-center justify-center hover:scale-105 transition-transform shadow-2xl shadow-accent/30">
            <Send className="w-8 h-8" />
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main App ---

export default function App() {
  const [loading, setLoading] = useState(true);
  const [onboarded, setOnboarded] = useState(false);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [userName, setUserName] = useState('LeafLens');
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isEcoReportOpen, setIsEcoReportOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "Your plant health improved by 8%", type: "success", read: false },
    { id: 2, text: "Early signs of fungal infection detected", type: "warning", read: false },
    { id: 3, text: "Weather alert: High humidity today", type: "info", read: false },
    { id: 4, text: "Soil nutrients dropping", type: "error", read: false },
  ]);
  const [darkMode, setDarkMode] = useState(true);
  const [stats, setStats] = useState({ totalScans: 0, healthyPlants: 0 });
  const [scanResult, setScanResult] = useState<PredictionResult | null>(null);
  const [scanImage, setScanImage] = useState<string | null>(null);

  useEffect(() => {
    const savedName = localStorage.getItem('user_name');
    if (savedName) setUserName(savedName);
    
    const savedOnboarded = localStorage.getItem('onboarded');
    if (savedOnboarded) setOnboarded(true);

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) setDarkMode(savedTheme === 'dark');

    const fetchStats = async () => {
      try {
        const res = await axios.get('/api/stats');
        setStats(res.data);
      } catch (err) {
        console.error("Failed to fetch stats");
      }
    };
    fetchStats();
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const handleOnboardingComplete = () => {
    setOnboarded(true);
    localStorage.setItem('onboarded', 'true');
  };

  const handleScanResult = (result: PredictionResult, image: string) => {
    setScanResult(result);
    setScanImage(image);
    setActiveTab('result');
  };

  return (
    <div className="min-h-screen">
      <LivingForestBackground />
      <Toaster position="bottom-right" />
      
      <AnimatePresence mode="wait">
        {loading && <SplashScreen onComplete={() => setLoading(false)} />}
        {!loading && !onboarded && <Onboarding onComplete={handleOnboardingComplete} />}
      </AnimatePresence>

      {!loading && onboarded && (
        <>
          <Navbar 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            onProfileClick={() => setIsProfileOpen(true)}
            userName={userName}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            isNotificationOpen={isNotificationOpen}
            setIsNotificationOpen={setIsNotificationOpen}
            notifications={notifications}
            setNotifications={setNotifications}
          />

          <main className="pt-28 px-6 pb-32 max-w-7xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.98, filter: 'blur(10px)' }}
                animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, scale: 1.02, filter: 'blur(10px)' }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                {activeTab === 'dashboard' && (
                  <Dashboard 
                    stats={stats} 
                    onStartScan={() => setActiveTab('scan')} 
                    userName={userName}
                    onProfileClick={() => setIsProfileOpen(true)}
                    setActiveTab={setActiveTab}
                    scanResult={scanResult}
                    onViewEcoReport={() => setIsEcoReportOpen(true)}
                  />
                )}
                {activeTab === 'scan' && (
                  <ScanPage onResult={handleScanResult} onCancel={() => setActiveTab('dashboard')} />
                )}
                {activeTab === 'result' && scanResult && scanImage && (
                  <ResultPage result={scanResult} image={scanImage} onBack={() => setActiveTab('dashboard')} />
                )}
                {activeTab === 'history' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <HistoryPage />
                  </div>
                )}
                {activeTab === 'chat' && <AssistantPage userName={userName} />}
              </motion.div>
            </AnimatePresence>
          </main>

          <Footer 
            onPrivacy={() => setIsPrivacyOpen(true)}
            onTerms={() => setIsTermsOpen(true)}
            onContact={() => setIsContactOpen(true)}
          />
          
          <ProfileModal 
            isOpen={isProfileOpen} 
            onClose={() => setIsProfileOpen(false)} 
            userName={userName}
            setUserName={setUserName}
          />

          <EcoReportOverlay 
            isOpen={isEcoReportOpen}
            onClose={() => setIsEcoReportOpen(false)}
            data={scanResult}
          />

          <PrivacyModal 
            isOpen={isPrivacyOpen}
            onClose={() => setIsPrivacyOpen(false)}
          />

          <TermsModal 
            isOpen={isTermsOpen}
            onClose={() => setIsTermsOpen(false)}
          />

          <ContactModal 
            isOpen={isContactOpen}
            onClose={() => setIsContactOpen(false)}
          />

          {/* 🤖 FLOATING AI CHAT ICON */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setActiveTab('chat')}
            className={`fixed bottom-10 right-10 w-20 h-20 rounded-full bg-accent text-white shadow-[0_0_40px_rgba(143,179,57,0.5)] flex items-center justify-center z-50 ${activeTab === 'chat' ? 'hidden' : ''}`}
          >
            <MessageSquare className="w-10 h-10" />
            <motion.div 
              animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0, 0.2] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-accent rounded-full"
            />
          </motion.button>
        </>
      )}
    </div>
  );
}
