import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, RefreshCw, Map, Bot, LogOut,
  ChevronRight, Send, Zap, Target, TrendingUp,
  CheckCircle2, Circle, AlertTriangle, Star, Flame,
  Brain, Code2, BarChart2
} from 'lucide-react';
import { getRoadmapByTechnology, getTechNameById } from '../data/dataset';

// ─────────────────────────────────────
// Helper: Build roadmap data from techId
// ─────────────────────────────────────
const getRoadmapData = (techId) => {
  const roadmap = getRoadmapByTechnology(techId);
  if (!roadmap) return null;
  const weekTitles = [
    'Foundation & Core Concepts',
    'Intermediate Concepts',
    'Advanced Topics & Integration',
    'Mastery & Specialization',
  ];
  const weeks = ['week1', 'week2', 'week3', 'week4']
    .map((key, idx) =>
      roadmap.roadmap[key]
        ? {
            week: idx + 1,
            title: weekTitles[idx],
            days: roadmap.roadmap[key].map((task, d) => ({
              day: idx * 7 + d + 1,
              task,
            })),
          }
        : null
    )
    .filter(Boolean);
  return { weeks, technology: roadmap.technology };
};

// ─────────────────────────────────────
// AI Mentor contextual responses
// ─────────────────────────────────────
const buildAIResponse = (userInput, techs, accuracy) => {
  const techNames = techs.map(t => getTechNameById(t)).filter(Boolean);
  const techList = techNames.length > 0 ? techNames.join(', ') : 'your selected technologies';
  const level = accuracy >= 80 ? 'advanced' : accuracy >= 60 ? 'intermediate' : 'foundational';

  const responses = [
    `Based on your ${accuracy}% score in ${techList}, I'd recommend focusing on ${level} patterns first. Solidify your understanding of core abstractions before moving to edge cases.`,
    `Great question. For someone at your ${level} tier in ${techList}, the most high-leverage action is deliberate practice with real-world projects — not just passive studying.`,
    `Your assessment reveals a strong signal in certain areas of ${techList}. I'm tracking 3 conceptual gaps we should close in the next 2 weeks. Want me to outline the plan?`,
    `At ${accuracy}% accuracy, you're progressing well. The ${level} path for ${techList} typically takes 6–8 weeks to transition to the next tier with consistent practice.`,
    `Interesting. Let me cross-reference your performance data with your ${techList} roadmap. The bottleneck seems to be at the integration layer — not fundamentals. Let's target that.`,
    `For ${techList} at the ${level} level, I recommend: 1) Review the concepts you missed in the assessment, 2) Build a micro-project applying those concepts, 3) Come back with your blockers.`,
  ];
  return responses[Math.floor(Math.random() * responses.length)];
};

// ─────────────────────────────────────
// TAB: Overview
// ─────────────────────────────────────
const OverviewTab = ({ session, userProfile }) => {
  const { accuracy = 0, techs = [], domain, completedAt } = session || {};
  const techNames = techs.map(t => getTechNameById(t)).filter(Boolean);
  const level = accuracy >= 80 ? 'Alpha' : accuracy >= 60 ? 'Beta' : 'Gamma';
  const levelColor = accuracy >= 80 ? 'cyan' : accuracy >= 60 ? 'blue' : 'orange';

  const colorMap = {
    cyan: 'border-cyan-500/40 text-cyan-300 bg-cyan-500/10 shadow-cyan-900/30',
    blue: 'border-blue-500/40 text-blue-300 bg-blue-500/10 shadow-blue-900/30',
    orange: 'border-orange-500/40 text-orange-300 bg-orange-500/10 shadow-orange-900/30',
  };

  const stats = [
    { icon: Target, label: 'Accuracy', value: `${accuracy}%`, color: 'cyan' },
    { icon: Star, label: 'Tier', value: level, color: levelColor },
    { icon: Code2, label: 'Skills Mapped', value: techs.length, color: 'blue' },
    { icon: Flame, label: 'Streak', value: '1 day', color: 'orange' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-10"
    >
      {/* Welcome banner */}
      <div>
        <p className="text-[10px] font-mono tracking-[0.4em] text-white/30 uppercase mb-2">
          Welcome Back
        </p>
        <h2 className="text-4xl md:text-5xl font-display font-black tracking-tighter text-white leading-none">
          {userProfile?.name || 'Operator'}.
          <span className="text-white/20 ml-3 text-2xl font-light">Dashboard</span>
        </h2>
      </div>

      {/* Score ring + stat cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main score ring */}
        <div className="lg:col-span-1 bg-white/[0.02] border border-white/6 rounded-3xl p-8 flex flex-col items-center justify-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent pointer-events-none" />
          <div className="relative w-40 h-40 mb-6">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="6" />
              <motion.circle
                cx="50" cy="50" r="42" fill="none"
                stroke="url(#dashGrad)" strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray="264"
                initial={{ strokeDashoffset: 264 }}
                animate={{ strokeDashoffset: 264 * (1 - accuracy / 100) }}
                transition={{ duration: 2, ease: 'easeOut', delay: 0.3 }}
              />
              <defs>
                <linearGradient id="dashGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="100%" stopColor="#6366f1" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
                className="text-4xl font-display font-bold text-white"
              >
                {accuracy}<span className="text-lg text-cyan-400">%</span>
              </motion.span>
              <span className="text-[9px] font-mono text-white/30 tracking-widest uppercase mt-1">Mastery</span>
            </div>
          </div>
          <div className={`px-4 py-2 rounded-full border text-xs font-bold tracking-widest uppercase backdrop-blur-xl ${colorMap[levelColor]}`}>
            Tier: {level}
          </div>
        </div>

        {/* Stat cards */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          {stats.map(({ icon: Icon, label, value, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * i, duration: 0.4 }}
              className="bg-white/[0.02] border border-white/6 rounded-2xl p-6 flex flex-col justify-between relative overflow-hidden group hover:border-white/20 transition-colors duration-300"
            >
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-bl from-cyan-500/5 to-transparent pointer-events-none rounded-bl-full" />
              <Icon size={18} className="text-white/20 mb-4 group-hover:text-cyan-400 transition-colors" />
              <div>
                <p className="text-2xl font-display font-bold text-white">{value}</p>
                <p className="text-[10px] font-mono text-white/30 tracking-widest uppercase mt-1">{label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Skills mapped */}
      {techNames.length > 0 && (
        <div className="bg-white/[0.02] border border-white/6 rounded-3xl p-8">
          <p className="text-[10px] font-mono tracking-[0.4em] text-white/30 uppercase mb-6">Skills Mapped</p>
          <div className="flex flex-wrap gap-3">
            {techNames.map((name, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.05 * i }}
                className="px-5 py-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-bold tracking-widest uppercase backdrop-blur-xl"
              >
                {name}
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Last session */}
      {completedAt && (
        <div className="flex items-center gap-4 text-white/20">
          <div className="w-2 h-2 rounded-full bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.8)] animate-pulse" />
          <p className="text-xs font-mono tracking-widest">
            Last session: {new Date(completedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      )}
    </motion.div>
  );
};

// ─────────────────────────────────────
// TAB: Re-Assignment
// ─────────────────────────────────────
const ReAssignTab = ({ onReAssign }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -16 }}
    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
    className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-12"
  >
    <div>
      <motion.div
        animate={{ rotate: [0, -5, 5, -3, 3, 0] }}
        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
        className="w-20 h-20 mx-auto mb-8 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center"
      >
        <RefreshCw size={32} className="text-orange-400" />
      </motion.div>
      <p className="text-[10px] font-mono tracking-[0.4em] text-orange-400/60 uppercase mb-4">
        Re-Assignment Protocol
      </p>
      <h2 className="text-5xl md:text-6xl font-display font-black tracking-tighter text-white leading-none mb-6">
        Restart the
        <br />
        <span className="text-white/20">Assessment.</span>
      </h2>
      <p className="text-white/40 text-base font-light tracking-wide max-w-md mx-auto leading-relaxed">
        Your current session data will be cleared. You'll go through a fresh domain, skill, and knowledge evaluation — generating a new personalized roadmap.
      </p>
    </div>

    <div className="flex flex-col items-center gap-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onReAssign}
        className="group relative px-16 py-5 rounded-full bg-white text-black font-bold tracking-[0.2em] uppercase text-xs overflow-hidden transition-all duration-500 shadow-[0_0_40px_rgba(255,255,255,0.1)]"
      >
        <span className="relative z-10 flex items-center gap-3">
          <RefreshCw size={14} className="group-hover:rotate-180 transition-transform duration-500" />
          Initialize Re-Assessment
        </span>
        <motion.div className="absolute inset-0 bg-orange-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </motion.button>
      <p className="text-[10px] font-mono text-white/20 tracking-widest uppercase">
        This action cannot be undone
      </p>
    </div>
  </motion.div>
);

// ─────────────────────────────────────
// TAB: Roadmap (embedded)
// ─────────────────────────────────────
const RoadmapTab = ({ techs }) => {
  const [expandedWeek, setExpandedWeek] = useState(0);
  const techId = techs?.[0];
  const roadmapData = getRoadmapData(techId) || getRoadmapData('tech_c');
  if (!roadmapData) return <p className="text-white/30 text-center mt-20">No roadmap data available.</p>;
  const { weeks, technology } = roadmapData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="space-y-6"
    >
      <div>
        <p className="text-[10px] font-mono tracking-[0.4em] text-white/30 uppercase mb-2">Projected Pathway</p>
        <h2 className="text-4xl font-display font-black tracking-tighter text-white">
          {technology} <span className="text-white/20">Roadmap.</span>
        </h2>
      </div>

      <div className="space-y-2">
        {weeks.map((week, weekIndex) => (
          <div key={week.week} className="border-b border-white/5 overflow-hidden">
            <button
              onClick={() => setExpandedWeek(expandedWeek === weekIndex ? null : weekIndex)}
              className="w-full py-8 flex items-center justify-between group"
            >
              <div className="flex items-center gap-8">
                <span className="text-sm font-mono text-white/20 group-hover:text-cyan-400/60 transition-colors">
                  W{String(week.week).padStart(2, '0')}
                </span>
                <h3 className={`text-xl md:text-2xl font-display font-black uppercase tracking-tighter transition-all duration-500
                  ${expandedWeek === weekIndex ? 'text-white' : 'text-white/40 group-hover:text-white/60'}`}
                >
                  {week.title}
                </h3>
              </div>
              <motion.div animate={{ rotate: expandedWeek === weekIndex ? 90 : 0 }} className="text-white/20 group-hover:text-cyan-400 transition-colors">
                <ChevronRight size={20} />
              </motion.div>
            </button>

            <AnimatePresence>
              {expandedWeek === weekIndex && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="pb-8 grid grid-cols-1 md:grid-cols-2 gap-3"
                >
                  {week.days.map((day) => (
                    <div key={day.day} className="p-5 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-4 hover:border-white/10 transition-colors">
                      <span className="text-[10px] font-mono text-cyan-400/40 mt-0.5 shrink-0">
                        {String(day.day).padStart(2, '0')}
                      </span>
                      <p className="text-sm text-white/50 font-light leading-relaxed">{day.task}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────
// TAB: AI Mentor (full chat)
// ─────────────────────────────────────
const MentorTab = ({ session }) => {
  const { techs = [], accuracy = 0 } = session || {};
  const [messages, setMessages] = useState([
    {
      id: 1, role: 'assistant',
      content: `Neural link established. I've analysed your assessment data — ${accuracy}% accuracy across ${techs.length} skill${techs.length !== 1 ? 's' : ''}. How can I help accelerate your growth today?`
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (content) => {
    if (!content.trim() || isTyping) return;
    const userMsg = { id: Date.now(), role: 'user', content };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);
    setTimeout(() => {
      const aiMsg = { id: Date.now() + 1, role: 'assistant', content: buildAIResponse(content, techs, accuracy) };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const quickPrompts = [
    'What should I study next?',
    'Where are my biggest gaps?',
    'Give me a 7-day plan',
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col h-[72vh]"
    >
      {/* Header */}
      <div className="flex items-center gap-4 mb-8 pb-6 border-b border-white/5">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400/20 to-indigo-600/20 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.2)]">
          <Brain size={18} className="text-cyan-400" />
        </div>
        <div>
          <p className="text-sm font-bold text-white tracking-wide">AI Mentor</p>
          <p className="text-[10px] font-mono text-white/30 tracking-widest uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)] inline-block animate-pulse" />
            Online · Context-aware
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto space-y-8 pr-2 custom-scrollbar">
        {messages.map((msg) => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
          >
            <span className="text-[8px] font-mono tracking-[0.4em] text-white/20 uppercase mb-3">
              {msg.role === 'user' ? 'You' : 'AI Mentor'}
            </span>
            <div className={`max-w-[80%] text-base font-light leading-relaxed tracking-wide rounded-2xl px-5 py-4
              ${msg.role === 'user'
                ? 'bg-white/5 border border-white/10 text-white'
                : 'text-white/70 border border-transparent'
              }`}
            >
              {msg.content}
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-start">
            <span className="text-[8px] font-mono tracking-[0.4em] text-white/20 uppercase mb-3">AI Mentor • Processing</span>
            <div className="flex gap-2 px-5 py-4">
              {[0, 1, 2].map(i => (
                <motion.div
                  key={i}
                  animate={{ opacity: [0.2, 1, 0.2], scale: [0.8, 1, 0.8] }}
                  transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                  className="w-1.5 h-1.5 rounded-full bg-cyan-400"
                />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick prompts */}
      <div className="flex gap-2 flex-wrap mt-4 mb-4">
        {quickPrompts.map(prompt => (
          <button
            key={prompt}
            onClick={() => handleSend(prompt)}
            disabled={isTyping}
            className="px-3 py-1.5 rounded-full border border-white/10 text-[10px] font-mono text-white/40 hover:text-white/70 hover:border-white/30 transition-all disabled:opacity-30"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="relative group border-t border-white/10 pt-4">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSend(input)}
          placeholder="Ask anything about your learning path..."
          className="w-full bg-white/[0.02] border border-white/8 rounded-2xl py-5 pl-6 pr-16 text-base font-light text-white placeholder-white/15 outline-none focus:border-cyan-500/40 focus:bg-white/[0.04] transition-all"
        />
        <button
          onClick={() => handleSend(input)}
          disabled={!input.trim() || isTyping}
          className="absolute right-4 top-1/2 -translate-y-1/2 mt-2 p-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/30 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <Send size={16} />
        </button>
      </div>
    </motion.div>
  );
};

// ─────────────────────────────────────
// MAIN: Dashboard
// ─────────────────────────────────────
const TABS = [
  { id: 'overview',    label: 'Overview',    icon: LayoutDashboard },
  { id: 'reassign',   label: 'Re-Assign',   icon: RefreshCw },
  { id: 'roadmap',    label: 'Roadmap',     icon: Map },
  { id: 'mentor',     label: 'AI Mentor',   icon: Bot },
];

const Dashboard = ({ userProfile, session, onReAssign, onLogout }) => {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <div className="min-h-screen font-sans text-white relative z-20 flex flex-col md:flex-row">

      {/* ── Sidebar (desktop) ── */}
      <aside className="hidden md:flex flex-col w-64 shrink-0 min-h-screen border-r border-white/5 px-6 py-10 sticky top-0 h-screen">
        {/* Logo */}
        <div className="mb-12">
          <span className="text-[9px] font-mono tracking-[0.4em] text-cyan-400/60 uppercase block mb-1">SkillGap</span>
          <span className="text-2xl font-display font-black tracking-tighter text-white">AURA</span>
        </div>

        {/* User pill */}
        <div className="flex items-center gap-3 mb-10 px-4 py-3 rounded-2xl bg-white/[0.03] border border-white/6">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 flex items-center justify-center text-[11px] font-black text-black shrink-0">
            {(userProfile?.name || 'U').charAt(0).toUpperCase()}
          </div>
          <div className="overflow-hidden">
            <p className="text-xs font-bold text-white truncate">{userProfile?.name || 'Operator'}</p>
            <p className="text-[9px] font-mono text-white/30 truncate">{userProfile?.role || 'User'}</p>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 flex-1">
          {TABS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium tracking-wide transition-all duration-300 text-left
                ${activeTab === id
                  ? 'bg-white/8 border border-white/10 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]'
                  : 'text-white/30 hover:text-white/60 hover:bg-white/4'
                }`}
            >
              <Icon size={16} className={activeTab === id ? 'text-cyan-400' : 'text-white/20'} />
              {label}
              {id === 'mentor' && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_rgba(74,222,128,0.8)] animate-pulse" />
              )}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <button
          onClick={onLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm text-white/20 hover:text-white/60 hover:bg-white/4 transition-all duration-300 mt-4"
        >
          <LogOut size={16} />
          Logout
        </button>
      </aside>

      {/* ── Main content ── */}
      <main className="flex-1 px-6 md:px-10 py-10 md:py-12 pb-32 md:pb-12 overflow-y-auto">
        {/* Page header */}
        <div className="mb-10 hidden md:flex items-center justify-between">
          <div>
            <p className="text-[9px] font-mono tracking-[0.4em] text-white/20 uppercase">
              {TABS.find(t => t.id === activeTab)?.label}
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-white/8 bg-white/[0.02]">
            <BarChart2 size={12} className="text-cyan-400" />
            <span className="text-[10px] font-mono text-white/40 tracking-wider">
              {session?.accuracy ?? 0}% Overall Score
            </span>
          </div>
        </div>

        {/* Tab content */}
        <AnimatePresence mode="wait">
          {activeTab === 'overview'  && <OverviewTab  key="overview"  session={session} userProfile={userProfile} />}
          {activeTab === 'reassign'  && <ReAssignTab  key="reassign"  onReAssign={onReAssign} />}
          {activeTab === 'roadmap'   && <RoadmapTab   key="roadmap"   techs={session?.techs || []} />}
          {activeTab === 'mentor'    && <MentorTab    key="mentor"    session={session} />}
        </AnimatePresence>
      </main>

      {/* ── Bottom tab bar (mobile) ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-xl border-t border-white/8 flex">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 transition-colors
              ${activeTab === id ? 'text-cyan-400' : 'text-white/20 hover:text-white/50'}`}
          >
            <Icon size={18} />
            <span className="text-[9px] font-mono tracking-widest uppercase">{label}</span>
          </button>
        ))}
        <button
          onClick={onLogout}
          className="flex-1 flex flex-col items-center gap-1 py-3 text-white/20 hover:text-white/50 transition-colors"
        >
          <LogOut size={18} />
          <span className="text-[9px] font-mono tracking-widest uppercase">Exit</span>
        </button>
      </nav>
    </div>
  );
};

export default Dashboard;
