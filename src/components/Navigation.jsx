import { motion } from 'framer-motion';
import { User, LogOut } from 'lucide-react';

const Navigation = ({ currentStep, onBack, onLogout, userProfile, showBack = true }) => {
  return (
    <>
      {/* Top Navigation Bar */}
      <motion.nav 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-8 pointer-events-none"
      >
        {/* Minimal Logo */}
        <div className="pointer-events-auto">
          <h1 className="text-xl font-display font-black tracking-[0.4em] text-white/90 leading-none">
            AURA
          </h1>
        </div>

        {/* Minimal Controls */}
        <div className="flex items-center gap-12 pointer-events-auto">
          {showBack && currentStep !== 'landing' && (
            <button
              onClick={onBack}
              className="text-[10px] font-mono tracking-[0.4em] text-white/30 hover:text-cyan transition-colors uppercase"
            >
              Back
            </button>
          )}

          {userProfile && (
            <div className="flex items-center gap-8">
              <div className="flex flex-col items-end">
                <span className="text-[8px] font-mono tracking-[0.3em] text-white/20 uppercase">Operator</span>
                <span className="text-[10px] font-mono tracking-[0.2em] text-white/60 uppercase">{userProfile.role}</span>
              </div>
              <button 
                onClick={onLogout}
                className="w-10 h-10 rounded-full border border-white/5 flex items-center justify-center text-white/20 hover:text-red-400 hover:border-red-500/20 transition-all duration-500 group relative"
              >
                <LogOut size={14} />
                <div className="absolute top-full right-0 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-[8px] font-mono tracking-[0.3em] text-red-400 uppercase">Disconnect</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </motion.nav>
    </>
  );
};

export default Navigation;
