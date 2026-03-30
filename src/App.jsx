import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AnimatedBackground from './components/AnimatedBackground';
import Navigation from './components/Navigation';
import AuthScreen from './components/AuthScreen';
import LandingPage from './components/LandingPage';
import DomainSelector from './components/DomainSelector';
import TechSelector from './components/TechSelector';
import QuestionEngine from './components/QuestionEngine';
import AnalysisScreen from './components/AnalysisScreen';
import RoadmapTimeline from './components/RoadmapTimeline';
import MentorPanel from './components/MentorPanel';
import Dashboard from './components/Dashboard';

const SESSION_KEY = 'skillgap_session';

// Step definitions
const STEPS = {
  AUTH:      'auth',
  LANDING:   'landing',
  DOMAIN:    'domain',
  TECH:      'tech',
  TEST:      'test',
  ANALYSIS:  'analysis',
  ROADMAP:   'roadmap',
  MENTOR:    'mentor',
  DASHBOARD: 'dashboard',
};

// Step order for back-navigation (assessment flow only)
const STEP_ORDER = [
  STEPS.LANDING,
  STEPS.DOMAIN,
  STEPS.TECH,
  STEPS.TEST,
  STEPS.ANALYSIS,
  STEPS.ROADMAP,
  STEPS.MENTOR,
];

function App() {
  const [isAuthenticated, setIsAuthenticated]   = useState(false);
  const [userProfile,     setUserProfile]       = useState(null);
  const [currentStep,     setCurrentStep]       = useState(STEPS.AUTH);
  const [selectedDomain,  setSelectedDomain]    = useState(null);
  const [selectedTechs,   setSelectedTechs]     = useState([]);
  const [testAnswers,     setTestAnswers]        = useState([]);
  // The saved session loaded from (or written to) localStorage
  const [session,         setSession]           = useState(null);

  // ── Login ──────────────────────────────────────────────
  const handleLogin = (profile) => {
    setIsAuthenticated(true);
    setUserProfile(profile);

    const saved = localStorage.getItem(SESSION_KEY);
    if (saved) {
      // Returning user — go directly to dashboard
      try {
        const parsed = JSON.parse(saved);
        setSession(parsed);
        setCurrentStep(STEPS.DASHBOARD);
      } catch {
        // Corrupt data — treat as new user
        localStorage.removeItem(SESSION_KEY);
        setCurrentStep(STEPS.LANDING);
      }
    } else {
      // New user — start assessment flow
      setCurrentStep(STEPS.LANDING);
    }
  };

  // ── Logout ─────────────────────────────────────────────
  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserProfile(null);
    setCurrentStep(STEPS.AUTH);
    setSelectedDomain(null);
    setSelectedTechs([]);
    setTestAnswers([]);
    setSession(null);
    // NOTE: We do NOT clear localStorage on logout so the session persists for next login
  };

  // ── Re-Assignment (from dashboard) ─────────────────────
  const handleReAssign = () => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
    setSelectedDomain(null);
    setSelectedTechs([]);
    setTestAnswers([]);
    setCurrentStep(STEPS.LANDING);
  };

  // ── Assessment navigation ───────────────────────────────
  const handleBack = () => {
    const idx = STEP_ORDER.indexOf(currentStep);
    if (idx > 0) setCurrentStep(STEP_ORDER[idx - 1]);
  };

  const handleStart = () => setCurrentStep(STEPS.DOMAIN);

  const handleDomainSelect = (domainId) => {
    setSelectedDomain(domainId);
    setSelectedTechs([]);
    setTimeout(() => setCurrentStep(STEPS.TECH), 400);
  };

  const handleTechToggle = (techId) => {
    setSelectedTechs(prev =>
      prev.includes(techId) ? prev.filter(id => id !== techId) : [...prev, techId]
    );
  };

  const handleTechContinue = () => {
    if (selectedTechs.length > 0) setCurrentStep(STEPS.TEST);
  };

  const handleTestComplete = (answers) => {
    setTestAnswers(answers);
    setCurrentStep(STEPS.ANALYSIS);
  };

  const handleAnalysisContinue = () => setCurrentStep(STEPS.ROADMAP);

  const handleRoadmapContinue = () => setCurrentStep(STEPS.MENTOR);

  // ── After first Mentor session → save & go to Dashboard ─
  const handleMentorDone = async () => {
    const correctAnswers = testAnswers.filter(a => a.correct).length;
    const accuracy = testAnswers.length > 0
      ? Math.round((correctAnswers / testAnswers.length) * 100)
      : 0;

    const newSession = {
      domain:      selectedDomain,
      techs:       selectedTechs,
      accuracy,
      completedAt: new Date().toISOString(),
    };

    // Save to PostgreSQL via Express API Backup Endpoint
    try {
      if (userProfile && userProfile.email) {
        await fetch('/api/users/backup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userProfile.email, skill_data: newSession })
        });
      }
    } catch (error) {
       console.error("Backup failed", error);
    }

    localStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
    setSession(newSession);
    setCurrentStep(STEPS.DASHBOARD);
  };

  // ── Page transition variants ────────────────────────────
  const pageVariants = {
    initial: { opacity: 0, y: 20,  scale: 0.98 },
    animate: { opacity: 1, y: 0,   scale: 1 },
    exit:    { opacity: 0, y: -20, scale: 0.98 },
  };

  // Dashboard has its own nav; AUTH has the portal button — everything else shows the top nav
  const noNav = [STEPS.AUTH, STEPS.DASHBOARD];

  // Pages where the Back arrow should be hidden (but logout remains)
  const noBack = [STEPS.LANDING];

  return (
    <div className="relative min-h-screen bg-[#000000] overflow-hidden">
      {/* Noise overlay */}
      <div className="noise-overlay" />

      {/* Animated background */}
      <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        <AnimatedBackground />
      </div>

      {/* Navigation – visible on all non-dashboard, non-auth pages */}
      {!noNav.includes(currentStep) && (
        <Navigation
          currentStep={currentStep}
          onBack={handleBack}
          onLogout={handleLogout}
          userProfile={userProfile}
          showBack={!noBack.includes(currentStep)}
        />
      )}

      {/* Main content */}
      <main className="relative z-10">
        <AnimatePresence mode="wait">

          {/* ── AUTH ── */}
          {!isAuthenticated && (
            <motion.div key="auth" variants={pageVariants} initial="initial" animate="animate" exit="exit"
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}>
              <AuthScreen onLogin={handleLogin} />
            </motion.div>
          )}

          {isAuthenticated && (
            <>
              {/* DASHBOARD */}
              {currentStep === STEPS.DASHBOARD && (
                <motion.div key="dashboard" variants={pageVariants} initial="initial" animate="animate" exit="exit"
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}>
                  <Dashboard
                    userProfile={userProfile}
                    session={session}
                    onReAssign={handleReAssign}
                    onLogout={handleLogout}
                  />
                </motion.div>
              )}

              {/* LANDING */}
              {currentStep === STEPS.LANDING && (
                <motion.div key="landing" variants={pageVariants} initial="initial" animate="animate" exit="exit"
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}>
                  <LandingPage onStart={handleStart} userProfile={userProfile} onLogout={handleLogout} />
                </motion.div>
              )}

              {/* DOMAIN */}
              {currentStep === STEPS.DOMAIN && (
                <motion.div key="domain" variants={pageVariants} initial="initial" animate="animate" exit="exit"
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}>
                  <DomainSelector onSelect={handleDomainSelect} selectedDomain={selectedDomain} />
                </motion.div>
              )}

              {/* TECH */}
              {currentStep === STEPS.TECH && (
                <motion.div key="tech" variants={pageVariants} initial="initial" animate="animate" exit="exit"
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}>
                  <TechSelector
                    domain={selectedDomain}
                    selectedTechs={selectedTechs}
                    onToggle={handleTechToggle}
                    onContinue={handleTechContinue}
                    onBack={handleBack}
                  />
                </motion.div>
              )}

              {/* TEST */}
              {currentStep === STEPS.TEST && (
                <motion.div key="test" variants={pageVariants} initial="initial" animate="animate" exit="exit"
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}>
                  <QuestionEngine techs={selectedTechs} domain={selectedDomain} onComplete={handleTestComplete} onBack={handleBack} />
                </motion.div>
              )}

              {/* ANALYSIS */}
              {currentStep === STEPS.ANALYSIS && (
                <motion.div key="analysis" variants={pageVariants} initial="initial" animate="animate" exit="exit"
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}>
                  <AnalysisScreen
                    domain={selectedDomain}
                    techs={selectedTechs}
                    answers={testAnswers}
                    onContinue={handleAnalysisContinue}
                  />
                </motion.div>
              )}

              {/* ROADMAP */}
              {currentStep === STEPS.ROADMAP && (
                <motion.div key="roadmap" variants={pageVariants} initial="initial" animate="animate" exit="exit"
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}>
                  <RoadmapTimeline onContinue={handleRoadmapContinue} techId={selectedTechs[0]} />
                </motion.div>
              )}

              {/* MENTOR */}
              {currentStep === STEPS.MENTOR && (
                <motion.div key="mentor" variants={pageVariants} initial="initial" animate="animate" exit="exit"
                  transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}>
                  <MentorPanel
                    onBack={handleMentorDone}
                    techs={selectedTechs}
                    accuracy={testAnswers.length > 0
                      ? Math.round(testAnswers.filter(a => a.correct).length / testAnswers.length * 100)
                      : 0}
                    isFirstTime={true}
                  />
                </motion.div>
              )}
            </>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}

export default App;
