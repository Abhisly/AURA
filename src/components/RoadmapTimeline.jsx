import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight } from 'lucide-react';
import { getRoadmapByTechnology } from '../data/dataset';

// Helper to convert dataset roadmap to component format
const getRoadmapData = (techId) => {
  const roadmap = getRoadmapByTechnology(techId);
  if (!roadmap) return null;
  
  const weeks = [];
  const weekKeys = ['week1', 'week2', 'week3', 'week4'];
  const weekTitles = [
    'Foundation & Core Concepts',
    'Intermediate Concepts', 
    'Advanced Topics & Integration',
    'Mastery & Specialization'
  ];
  
  weekKeys.forEach((key, index) => {
    if (roadmap.roadmap[key]) {
      const days = roadmap.roadmap[key].map((task, dayIndex) => ({
        day: index * 7 + dayIndex + 1,
        task,
        completed: false
      }));
      
      weeks.push({
        week: index + 1,
        title: weekTitles[index],
        days
      });
    }
  });
  
  return { weeks, technology: roadmap.technology };
};

const RoadmapTimeline = ({ onContinue, techId }) => {
  const [expandedWeek, setExpandedWeek] = useState(0);
  const roadmapData = getRoadmapData(techId) || getRoadmapData('tech_c');
  const { weeks, technology } = roadmapData;

  return (
    <div className="min-h-screen py-24 px-6 relative z-10 flex flex-col items-center font-sans">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="text-center mb-32"
      >
        <span className="text-[10px] font-mono tracking-[0.6em] text-cyan/50 uppercase mb-4 block">
          Phase 03 // Evolution
        </span>
        <h2 className="text-6xl md:text-8xl font-display font-black text-white tracking-tighter uppercase leading-none">
          Projected <br />
          <span className="text-white/20">Pathway.</span>
        </h2>
      </motion.div>

      <div className="w-full max-w-4xl space-y-4">
        {weeks.map((week, weekIndex) => (
          <div key={week.week} className="border-b border-white/5 overflow-hidden">
            <button
              onClick={() => setExpandedWeek(expandedWeek === weekIndex ? null : weekIndex)}
              className="w-full py-10 flex items-center justify-between group"
            >
              <div className="flex items-center gap-12">
                <span className="text-sm font-mono text-white/20 group-hover:text-cyan/60 transition-colors">
                  P0{week.week}
                </span>
                <h3 className={`text-2xl md:text-4xl font-display font-black uppercase tracking-tighter transition-all duration-500
                  ${expandedWeek === weekIndex ? 'text-white' : 'text-white/40 group-hover:text-white/60'}
                `}>
                  {week.title}
                </h3>
              </div>
              <motion.div
                animate={{ rotate: expandedWeek === weekIndex ? 45 : 0 }}
                className={`text-white/20 group-hover:text-cyan transition-colors`}
              >
                <ChevronRight size={24} />
              </motion.div>
            </button>

            <AnimatePresence>
              {expandedWeek === weekIndex && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="pb-12 grid grid-cols-1 md:grid-cols-2 gap-4"
                >
                  {week.days.map((day) => (
                    <div 
                      key={day.day}
                      className="p-6 rounded-2xl bg-white/[0.02] border border-white/5 flex items-start gap-4"
                    >
                      <span className="text-[10px] font-mono text-cyan/40 mt-1">{String(day.day).padStart(2, '0')}</span>
                      <p className="text-sm text-white/60 font-light leading-relaxed">{day.task}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mt-32"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onContinue}
          className="group relative px-16 py-6 rounded-full bg-white text-black font-bold tracking-[0.2em] uppercase text-xs overflow-hidden transition-all duration-500"
        >
          <span className="relative z-10 flex items-center gap-4">
            Initialize Mentor
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

export default RoadmapTimeline;
