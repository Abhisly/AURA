import { motion } from 'framer-motion';
import { getConceptsByTechnology, getTechNameById } from '../data/dataset';
import { ChevronRight } from 'lucide-react';

const AnalysisScreen = ({ domain, techs, answers, onContinue }) => {
  const totalQuestions = answers.length;
  const correctAnswers = answers.filter(a => a.correct).length;
  const accuracy = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;
  
  const techPerformance = {};
  answers.forEach(a => {
    if (!techPerformance[a.tech]) {
      techPerformance[a.tech] = { correct: 0, total: 0, name: getTechNameById(a.tech) };
    }
    techPerformance[a.tech].total++;
    if (a.correct) techPerformance[a.tech].correct++;
  });
  
  const getSkillLevel = () => {
    if (accuracy >= 80) return { level: 'Alpha', label: 'Exceptional Alignment' };
    if (accuracy >= 60) return { level: 'Beta', label: 'Baseline Established' };
    return { level: 'Gamma', label: 'Calibration Required' };
  };

  const skill = getSkillLevel();

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-6 py-24 relative z-20 font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-4xl w-full text-center"
      >
        <span className="text-[10px] font-mono tracking-[0.6em] text-cyan/50 uppercase mb-8 block">
          Assessment Complete // Diagnostic
        </span>

        <div className="mb-20">
          <h2 className="text-8xl md:text-[120px] font-display font-black text-white tracking-tighter uppercase leading-none mb-4">
            {accuracy}<span className="text-white/20">%</span>
          </h2>
          <p className="text-xl md:text-2xl font-light text-white/40 uppercase tracking-[0.2em]">
            Tier: <span className="text-white">{skill.level}</span> — {skill.label}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-24 text-left border-t border-white/5 pt-12">
          {Object.entries(techPerformance).map(([tech, perf], idx) => (
            <div key={tech} className="space-y-4">
              <div className="flex justify-between items-end">
                <span className="text-[10px] font-mono text-white/20 uppercase tracking-widest">{perf.name}</span>
                <span className="text-sm font-light text-white/60">{Math.round((perf.correct / perf.total) * 100)}%</span>
              </div>
              <div className="h-[1px] w-full bg-white/5 relative">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${(perf.correct / perf.total) * 100}%` }}
                  transition={{ duration: 1.5, delay: 0.5 + idx * 0.2 }}
                  className="absolute top-0 left-0 h-full bg-cyan/40"
                />
              </div>
            </div>
          ))}
        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onContinue}
          className="group relative px-16 py-6 rounded-full bg-white text-black font-bold tracking-[0.2em] uppercase text-xs overflow-hidden transition-all duration-500"
        >
          <span className="relative z-10 flex items-center gap-4">
            Generate Evolution Path
            <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </span>
          <motion.div 
            className="absolute inset-0 bg-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          />
        </motion.button>
      </motion.div>
    </div>
  );
};

export default AnalysisScreen;
