import React, { useEffect } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';

const AnimatedBackground = () => {
  const vw = typeof window !== 'undefined' ? window.innerWidth : 1440;
  const vh = typeof window !== 'undefined' ? window.innerHeight : 900;

  const mouseX = useMotionValue(vw / 2);
  const mouseY = useMotionValue(vh / 2);

  const slowSpring = { damping: 30, stiffness: 50, mass: 1.2 };

  const sXslow = useSpring(mouseX, slowSpring);
  const sYslow = useSpring(mouseY, slowSpring);

  // Blob parallax — each blob layer moves by a different amount
  const b1x = useTransform(sXslow, [0, vw], [-55, 55]);
  const b1y = useTransform(sYslow, [0, vh], [-40, 40]);
  const b2x = useTransform(sXslow, [0, vw], [45, -45]);
  const b2y = useTransform(sYslow, [0, vh], [35, -35]);
  const b3x = useTransform(sXslow, [0, vw], [-30, 30]);
  const b3y = useTransform(sYslow, [0, vh], [25, -25]);
  const b4x = useTransform(sXslow, [0, vw], [20, -20]);
  const b4y = useTransform(sYslow, [0, vh], [-18, 18]);

  const reticleSpring = { damping: 35, stiffness: 200, mass: 0.4 };
  const reticleX = useSpring(mouseX, reticleSpring);
  const reticleY = useSpring(mouseY, reticleSpring);

  useEffect(() => {
    const onMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
    };
    window.addEventListener('mousemove', onMove);
    return () => {
      window.removeEventListener('mousemove', onMove);
    };
  }, [mouseX, mouseY]);

  return (
    <div
      className="fixed inset-0 overflow-hidden pointer-events-none"
      style={{ zIndex: -1, background: '#000000' }}
    >

      {/* ── Blob 1: top-left — cyan, parallax + fluid morph ── */}
      <motion.div style={{ position: 'absolute', x: b1x, y: b1y, top: '-20%', left: '-15%', width: '55vw', height: '55vw' }}>
        <motion.div
          animate={{
            x: [0, 180, -120, 80, 0],
            y: [0, -140, 100, -60, 0],
            borderRadius: [
              '60% 40% 70% 30% / 50% 60% 40% 50%',
              '40% 60% 30% 70% / 60% 40% 55% 45%',
              '70% 30% 50% 50% / 40% 65% 35% 60%',
              '45% 55% 60% 40% / 55% 45% 60% 40%',
              '60% 40% 70% 30% / 50% 60% 40% 50%',
            ],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '100%', height: '100%',
            background: 'radial-gradient(circle at 40% 40%, rgba(6,182,212,0.80) 0%, rgba(8,145,178,0.48) 40%, rgba(14,116,144,0.15) 70%, transparent 85%)',
            filter: 'blur(72px)',
          }}
        />
      </motion.div>

      {/* ── Blob 2: bottom-right — deep blue, parallax + fluid morph ── */}
      <motion.div style={{ position: 'absolute', x: b2x, y: b2y, bottom: '-22%', right: '-18%', width: '62vw', height: '62vw' }}>
        <motion.div
          animate={{
            x: [0, -200, 130, -70, 0],
            y: [0, 160, -120, 80, 0],
            borderRadius: [
              '40% 60% 55% 45% / 60% 40% 60% 40%',
              '65% 35% 45% 55% / 45% 55% 40% 60%',
              '50% 50% 65% 35% / 55% 45% 50% 50%',
              '35% 65% 40% 60% / 40% 60% 55% 45%',
              '40% 60% 55% 45% / 60% 40% 60% 40%',
            ],
          }}
          transition={{ duration: 26, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '100%', height: '100%',
            background: 'radial-gradient(circle at 55% 50%, rgba(37,99,235,0.75) 0%, rgba(29,78,216,0.42) 38%, rgba(30,58,138,0.12) 68%, transparent 85%)',
            filter: 'blur(82px)',
          }}
        />
      </motion.div>

      {/* ── Blob 3: center — teal-cyan, parallax + fluid morph ── */}
      <motion.div style={{ position: 'absolute', x: b3x, y: b3y, top: '15%', left: '35%', width: '44vw', height: '44vw' }}>
        <motion.div
          animate={{
            x: [0, 140, -100, 50, 0],
            y: [0, -100, 120, -50, 0],
            borderRadius: [
              '50% 50% 45% 55% / 55% 45% 55% 45%',
              '70% 30% 60% 40% / 40% 60% 45% 55%',
              '35% 65% 50% 50% / 65% 35% 55% 45%',
              '55% 45% 35% 65% / 45% 55% 40% 60%',
              '50% 50% 45% 55% / 55% 45% 55% 45%',
            ],
          }}
          transition={{ duration: 18, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '100%', height: '100%',
            background: 'radial-gradient(circle at center, rgba(34,211,238,0.60) 0%, rgba(6,182,212,0.30) 42%, transparent 72%)',
            filter: 'blur(68px)',
          }}
        />
      </motion.div>

      {/* ── Blob 4: top-right — sky blue, parallax + fluid morph ── */}
      <motion.div style={{ position: 'absolute', x: b4x, y: b4y, top: '-5%', right: '5%', width: '38vw', height: '38vw' }}>
        <motion.div
          animate={{
            x: [0, -110, 70, -40, 0],
            y: [0, 90, -70, 40, 0],
            borderRadius: [
              '55% 45% 60% 40% / 45% 55% 45% 55%',
              '40% 60% 45% 55% / 60% 40% 60% 40%',
              '65% 35% 55% 45% / 35% 65% 50% 50%',
              '45% 55% 40% 60% / 55% 45% 40% 60%',
              '55% 45% 60% 40% / 45% 55% 45% 55%',
            ],
          }}
          transition={{ duration: 22, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            width: '100%', height: '100%',
            background: 'radial-gradient(circle at 45% 40%, rgba(56,189,248,0.55) 0%, rgba(14,165,233,0.28) 45%, transparent 72%)',
            filter: 'blur(62px)',
          }}
        />
      </motion.div>

      {/* ── Matte frosted glass overlay — heavier blur, darker ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backdropFilter: 'blur(48px) saturate(1.2) brightness(0.85)',
          WebkitBackdropFilter: 'blur(48px) saturate(1.2) brightness(0.85)',
          background: 'rgba(0, 0, 0, 0.40)',
        }}
      />

      {/* ── Subtle glossy sheen on top ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(160deg, rgba(255,255,255,0.035) 0%, transparent 25%, transparent 75%, rgba(0,0,0,0.30) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Soft ambient glow that follows mouse ── */}
      <motion.div
        style={{
          position: 'absolute',
          width: '18vw',
          height: '18vw',
          borderRadius: '50%',
          left: reticleX,
          top: reticleY,
          x: '-50%',
          y: '-50%',
          background: 'radial-gradient(circle at center, rgba(34,211,238,0.18) 0%, rgba(6,182,212,0.08) 55%, transparent 80%)',
          filter: 'blur(28px)',
          pointerEvents: 'none',
        }}
      />

      {/* ── Dark edge vignette ── */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(ellipse 85% 85% at 50% 50%, transparent 40%, rgba(0,0,0,0.80) 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Cursor code removed to keep it basic and normal */}

    </div>
  );
};

export default AnimatedBackground;
