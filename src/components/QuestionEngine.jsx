import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { getQuestionsByTechnologies, formatQuestionsForEngine, getTechNameById } from '../data/dataset';

const QuestionEngine = ({ techs, domain, onComplete, onBack }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    if (!techs || techs.length === 0) return;
    const rawQuestions = getQuestionsByTechnologies(techs, 4);
    const formattedQuestions = formatQuestionsForEngine(rawQuestions).map(q => ({
      ...q,
      question: q.text || q.question,
      tech: q.technologyId
    }));
    setQuestions(formattedQuestions);
  }, [techs]);

  useEffect(() => {
    if (timeLeft > 0 && !isAnalyzing && selectedOption === null) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (timeLeft === 0 && selectedOption === null) {
      handleOptionSelect(-1);
    }
  }, [timeLeft, isAnalyzing, selectedOption]);

  const handleSkip = useCallback(() => {
    if (selectedOption !== null || questions.length === 0) return;
    setSelectedOption(-2);
    setIsAnalyzing(true);
    setTimeout(() => {
      const newAnswer = {
        questionId: questions[currentIndex].id,
        selected: -2,
        correct: false,
        skipped: true,
        difficulty: questions[currentIndex].difficulty,
        tech: questions[currentIndex].tech
      };
      const updatedAnswers = [...answers, newAnswer];
      setAnswers(updatedAnswers);
      setIsAnalyzing(false);
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(prev => prev + 1);
          setSelectedOption(null);
          setTimeLeft(60);
        } else {
          onComplete(updatedAnswers);
        }
      }, 400);
    }, 600);
  }, [selectedOption, questions, currentIndex, answers, onComplete]);

  const handleOptionSelect = useCallback((optionIndex) => {
    if (selectedOption !== null || questions.length === 0) return;
    setSelectedOption(optionIndex);
    setIsAnalyzing(true);
    
    setTimeout(() => {
      const isCorrect = optionIndex === questions[currentIndex].correctAnswer;
      const newAnswer = { 
        questionId: questions[currentIndex].id,
        selected: optionIndex,
        correct: isCorrect,
        difficulty: questions[currentIndex].difficulty,
        tech: questions[currentIndex].tech
      };
      
      const updatedAnswers = [...answers, newAnswer];
      setAnswers(updatedAnswers);
      setIsAnalyzing(false);
      
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex(prev => prev + 1);
          setSelectedOption(null);
          setTimeLeft(60);
        } else {
          onComplete(updatedAnswers);
        }
      }, 600);
    }, 1200);
  }, [selectedOption, questions, currentIndex, answers, onComplete]);

  if (questions.length === 0) return null;
  
  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-6 relative z-20 font-sans">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-5xl w-full"
      >
        {/* Minimal Progress/Time HUD */}
        <div className="flex justify-between items-center mb-24">
          <div className="flex items-center gap-6">
            {/* Back button */}
            {onBack && selectedOption === null && (
              <motion.button
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={onBack}
                className="flex items-center gap-2 text-[10px] font-mono tracking-[0.4em] text-white/25 hover:text-cyan-400 uppercase transition-colors duration-300"
              >
                <ChevronLeft size={14} />
                Back
              </motion.button>
            )}
            <div className="flex flex-col opacity-40">
              <span className="text-[10px] font-mono tracking-[0.4em] uppercase mb-2">Sequence</span>
              <span className="text-xl font-display font-black text-white">
                0{currentIndex + 1} <span className="text-white/20">/ 0{questions.length}</span>
              </span>
            </div>
          </div>

          {/* ── Creative circular countdown timer ── */}
          {(() => {
            const TOTAL = 60;
            const RADIUS = 26;
            const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
            const progress = timeLeft / TOTAL;
            const offset = CIRCUMFERENCE * (1 - progress);
            const isUrgent = timeLeft < 15;
            const isMid = timeLeft < 30;
            const ringColor = isUrgent ? '#ef4444' : isMid ? '#22d3ee' : 'rgba(255,255,255,0.7)';
            const glowColor = isUrgent ? 'rgba(239,68,68,0.6)' : isMid ? 'rgba(34,211,238,0.5)' : 'rgba(255,255,255,0.2)';
            return (
              <motion.div
                animate={isUrgent ? { scale: [1, 1.06, 1] } : { scale: 1 }}
                transition={{ duration: 0.5, repeat: isUrgent ? Infinity : 0 }}
                className="relative flex items-center justify-center"
                style={{ width: 72, height: 72 }}
              >
                <svg width="72" height="72" style={{ transform: 'rotate(-90deg)' }}>
                  {/* Track ring */}
                  <circle
                    cx="36" cy="36" r={RADIUS}
                    fill="none"
                    stroke="rgba(255,255,255,0.06)"
                    strokeWidth="2"
                  />
                  {/* Depleting arc */}
                  <circle
                    cx="36" cy="36" r={RADIUS}
                    fill="none"
                    stroke={ringColor}
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={CIRCUMFERENCE}
                    strokeDashoffset={offset}
                    style={{
                      transition: 'stroke-dashoffset 1s linear, stroke 0.5s ease',
                      filter: `drop-shadow(0 0 6px ${glowColor})`,
                    }}
                  />
                </svg>
                {/* Center number */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span
                    className="font-mono font-bold leading-none"
                    style={{
                      fontSize: 15,
                      color: ringColor,
                      textShadow: `0 0 10px ${glowColor}`,
                      transition: 'color 0.5s ease',
                    }}
                  >
                    {timeLeft}
                  </span>
                  <span className="text-[7px] font-mono tracking-widest text-white/20 uppercase mt-0.5">sec</span>
                </div>
              </motion.div>
            );
          })()}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="mb-20">
              {(() => {
                const text = currentQuestion.question || '';
                
                // If the question contains code blocks, parse them
                if (text.includes('```')) {
                  const parts = text.split(/(```[\s\S]*?```)/g);
                  return parts.map((part, index) => {
                    if (part.startsWith('```')) {
                      const code = part.replace(/^```[a-zA-Z]*\n?/g, '').replace(/```$/g, '').trim();
                      return (
                        <div key={index} className="mt-8 mb-8 p-6 bg-white/5 border border-white/10 rounded-lg overflow-x-auto">
                          <pre className="text-sm md:text-base font-mono text-white/90 normal-case tracking-normal whitespace-pre-wrap text-left">
                            <code>{code}</code>
                          </pre>
                        </div>
                      );
                    }
                    if (part.trim()) {
                      return (
                        <h2 key={index} className="text-4xl md:text-6xl font-display font-black text-white leading-tight uppercase tracking-tighter inline">
                          {part}
                        </h2>
                      );
                    }
                    return null;
                  });
                }
                
                // Otherwise just render as normal
                return (
                  <h2 className="text-4xl md:text-6xl font-display font-black text-white leading-tight uppercase tracking-tighter">
                    {text}
                  </h2>
                );
              })()}
            </div>

            <div className="space-y-4">
              {currentQuestion.options.map((option, idx) => (
                <motion.button
                  key={idx}
                  onClick={() => handleOptionSelect(idx)}
                  disabled={selectedOption !== null}
                  className={`group relative w-full py-9 px-12 flex items-center justify-between border-b transition-all duration-500 text-left
                    ${selectedOption === idx 
                      ? 'border-white text-white' 
                      : 'border-white/5 text-white/30 hover:border-white/20 hover:text-white/60'
                    }
                  `}
                >
                  <span className="text-xl md:text-2xl font-light tracking-wide">{option}</span>
                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all duration-500
                    ${selectedOption === idx ? 'bg-white border-white' : 'border-white/10 group-hover:border-white/30'}
                  `}>
                    {selectedOption === idx && <div className="w-2 h-2 bg-black rounded-full" />}
                  </div>
                </motion.button>
              ))}
            </div>

            {/* Don't Know / Skip */}
            {selectedOption === null && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="flex justify-center mt-12"
              >
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  onClick={handleSkip}
                  className="flex items-center gap-3 px-8 py-3 rounded-full border border-white/8 text-white/25 hover:text-white/50 hover:border-white/20 transition-all duration-300 text-[10px] font-mono tracking-[0.35em] uppercase"
                >
                  <span className="w-3 h-px bg-white/20" />
                  Don&apos;t Know — Skip
                  <span className="w-3 h-px bg-white/20" />
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Simplified Analyzing Overlay */}
      <AnimatePresence>
        {isAnalyzing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-2xl flex items-center justify-center"
          >
            <div className="text-center">
              <motion.div
                animate={{ scale: [1, 1.2, 1], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="w-24 h-24 rounded-full border border-white/20 flex items-center justify-center mb-8"
              >
                <div className="w-2 h-2 bg-white rounded-full shadow-[0_0_20px_rgba(255,255,255,1)]" />
              </motion.div>
              <span className="text-[10px] font-mono tracking-[0.8em] text-white/40 uppercase">Processing</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QuestionEngine;
