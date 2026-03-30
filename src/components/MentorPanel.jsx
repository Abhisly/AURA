import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Brain, LayoutDashboard } from 'lucide-react';
import { getTechNameById } from '../data/dataset';

const buildAIResponse = (userInput, techs, accuracy) => {
  const techNames = techs.map(t => getTechNameById(t)).filter(Boolean);
  const techList  = techNames.length > 0 ? techNames.join(', ') : 'your selected technologies';
  const level     = accuracy >= 80 ? 'advanced' : accuracy >= 60 ? 'intermediate' : 'foundational';

  const pool = [
    `Based on your ${accuracy}% score across ${techList}, I'd suggest reinforcing ${level} patterns first. Build small projects that isolate each concept before combining them.`,
    `For someone at the ${level} tier in ${techList}, deliberate practice beats passive studying 4:1. What specific concept is blocking you right now?`,
    `I've analysed your assessment data. The highest-ROI focus area in ${techList} for you is the integration layer — not fundamentals. Want me to outline a 7-day sprint?`,
    `At ${accuracy}% accuracy, you're clearly past the beginner phase. The next breakthrough in ${techList} usually comes from building, shipping, and getting feedback — not just reading docs.`,
    `Great question. For ${techList} at the ${level} level, the typical path to the next tier takes 4–8 weeks of focused effort. I can structure that for you if you'd like.`,
    `Let me cross-reference your ${techList} roadmap with your performance data. The gap I see is at the conceptual depth layer — you likely understand the syntax but not the *why*. Let's fix that.`,
  ];
  return pool[Math.floor(Math.random() * pool.length)];
};

const MentorPanel = ({ onBack, techs = [], accuracy = 0, isFirstTime = false }) => {
  const techNames = techs.map(t => getTechNameById(t)).filter(Boolean);
  const techList  = techNames.length > 0 ? techNames.join(', ') : 'your skill areas';

  const [messages,  setMessages]  = useState([
    {
      id: 1, role: 'assistant',
      content: `Neural link established. I've cross-referenced your ${accuracy}% assessment score across ${techList}. How can I accelerate your growth today?`
    }
  ]);
  const [input,    setInput]    = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

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
      const aiMsg = {
        id: Date.now() + 1,
        role: 'assistant',
        content: buildAIResponse(content, techs, accuracy),
      };
      setMessages(prev => [...prev, aiMsg]);
      setIsTyping(false);
    }, 1200 + Math.random() * 800);
  };

  const quickPrompts = [
    'What should I focus on next?',
    'Where are my biggest gaps?',
    'Give me a 7-day study plan',
  ];

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-24 relative z-20 font-sans">
      <div className="max-w-3xl w-full flex flex-col h-[80vh]">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400/20 to-indigo-600/20 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.2)]">
              <Brain size={18} className="text-cyan-400" />
            </div>
            <div>
              <p className="text-[10px] font-mono tracking-[0.4em] text-cyan-400/60 uppercase mb-0.5">Phase 04 // Guidance</p>
              <h2 className="text-2xl font-display font-black text-white uppercase tracking-tighter">AI Mentor.</h2>
            </div>
          </div>

          {/* CTA to Dashboard (first-time flow only) */}
          {isFirstTime && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onBack}
              className="group flex items-center gap-2 px-5 py-2.5 rounded-full border border-cyan-500/30 bg-cyan-500/10 text-cyan-300 text-xs font-bold tracking-widest uppercase hover:bg-cyan-500/20 hover:border-cyan-400/50 transition-all"
            >
              <LayoutDashboard size={13} />
              Go to Dashboard
            </motion.button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto space-y-10 px-2 mb-6 custom-scrollbar">
          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
            >
              <span className="text-[8px] font-mono tracking-[0.4em] text-white/20 uppercase mb-3">
                {msg.role === 'user' ? 'You' : 'System'}
              </span>
              <div className={`max-w-[82%] text-base md:text-lg font-light leading-relaxed tracking-wide
                ${msg.role === 'user'
                  ? 'text-white bg-white/5 border border-white/8 rounded-2xl px-5 py-4'
                  : 'text-white/60'
                }`}
              >
                {msg.content}
              </div>
            </motion.div>
          ))}

          {isTyping && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-start">
              <span className="text-[8px] font-mono tracking-[0.4em] text-white/20 uppercase mb-3">Processing</span>
              <div className="flex gap-2 px-2 py-3">
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
        <div className="flex gap-2 flex-wrap mb-4">
          {quickPrompts.map(p => (
            <button
              key={p}
              onClick={() => handleSend(p)}
              disabled={isTyping}
              className="px-3 py-1.5 rounded-full border border-white/10 text-[10px] font-mono text-white/35 hover:text-white/65 hover:border-white/25 transition-all disabled:opacity-25"
            >
              {p}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="relative group">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend(input)}
            placeholder="Command query..."
            className="w-full bg-white/[0.02] border-b border-white/10 py-7 px-4 text-xl font-light text-white placeholder-white/10 outline-none focus:border-white/30 transition-colors"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isTyping}
            className="absolute right-4 top-1/2 -translate-y-1/2 p-3 text-white/20 hover:text-cyan-400 transition-colors disabled:opacity-0"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MentorPanel;
