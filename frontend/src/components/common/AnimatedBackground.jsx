import React from 'react'
import { motion } from 'framer-motion'

export function AnimatedBackground({ variant = 'default', className = '' }) {
  // Respect reduced motion
  const prefersReducedMotion =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches

  if (prefersReducedMotion) {
    return (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-b from-[#F8F3EE] via-[#E9DED5]/40 to-[#F8F3EE]" />
      </div>
    )
  }

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden select-none ${className}`}>
      {/* 1. Slowly Drifting Ambient Light Orbs */}
      <motion.div
        animate={{
          x: [0, 40, -30, 0],
          y: [0, -35, 25, 0],
          scale: [1, 1.08, 0.94, 1]
        }}
        transition={{
          duration: 22,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
        className="absolute -top-32 -left-28 w-[32rem] h-[32rem] rounded-full bg-[#D9A6AC]/15 blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, -45, 30, 0],
          y: [0, 40, -25, 0],
          scale: [1, 0.92, 1.1, 1]
        }}
        transition={{
          duration: 26,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 2
        }}
        className="absolute top-1/4 -right-36 w-[36rem] h-[36rem] rounded-full bg-[#542B43]/8 blur-3xl"
      />

      <motion.div
        animate={{
          x: [0, 30, -20, 0],
          y: [0, -30, 35, 0],
          scale: [1, 1.06, 0.96, 1]
        }}
        transition={{
          duration: 24,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: 5
        }}
        className="absolute -bottom-24 left-1/3 w-[30rem] h-[30rem] rounded-full bg-[#E9DED5]/50 blur-3xl"
      />

      {/* 2. Soft Floating Micro-Particles & Glowing Sparkles */}
      <div className="absolute inset-0 opacity-70">
        {[
          { top: '15%', left: '12%', size: 'w-1.5 h-1.5', delay: 0, duration: 4.5 },
          { top: '22%', left: '82%', size: 'w-2 h-2', delay: 1.2, duration: 5.5 },
          { top: '45%', left: '25%', size: 'w-1 h-1', delay: 2.1, duration: 4.8 },
          { top: '55%', left: '72%', size: 'w-1.5 h-1.5', delay: 0.8, duration: 5.2 },
          { top: '70%', left: '18%', size: 'w-2 h-2', delay: 2.8, duration: 6.0 },
          { top: '78%', left: '88%', size: 'w-1 h-1', delay: 1.6, duration: 4.2 },
          { top: '35%', left: '92%', size: 'w-1.5 h-1.5', delay: 3.2, duration: 5.0 },
          { top: '85%', left: '42%', size: 'w-1.5 h-1.5', delay: 0.4, duration: 5.8 }
        ].map((pt, i) => (
          <motion.span
            key={i}
            animate={{
              y: [0, -14, 0],
              opacity: [0.25, 0.85, 0.25],
              scale: [0.85, 1.25, 0.85]
            }}
            transition={{
              duration: pt.duration,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: pt.delay
            }}
            style={{ top: pt.top, left: pt.left }}
            className={`absolute ${pt.size} rounded-full bg-[#D9A6AC] shadow-[0_0_8px_rgba(217,166,172,0.8)]`}
          />
        ))}

        {/* Floating Sparkle Symbols */}
        <motion.span
          animate={{ y: [0, -10, 0], opacity: [0.3, 0.9, 0.3], rotate: [0, 45, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute top-[18%] right-[22%] text-[#D9A6AC]/70 text-xs"
        >
          ✦
        </motion.span>
        <motion.span
          animate={{ y: [0, 12, 0], opacity: [0.25, 0.8, 0.25], rotate: [0, -35, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute bottom-[28%] left-[10%] text-[#542B43]/50 text-sm"
        >
          ✧
        </motion.span>
        <motion.span
          animate={{ y: [0, -8, 0], opacity: [0.3, 0.85, 0.3] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 3.5 }}
          className="absolute top-[62%] right-[12%] text-[#D9A6AC]/70 text-xs"
        >
          ✦
        </motion.span>
      </div>

      {/* 3. Subtle Translucent Architectural Curves */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.035] pointer-events-none"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="none"
      >
        <path
          d="M0,160 C320,300,420,0,740,160 C1060,320,1200,80,1440,180 L1440,900 L0,900 Z"
          fill="#542B43"
        />
        <circle cx="200" cy="300" r="180" fill="none" stroke="#542B43" strokeWidth="1" />
        <circle cx="1200" cy="600" r="240" fill="none" stroke="#D9A6AC" strokeWidth="1" />
      </svg>
    </div>
  )
}

export default AnimatedBackground
