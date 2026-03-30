import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';

const DEMO_USER = 'demo';
const DEMO_PASS = 'skillgap2024';

const LOADING_STATES = [
  'Establishing secure connection...',
  'Verifying credentials...',
  'Syncing user profile...',
  'Access granted.',
];

const AuthScreen = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError]       = useState('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [loadingText, setLoadingText] = useState(LOADING_STATES[0]);
  const [isLoginOpen, setIsLoginOpen] = useState(false);

  // Parallax Engine
  const vw = typeof window !== 'undefined' ? window.innerWidth  : 1440;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 900;
  
  const mouseX = useMotionValue(vw / 2);
  const mouseY = useMotionValue(vh / 2);
  
  const springCfg = { damping: 50, stiffness: 60, mass: 1 };
  const sX = useSpring(mouseX, springCfg);
  const sY = useSpring(mouseY, springCfg);

  const coreX = useTransform(sX, [0, vw], [-15, 15]);
  const coreY = useTransform(sY, [0, vh], [-15, 15]);

  const sat1X = useTransform(sX, [0, vw], [-45, 45]);
  const sat1Y = useTransform(sY, [0, vh], [-45, 45]);
  
  const sat2X = useTransform(sX, [0, vw], [65, -65]);
  const sat2Y = useTransform(sY, [0, vh], [35, -35]);

  const sat3X = useTransform(sX, [0, vw], [-35, 35]);
  const sat3Y = useTransform(sY, [0, vh], [65, -65]);

  useEffect(() => {
    const handleMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, [mouseX, mouseY]);

  useEffect(() => {
    if (!isAuthenticating) return;
    let step = 0;
    const id = setInterval(() => {
      step++;
      if (step < LOADING_STATES.length) setLoadingText(LOADING_STATES[step]);
      else clearInterval(id);
    }, 500);
    return () => clearInterval(id);
  }, [isAuthenticating]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isSignUp) {
      if (!fullName.trim() || !username.trim() || !password.trim()) {
        setError('All fields are required.');
        return;
      }
      try {
        setIsAuthenticating(true);
        const res = await fetch('/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ fullName, email: username, password })
        });
        const data = await res.json();
        
        if (!res.ok) {
          setIsAuthenticating(false);
          setError(data.error || 'Registration failed');
          return;
        }
        
        setTimeout(() => onLogin(data.user), 2000);
      } catch (err) {
        setIsAuthenticating(false);
        setError('Network error connecting to API');
      }
    } else {
      if (!username.trim() || !password.trim()) { 
        setError('Email and password are required.'); 
        return; 
      }
      
      try {
        setIsAuthenticating(true);
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ identifier: username, password })
        });
        const data = await res.json();

        if (!res.ok) {
          setIsAuthenticating(false);
          setError(data.error || 'Login failed');
          return;
        }

        setTimeout(() => onLogin(data.user), 2000);
      } catch (err) {
        setIsAuthenticating(false);
        setError('Network error connecting to API');
      }
    }
  };

  const toggleMode = () => {
    setIsSignUp(!isSignUp);
    setError('');
    setUsername('');
    setPassword('');
    setFullName('');
  };

  return (
    <div className="min-h-screen w-full relative z-20 font-sans text-white overflow-hidden flex items-center">
      
      {/* ── Background Giant Typography ── */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120vw] text-center pointer-events-none opacity-[0.04] flex flex-col mix-blend-plus-lighter z-0">
        <motion.h1 
          initial={{ x: -100 }}
          animate={{ x: 0 }}
          transition={{ duration: 10, ease: 'easeOut' }}
          className="text-[22vw] font-black font-display tracking-tighter leading-[0.75] select-none text-white whitespace-nowrap"
        >
          SKILLGAP
        </motion.h1>
        <motion.h1 
          initial={{ x: 100 }}
          animate={{ x: 0 }}
          transition={{ duration: 10, ease: 'easeOut' }}
          className="text-[22vw] font-black font-display tracking-tighter leading-[0.75] select-none text-cyan-400 whitespace-nowrap -mt-12"
        >
          AURA
        </motion.h1>
      </div>

      {/* Ambient glowing orbs */}
      <div className="absolute top-1/3 left-20 w-96 h-96 bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen" />
      <div className="absolute bottom-1/4 right-20 w-[30rem] h-[30rem] bg-indigo-600/10 rounded-full blur-[150px] pointer-events-none z-0 mix-blend-screen" />

      {/* ── Top Nav / Branding ── */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: 'easeOut' }}
        className="absolute top-10 left-10 md:left-20 flex gap-4 items-center z-20"
      >
        <ShieldCheck size={18} className="text-cyan-400" />
        <span className="text-[10px] font-mono tracking-[0.4em] uppercase text-cyan-50">
          AURA Node // v2.0
        </span>
      </motion.div>

      {/* ── Top Right Login Toggle Button ── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
        className="absolute top-8 right-10 md:right-20 z-50"
      >
        <button
          onClick={() => setIsLoginOpen(!isLoginOpen)}
          className="group relative px-8 py-3 rounded-full bg-white/5 border border-white/10 backdrop-blur-md overflow-hidden hover:border-cyan-500/50 transition-colors"
        >
          <span className="text-xs font-medium tracking-widest uppercase text-cyan-50 group-hover:text-cyan-100 transition-colors z-10 relative">
            {isLoginOpen ? 'Close Portal' : 'Access Portal'}
          </span>
          <div className="absolute inset-0 bg-cyan-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10 blur-xl" />
        </button>
      </motion.div>

      {/* ── SPATIAL AVANT-GARDE LAYOUT ── */}
      <div className="absolute inset-0 w-full h-full overflow-hidden flex items-center justify-center z-10 pointer-events-none pb-10">
        
        {/* Everything inside gets pointer-events-auto but the container passes clicks through */}
        <div 
          className="relative w-full max-w-[1800px] h-full flex items-center justify-center pointer-events-auto" 
          style={{ pointerEvents: isLoginOpen ? 'none' : 'auto' }}
        >
          
          {/* THE CORE (Center) */}
          <motion.div 
            style={{ x: coreX, y: coreY }}
            animate={{ 
              filter: isLoginOpen ? 'blur(10px)' : 'blur(0px)',
              opacity: isLoginOpen ? 0 : 1,
              scale: isLoginOpen ? 0.9 : 1
            }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="absolute z-20 flex flex-col items-center justify-center w-full"
          >
            {/* Massive Kinetic Typography */}
            <div className="relative z-30 flex flex-col items-center justify-center w-full select-none cursor-default group">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, delay: 0.1 }}
                  className="flex items-center gap-3 mb-4"
                >
                  <div className="h-[1px] w-12 bg-gradient-to-r from-transparent to-white/30" />
                  <span className="text-[10px] sm:text-xs font-mono tracking-[0.6em] text-white/50 uppercase">Cognitive Node</span>
                  <div className="h-[1px] w-12 bg-gradient-to-l from-transparent to-white/30" />
                </motion.div>
                
                <motion.h1 
                  initial={{ opacity: 0, scale: 0.85, filter: 'blur(10px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
                  className="text-[12vw] md:text-[8rem] lg:text-[11rem] font-display font-black leading-[0.8] tracking-tighter text-center text-white mix-blend-overlay opacity-90 transition-opacity duration-1000 group-hover:opacity-100"
                >
                  MASTER <br className="hidden md:block"/> THE <br className="hidden md:block"/> UNKNOWN.
                </motion.h1>
            </div>

            {/* Interactive Neural Core SVG (lies beneath the text) */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[40rem] h-[40rem] flex items-center justify-center pointer-events-none -z-10 opacity-30 mix-blend-screen">
              <svg viewBox="0 0 400 400" className="w-full h-full animate-[spin_60s_linear_infinite]">
                <circle cx="200" cy="200" r="180" fill="none" stroke="#22d3ee" strokeWidth="0.5" strokeDasharray="4 12" />
                <circle cx="200" cy="200" r="140" fill="none" stroke="#6366f1" strokeWidth="1" strokeDasharray="20 40" className="opacity-50" />
                <circle cx="200" cy="200" r="100" fill="none" stroke="#3b82f6" strokeWidth="2" strokeDasharray="60 30" className="opacity-80" />
              </svg>
            </div>
          </motion.div>

          {/* SATELLITE 1: Adaptive AI (Top Left) */}
          <motion.div 
            style={{ x: sat1X, y: sat1Y }}
            animate={{ 
              opacity: isLoginOpen ? 0 : 1, 
              filter: isLoginOpen ? 'blur(10px)' : 'blur(0px)'
            }}
            transition={{ duration: 0.8 }}
            className="absolute top-[10%] md:top-[15%] left-[5%] md:left-[10%] lg:left-[15%] z-30 hidden sm:block"
          >
            <div className="group relative w-64 p-6 rounded-[2rem] bg-black/20 backdrop-blur-3xl border border-white/5 hover:border-cyan-400/40 hover:bg-black/40 transition-all duration-700 cursor-crosshair shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
               <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
               <div className="relative z-10">
                  <div className="w-10 h-10 rounded-full border border-cyan-500/20 bg-black flex items-center justify-center mb-4 group-hover:bg-cyan-500/10 transition-colors duration-500 shadow-inner">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_15px_#22d3ee]" />
                  </div>
                  <p className="text-[9px] font-mono tracking-[0.3em] text-cyan-300/70 uppercase mb-2">Phase_01</p>
                  <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-cyan-100 transition-colors">Cognitive <br/> Adaptive AI</h3>
                  <p className="text-[11px] font-light text-white/40 leading-relaxed group-hover:text-white/70 transition-colors duration-500">Algorithms dynamically recalibrate difficulty vectors based on real-time neural feedback.</p>
               </div>
            </div>
          </motion.div>

          {/* SATELLITE 2: Vector Path (Bottom Right) */}
          <motion.div 
            style={{ x: sat2X, y: sat2Y }}
            animate={{ 
              opacity: isLoginOpen ? 0 : 1, 
              filter: isLoginOpen ? 'blur(10px)' : 'blur(0px)'
            }}
            transition={{ duration: 0.8 }}
            className="absolute bottom-[10%] md:bottom-[15%] right-[5%] md:right-[10%] lg:right-[15%] z-30 hidden sm:block"
          >
            <div className="group relative w-64 p-6 rounded-[2rem] bg-black/20 backdrop-blur-3xl border border-white/5 hover:border-indigo-400/40 hover:bg-black/40 transition-all duration-700 cursor-crosshair shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
               <div className="absolute inset-0 rounded-[2rem] bg-gradient-to-br from-indigo-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
               <div className="relative z-10">
                  <div className="w-10 h-10 rounded-full border border-indigo-500/20 bg-black flex items-center justify-center mb-4 group-hover:bg-indigo-500/10 transition-colors duration-500 shadow-inner">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_15px_#818cf8]" />
                  </div>
                  <p className="text-[9px] font-mono tracking-[0.3em] text-indigo-300/70 uppercase mb-2">Vector_03</p>
                  <h3 className="text-xl font-display font-bold text-white mb-2 group-hover:text-indigo-100 transition-colors">Path <br/> Synthesis</h3>
                  <p className="text-[11px] font-light text-white/40 leading-relaxed group-hover:text-white/70 transition-colors duration-500">Hyper-optimized continuous learning roadmaps mathematically engineered for velocity.</p>
               </div>
            </div>
          </motion.div>

          {/* SATELLITE 3: Deep Mapping (Center Left/Bottom Left focus) */}
          <motion.div 
            style={{ x: sat3X, y: sat3Y }}
            animate={{ 
              opacity: isLoginOpen ? 0 : 1, 
              filter: isLoginOpen ? 'blur(10px)' : 'blur(0px)'
            }}
            transition={{ duration: 0.8 }}
            className="absolute bottom-[5%] md:bottom-[25%] left-[10%] md:left-[25%] lg:left-[20%] z-20 hidden lg:block"
          >
            <div className="group relative w-48 p-5 rounded-3xl bg-black/10 backdrop-blur-3xl border border-white/5 hover:border-blue-400/40 hover:bg-black/30 transition-all duration-700 cursor-crosshair shadow-xl">
               <div className="flex items-center gap-4 relative z-10">
                  <div className="w-8 h-8 rounded-full border border-blue-500/20 bg-black flex items-center justify-center">
                    <svg viewBox="0 0 24 24" fill="none" className="w-3.5 h-3.5 text-blue-400" stroke="currentColor" strokeWidth="2">
                      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-blue-200 transition-colors">Deep Mapping</h3>
                    <p className="text-[8px] font-mono text-white/40 uppercase tracking-widest mt-1">Core // 02</p>
                  </div>
               </div>
            </div>
          </motion.div>

        </div>
      </div>

      {/* ── Fullscreen Center Blurred Login Modal ── */}
      <AnimatePresence>
        {isLoginOpen && (
          <motion.div 
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ opacity: 1, backdropFilter: 'blur(34px)' }}
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-40 bg-black/40 flex items-center justify-center p-6"
          >
            {/* Boxless Form Container */}
            <motion.div 
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="w-full max-w-md flex flex-col"
            >
              
              <div className="text-center mb-16">
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="w-16 h-16 mx-auto bg-gradient-to-br from-cyan-400/20 to-blue-600/20 rounded-full border border-white/10 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,211,238,0.2)]"
                >
                  <ShieldCheck size={28} className="text-cyan-400" />
                </motion.div>
                <h3 className="text-5xl font-display font-light tracking-tighter text-white mb-4">
                  {isSignUp ? 'Create Account' : 'Welcome Back'}
                </h3>
                <p className="text-white/50 text-base font-light tracking-wide">
                  {isSignUp ? 'Sign up to begin your personalized journey.' : 'Log in to continue to your dashboard.'}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-8 relative z-10 w-full px-6 md:px-0">
                <AnimatePresence mode="popLayout">
                  {isSignUp && (
                    <motion.div 
                      initial={{ opacity: 0, y: -10, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -10, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex flex-col gap-2 relative group"
                    >
                      <User size={20} className="absolute left-0 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-cyan-400 transition-colors" />
                      <input
                        type="text"
                        value={fullName}
                        onChange={(e) => { setFullName(e.target.value); setError(''); }}
                        placeholder="Full Name"
                        className="w-full bg-transparent border-b-2 border-white/10 py-4 pl-10 text-xl font-light tracking-wide placeholder:text-white/20 outline-none transition-all duration-300 text-white focus:border-cyan-400 focus:text-white focus:placeholder:opacity-0"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Email Field */}
                <div className="flex flex-col gap-2 relative group">
                  <Mail size={20} className="absolute left-0 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => { setUsername(e.target.value); setError(''); }}
                    placeholder="Email Address"
                    autoComplete="off"
                    className="w-full bg-transparent border-b-2 border-white/10 py-4 pl-10 text-xl font-light tracking-wide placeholder:text-white/20 outline-none transition-all duration-300 text-white focus:border-cyan-400 focus:text-white focus:placeholder:opacity-0"
                  />
                </div>

                {/* Password Field */}
                <div className="flex flex-col gap-2 relative group">
                  <Lock size={20} className="absolute left-0 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-cyan-400 transition-colors" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="Password"
                    className="w-full bg-transparent border-b-2 border-white/10 py-4 pl-10 text-xl font-light tracking-wide placeholder:text-white/20 outline-none transition-all duration-300 text-white focus:border-cyan-400 focus:text-white focus:placeholder:opacity-0"
                  />
                </div>

                <div className="min-h-[20px] -mt-2 text-center">
                  <AnimatePresence>
                    {error && (
                      <motion.p
                        initial={{ opacity: 0, y: -5 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        className="text-red-400 text-xs font-medium tracking-widest uppercase"
                      >
                        {error}
                      </motion.p>
                    )}
                  </AnimatePresence>
                </div>

                {/* Submit Button */}
                <div className="mt-4 flex justify-center">
                  {isAuthenticating ? (
                    <div className="flex items-center justify-center gap-4 py-4">
                      <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin" />
                      <span className="text-sm font-medium text-cyan-100 tracking-widest">
                        {loadingText}
                      </span>
                    </div>
                  ) : (
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="group flex flex-col items-center gap-3 relative overflow-visible"
                    >
                      <div className="w-16 h-16 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_30px_rgba(255,255,255,0.2)] group-hover:shadow-[0_0_40px_rgba(34,211,238,0.5)] group-hover:text-cyan-600 group-hover:bg-cyan-50 transition-all duration-300">
                        <ArrowRight size={28} className="group-hover:translate-x-1 transition-transform duration-300" />
                      </div>
                      <span className="text-[10px] font-bold tracking-[0.3em] uppercase text-white/50 group-hover:text-cyan-300 transition-colors duration-300 absolute -bottom-8 whitespace-nowrap">
                        {isSignUp ? 'Create' : 'Execute'}
                      </span>
                    </motion.button>
                  )}
                </div>
              </form>

              {/* Switch Mode Toggle */}
              <div className="mt-20 text-center relative z-10 w-full">
                <p className="text-xs text-white/40">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                  <button 
                    type="button"
                    onClick={toggleMode}
                    className="ml-3 text-cyan-400 hover:text-cyan-300 font-medium tracking-widest uppercase transition-colors focus:outline-none"
                  >
                    {isSignUp ? 'Log in' : 'Create one'}
                  </button>
                </p>
              </div>

              {/* Minimalist Demo Credentials */}
              {!isSignUp && (
                <div className="mt-12 flex justify-center gap-12 pt-6 border-t border-white/5 opacity-40 hover:opacity-100 transition-opacity duration-300">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[9px] font-medium text-white/50 uppercase tracking-[0.2em]">Demo Email</span>
                    <span className="text-xs font-mono text-cyan-100 tracking-wider">demo</span>
                  </div>
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-[9px] font-medium text-white/50 uppercase tracking-[0.2em]">Demo Pass</span>
                    <span className="text-xs font-mono text-cyan-100 tracking-wider">skillgap2024</span>
                  </div>
                </div>
              )}
              
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AuthScreen;
