import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, CheckCircle2, AlertTriangle, ArrowLeft } from 'lucide-react';
import { getTechnologiesByDomain } from '../data/dataset';

const TechSelector = ({ domain, selectedTechs, onToggle, onContinue, onBack }) => {
  const datasetTechs = useMemo(() => getTechnologiesByDomain(domain) || [], [domain]);
  
  const domainTechs = useMemo(() => datasetTechs.map(tech => ({
    id: tech.id,
    name: tech.name,
    category: tech.difficulty === 'beginner' || tech.difficulty === 'easy' ? 'Core' : 
              tech.difficulty === 'intermediate' || tech.difficulty === 'medium' ? 'Intermediate' : 'Advanced',
    coreConcepts: tech.core_concepts || []
  })), [datasetTechs]);

  if (domainTechs.length === 0) {
    return (
      <div className="min-h-screen relative z-10 flex flex-col items-center justify-center px-6 font-sans">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col items-center text-center gap-8 max-w-lg"
        >
          <div className="w-16 h-16 rounded-full border border-yellow-400/30 flex items-center justify-center mb-2">
            <AlertTriangle size={28} className="text-yellow-400/70" />
          </div>
          <div>
            <span className="text-[10px] font-mono tracking-[0.5em] text-white/20 uppercase block mb-4">
              No Data Available
            </span>
            <h2 className="text-4xl font-display font-black text-white tracking-tighter uppercase leading-tight mb-4">
              No Technologies Found
            </h2>
            <p className="text-sm text-white/30 font-mono leading-relaxed">
              This domain doesn&apos;t have any technologies in the dataset yet.
              Please choose a different domain to continue.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={onBack}
            className="flex items-center gap-3 px-10 py-4 rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-all duration-300 text-xs font-mono tracking-[0.2em] uppercase"
          >
            <ArrowLeft size={14} />
            Choose Different Domain
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 px-6 relative z-10 flex flex-col items-center font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-32"
      >
        <span className="text-[10px] font-mono tracking-[0.6em] text-cyan/50 uppercase mb-4 block">
          Phase 02 // Calibration
        </span>
        <h2 className="text-6xl md:text-8xl font-display font-black text-white tracking-tighter uppercase leading-none">
          Calibrate <br />
          <span className="text-white/20">Systems.</span>
        </h2>
      </motion.div>

      <div className="w-full max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-4">
        {domainTechs.map((tech, index) => {
          const isSelected = selectedTechs.includes(tech.id);
          return (
            <motion.button
              key={tech.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.8 }}
              onClick={() => onToggle(tech.id)}
              className={`group relative p-10 flex flex-col items-start border transition-all duration-500 rounded-[2rem] text-left
                ${isSelected 
                  ? 'bg-white text-black border-white' 
                  : 'bg-white/[0.02] border-white/5 hover:border-white/20'
                }
              `}
            >
              <div className="flex justify-between items-start w-full mb-8">
                <span className={`text-[10px] font-mono tracking-[0.2em] uppercase ${isSelected ? 'text-black/40' : 'text-white/20'}`}>
                  {tech.category}
                </span>
                {isSelected && <CheckCircle2 size={20} className="text-black" />}
              </div>

              <h3 className={`text-3xl md:text-4xl font-display font-black uppercase tracking-tighter mb-4 ${isSelected ? 'text-black' : 'text-white/60 group-hover:text-white'}`}>
                {tech.name}
              </h3>

              <div className="flex flex-wrap gap-2">
                {tech.coreConcepts?.slice(0, 3).map((concept, idx) => (
                  <span key={idx} className={`text-[9px] font-mono uppercase px-2 py-1 rounded-full border ${isSelected ? 'border-black/10 text-black/40' : 'border-white/5 text-white/20'}`}>
                    {concept.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </motion.button>
          );
        })}
      </div>

      {selectedTechs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-12 z-50"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onContinue}
            className="group relative px-20 py-6 rounded-full bg-white text-black font-bold tracking-[0.2em] uppercase text-xs overflow-hidden transition-all duration-500 shadow-2xl"
          >
            <span className="relative z-10 flex items-center gap-4">
              Initialize Test
              <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
            </span>
            <motion.div 
              className="absolute inset-0 bg-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            />
          </motion.button>
        </motion.div>
      )}
    </div>
  );
};

export default TechSelector;
