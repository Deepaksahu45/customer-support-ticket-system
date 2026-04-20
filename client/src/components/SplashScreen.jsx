// Aegis — Full-screen loading splash screen
import React from 'react';
import { motion } from 'framer-motion';

const SplashScreen = () => {
  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{
        background: '#071a0e',
        backgroundImage: `
          radial-gradient(circle at 50% 40%, rgba(34,197,94,0.2), transparent 50%),
          radial-gradient(circle at 20% 80%, rgba(34,197,94,0.1), transparent 40%),
          radial-gradient(circle at 80% 20%, rgba(34,197,94,0.08), transparent 40%)
        `,
      }}
    >
      {/* Animated background orbs */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-1/4 left-1/3 w-96 h-96 bg-aegis-green/5 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          scale: [1.2, 1, 1.2],
          opacity: [0.2, 0.5, 0.2],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-aegis-green/8 rounded-full blur-3xl"
      />

      {/* Center content */}
      <div className="flex flex-col items-center gap-6 relative z-10">
        {/* Shield logo */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <motion.div
            animate={{
              boxShadow: [
                '0 0 0 0 rgba(34,197,94,0)',
                '0 0 40px 10px rgba(34,197,94,0.15)',
                '0 0 0 0 rgba(34,197,94,0)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="rounded-full p-1"
          >
            <svg
              width={72}
              height={72}
              viewBox="0 0 64 64"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M32 6 L54 17 L54 35 C54 48 43 56 32 60 C21 56 10 48 10 35 L10 17 Z"
                fill="rgba(34,197,94,0.15)"
                stroke="#22c55e"
                strokeWidth="2.5"
              />
              <motion.path
                d="M27 34 L32 39 L39 27"
                fill="none"
                stroke="#22c55e"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
              />
            </svg>
          </motion.div>
        </motion.div>

        {/* Brand name */}
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="text-3xl font-brand font-bold tracking-tight"
        >
          <span className="text-aegis-text">Ae</span>
          <span className="text-aegis-green">gis</span>
        </motion.h1>

        {/* Loading indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center gap-3"
        >
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.4, 1],
                  opacity: [0.3, 1, 0.3],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: 'easeInOut',
                }}
                className="w-2 h-2 rounded-full bg-aegis-green"
              />
            ))}
          </div>
          <p className="text-aegis-muted/60 font-body text-xs tracking-wider uppercase">
            Initializing secure session
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default SplashScreen;
