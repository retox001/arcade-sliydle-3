import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function WinModal({ isOpen, guessCount, onClose }) {
  if (!isOpen) return null;

  const messages = [
    "Genius!", // 1 guess
    "Magnificent!", // 2 guesses
    "Impressive!", // 3 guesses
    "Splendid!", // 4 guesses
    "Great!", // 5 guesses
    "Phew!" // 6 guesses
  ];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-3xl p-8 sm:p-10 max-w-sm w-full text-center shadow-2xl"
        >
          {/* Confetti effect */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ 
                  y: -20, 
                  x: Math.random() * 100 - 50,
                  opacity: 1,
                  rotate: 0
                }}
                animate={{ 
                  y: 400, 
                  opacity: 0,
                  rotate: Math.random() * 360
                }}
                transition={{ 
                  duration: 2 + Math.random(),
                  delay: Math.random() * 0.5,
                  repeat: Infinity,
                  repeatDelay: Math.random() * 2
                }}
                className="absolute w-3 h-3 rounded-full"
                style={{ 
                  left: `${Math.random() * 100}%`,
                  backgroundColor: ['#0F82FF', '#22C55E', '#F59E0B', '#EC4899'][Math.floor(Math.random() * 4)]
                }}
              />
            ))}
          </div>

          <motion.div
            initial={{ rotate: 0 }}
            animate={{ rotate: [0, -10, 10, -10, 10, 0] }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-amber-400 to-amber-500 mb-6 shadow-lg"
          >
            <Trophy className="w-10 h-10 text-white" />
          </motion.div>

          <h2 
            className="text-3xl font-bold text-slate-900 mb-2"
            style={{ fontFamily: 'Geologica, sans-serif' }}
          >
            {messages[guessCount - 1] || "You Won!"}
          </h2>

          <p 
            className="text-slate-500 mb-2"
            style={{ fontFamily: 'Geologica, sans-serif' }}
          >
            You solved it in
          </p>

          <div className="flex items-center justify-center gap-2 mb-6">
            <span 
              className="text-5xl font-bold text-[#0F82FF]"
              style={{ fontFamily: 'Geologica, sans-serif' }}
            >
              {guessCount}
            </span>
            <span 
              className="text-xl text-slate-600"
              style={{ fontFamily: 'Geologica, sans-serif' }}
            >
              {guessCount === 1 ? 'guess' : 'guesses'}
            </span>
          </div>

          <div 
            className="bg-gradient-to-r from-emerald-50 to-blue-50 border-2 border-emerald-200 rounded-xl p-6 mb-4"
          >
            <div className="flex items-center justify-center gap-2 mb-2">
              <Sparkles className="w-6 h-6 text-[#0F82FF]" />
              <h3 className="text-xl font-bold text-slate-900" style={{ fontFamily: 'Geologica, sans-serif' }}>
                Congratulations
              </h3>
              <Sparkles className="w-6 h-6 text-emerald-500" />
            </div>
            <p className="text-slate-600 text-center" style={{ fontFamily: 'Geologica, sans-serif' }}>
              You have earned a reward
            </p>
          </div>

          <div className="space-y-3">
            <p 
              className="text-sm text-slate-400"
              style={{ fontFamily: 'Geologica, sans-serif' }}
            >
              Come back tomorrow for a new word!
            </p>

            <Button 
              onClick={onClose}
              variant="outline"
              className="w-full h-12 text-base font-medium rounded-xl border-slate-200 hover:bg-slate-50"
              style={{ fontFamily: 'Geologica, sans-serif' }}
            >
              Close
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}