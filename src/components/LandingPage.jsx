import React, { useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { ChevronRight, Activity, Cpu, Shield, GitBranch, TrendingUp, BarChart2 } from 'lucide-react';

const STATUS_ROWS = [
  { label: 'AI MODE',          value: 'ACTIVE',       pulse: true  },
  { label: 'ANALYSIS ENGINE',  value: 'READY',        pulse: true  },
  { label: 'NEURAL CORE',      value: 'ONLINE',       pulse: true  },
  { label: 'SKILL MAP',        value: 'CALIBRATING',  pulse: false },
  { label: 'RESPONSE ENGINE',  value: 'PRIMED',       pulse: false },
];

const METRICS = [
  { label: 'Accuracy Rate',   value: '94.7%'  },
  { label: 'Tests Processed', value: '12.4K'  },
  { label: 'Active Domains',  value: '8'      },
  { label: 'Avg Score Delta', value: '+31%'   },
];

const LOGS = [
  '> Neural pathways initialized',
  '> Domain matrix loaded [8 active]',
  '> Adaptive engine standby',
  '> Awaiting operator input...',
];

const SKILL_CARDS = [
  { title: 'Frontend Dev',   score: 78, level: 'Intermediate' },
  { title: 'Data Structures', score: 62, level: 'Developing'  },
  { title: 'System Design',  score: 85, level: 'Advanced'     },
];

const ROADMAP = ['Assess', 'Analyze', 'Plan', 'Execute', 'Evolve'];

const LandingPage = ({ onStart }) => {
  const vw = typeof window !== 'undefined' ? window.innerWidth  : 1440;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 900;

  const mouseX = useMotionValue(vw / 2);
  const mouseY = useMotionValue(vh / 2);
  const sX = useSpring(mouseX, { damping: 50, stiffness: 70 });
  const sY = useSpring(mouseY, { damping: 50, stiffness: 70 });

  const lx = useTransform(sX, [0, vw], [-14, 14]);
  const ly = useTransform(sY, [0, vh], [-10, 10]);
  const rx = useTransform(sX, [0, vw], [14, -14]);
  const ry = useTransform(sY, [0, vh], [10, -10]);

  useEffect(() => {
    const onMove = (e) => { mouseX.set(e.clientX); mouseY.set(e.clientY); };
    window.addEventListener('mousemove', onMove);
    return () => window.removeEventListener('mousemove', onMove);
  }, [mouseX, mouseY]);

  return (
    <div className="min-h-screen relative z-10 overflow-hidden flex items-center font-sans px-6 xl:px-12">
      <div className="w-full max-w-[1600px] mx-auto grid grid-cols-12 gap-5 items-center py-20">

        {/* ── LEFT PANEL ── */}
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ x: lx, y: ly }}
          className="col-span-4 flex flex-col gap-4"
        >
          {/* Header */}
          <div className="flex items-center gap-2 mb-1">
            <Activity size={9} className="text-cyan/40" />
            <span className="text-[8px] font-mono tracking-[0.6em] text-cyan/40 uppercase">System Status</span>
          </div>

          {/* Status rows */}
          <div className="space-y-px">
            {STATUS_ROWS.map((row, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 + i * 0.1, duration: 0.6 }}
                className="flex items-center justify-between py-2.5 border-b border-white/[0.04]"
              >
                <span className="text-[9px] font-mono text-white/25 uppercase tracking-widest">{row.label}</span>
                <div className="flex items-center gap-1.5">
                  {row.pulse && (
                    <motion.span
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.6 + i * 0.3, repeat: Infinity }}
                      className="w-1 h-1 rounded-full bg-cyan inline-block"
                    />
                  )}
                  <span className="text-[9px] font-mono text-cyan/55 tracking-wider">{row.value}</span>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Metrics 2×2 */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="grid grid-cols-2 gap-2 mt-1"
          >
            {METRICS.map((m, i) => (
              <div key={i} className="p-3 border border-white/[0.04] rounded-xl bg-white/[0.015]">
                <div className="text-[7px] font-mono text-white/20 uppercase tracking-widest mb-1.5">{m.label}</div>
                <div className="text-base font-mono font-bold text-white/60">{m.value}</div>
              </div>
            ))}
          </motion.div>

          {/* Log terminal */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="p-4 rounded-2xl border border-white/[0.04] bg-white/[0.01]"
          >
            <div className="flex items-center gap-2 mb-3">
              <Cpu size={8} className="text-white/20" />
              <span className="text-[7px] font-mono tracking-[0.5em] text-white/15 uppercase">System Log</span>
            </div>
            {LOGS.map((log, i) => (
              <motion.p
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 + i * 0.22, duration: 0.5 }}
                className="text-[9px] font-mono text-white/20 leading-relaxed"
              >
                {log}
              </motion.p>
            ))}
          </motion.div>
        </motion.div>

        {/* ── CENTER ── */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="col-span-4 flex flex-col items-center text-center"
        >
          {/* Status pill */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="flex items-center gap-2 mb-8 px-4 py-2 rounded-full border border-white/8 bg-white/[0.02]"
          >
            <motion.span
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 1.6, repeat: Infinity }}
              className="w-1.5 h-1.5 rounded-full bg-cyan block"
            />
            <span className="text-[8px] font-mono tracking-[0.4em] text-white/30 uppercase">
              Build v4.1 &nbsp;·&nbsp; Neural Core Active
            </span>
          </motion.div>

          {/* Title */}
          <h1 className="text-[18vw] lg:text-[140px] xl:text-[160px] font-black font-display leading-none tracking-tighter mb-4 text-white">
            AURA
          </h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-xs font-mono tracking-[0.35em] text-cyan/60 uppercase mb-5"
          >
            Your Intelligence. Mapped. Mastered.
          </motion.p>

          {/* Subtext */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="text-sm font-light text-white/25 max-w-[260px] mx-auto leading-relaxed mb-10"
          >
            Adaptive assessments. Cognitive analysis.<br />Precision paths to mastery.
          </motion.p>

          {/* CTA */}
          <motion.button
            onClick={onStart}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-12 py-5 rounded-full bg-white text-black font-bold tracking-[0.25em] uppercase text-xs overflow-hidden transition-all duration-500"
          >
            <span className="relative z-10 flex items-center gap-3">
              Begin Analysis
              <ChevronRight size={13} className="group-hover:translate-x-1 transition-transform" />
            </span>
            <motion.div className="absolute inset-0 bg-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </motion.button>

          {/* Footer tag */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 1 }}
            className="mt-10 text-[7px] font-mono tracking-[0.5em] text-white/10 uppercase"
          >
            Adaptive User Response Analyzer
          </motion.p>
        </motion.div>

        {/* ── RIGHT PANEL ── */}
        <motion.div
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          style={{ x: rx, y: ry }}
          className="col-span-4 flex flex-col gap-4"
        >
          {/* Header */}
          <div className="flex items-center justify-end gap-2 mb-1">
            <span className="text-[8px] font-mono tracking-[0.6em] text-cyan/40 uppercase">Skill Preview</span>
            <BarChart2 size={9} className="text-cyan/40" />
          </div>

          {/* Skill score cards */}
          {SKILL_CARDS.map((card, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + i * 0.14, duration: 0.7 }}
              className="p-4 border border-white/[0.05] rounded-2xl bg-white/[0.02] hover:border-white/10 transition-all duration-500"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="text-[7px] font-mono text-white/18 uppercase tracking-widest mb-1">{card.level}</div>
                  <div className="text-sm font-display font-black text-white/65 uppercase tracking-tight">{card.title}</div>
                </div>
                <span className="text-xl font-mono font-bold text-white/35">{card.score}</span>
              </div>
              <div className="h-px bg-white/[0.05] rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${card.score}%` }}
                  transition={{ delay: 0.9 + i * 0.14, duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
                  className="h-full bg-gradient-to-r from-cyan/30 to-cyan/70 rounded-full"
                />
              </div>
            </motion.div>
          ))}

          {/* Roadmap preview */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7, duration: 0.7 }}
            className="p-4 border border-white/[0.04] rounded-2xl bg-white/[0.01]"
          >
            <div className="flex items-center gap-2 mb-4">
              <GitBranch size={8} className="text-white/20" />
              <span className="text-[7px] font-mono tracking-[0.5em] text-white/15 uppercase">Roadmap Preview</span>
            </div>
            <div className="flex items-center">
              {ROADMAP.map((step, i) => (
                <React.Fragment key={i}>
                  <div className="flex flex-col items-center gap-1.5">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 1 + i * 0.1, duration: 0.4, type: 'spring' }}
                      className={`w-2 h-2 rounded-full ${i < 2 ? 'bg-cyan/60' : 'bg-white/10'}`}
                    />
                    <span className="text-[6px] font-mono text-white/20 uppercase">{step}</span>
                  </div>
                  {i < ROADMAP.length - 1 && (
                    <div className={`flex-1 h-px mb-3 mx-0.5 ${i < 1 ? 'bg-cyan/25' : 'bg-white/[0.04]'}`} />
                  )}
                </React.Fragment>
              ))}
            </div>
          </motion.div>

          {/* Progress summary */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.7 }}
            className="p-4 border border-white/[0.04] rounded-2xl bg-white/[0.01] flex items-center gap-4"
          >
            <TrendingUp size={16} className="text-cyan/30 shrink-0" />
            <div>
              <div className="text-[7px] font-mono text-white/15 uppercase tracking-widest mb-1">Avg Improvement</div>
              <div className="text-sm font-mono font-bold text-white/50">+31% <span className="text-white/20 text-[9px]">after first session</span></div>
            </div>
          </motion.div>
        </motion.div>

      </div>
    </div>
  );
};

export default LandingPage;
