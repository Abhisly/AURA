import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { getDomains } from '../data/dataset';

const DomainSelector = ({ onSelect }) => {
  const domains = useMemo(() => getDomains(), []);

  return (
    <div className="min-h-screen py-24 px-6 relative z-10 flex flex-col items-center font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-32"
      >
        <span className="text-[10px] font-mono tracking-[0.6em] text-cyan/50 uppercase mb-4 block">
          Phase 01 // Selection
        </span>
        <h2 className="text-6xl md:text-8xl font-display font-black text-white tracking-tighter uppercase leading-none">
          Choose <br />
          <span className="text-white/20">Destiny.</span>
        </h2>
      </motion.div>

      <div className="w-full max-w-screen-xl mx-auto space-y-4">
        {domains.map((domain, index) => (
          <motion.button
            key={domain.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.8 }}
            onClick={() => onSelect(domain.id)}
            className="group relative w-full py-12 flex flex-col md:flex-row items-center justify-between border-b border-white/5 hover:border-cyan/40 transition-colors duration-500 text-left"
          >
            <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 md:gap-16 w-full">
              <span className="text-[14px] font-mono text-white/20 group-hover:text-cyan/60 transition-colors">
                0{index + 1}
              </span>
              <h3 className="text-4xl md:text-6xl font-display font-black text-white/40 group-hover:text-white transition-all duration-500 uppercase tracking-tighter">
                {domain.name}
              </h3>
              <p className="hidden md:block text-white/10 group-hover:text-white/40 transition-colors duration-500 text-sm max-w-md font-light tracking-wide">
                {domain.description}
              </p>
            </div>

            <div className="relative z-10 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span className="text-[10px] font-mono text-cyan uppercase tracking-[0.3em]">Initialize</span>
              <div className="w-12 h-12 rounded-full border border-cyan/30 flex items-center justify-center text-cyan group-hover:bg-cyan group-hover:text-black transition-all duration-500">
                <ChevronRight size={24} />
              </div>
            </div>

            {/* Hover Reveal Background */}
            <motion.div 
              className="absolute inset-0 bg-white/[0.02] opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10"
              layoutId="reveal"
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default DomainSelector;
