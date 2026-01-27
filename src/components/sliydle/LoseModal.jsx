import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function LoseModal({ isOpen, targetWord, onClose }) {
  if (!isOpen) return null;

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
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
            className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-slate-400 to-slate-500 mb-6 shadow-lg"
          >
            <Clock className="w-10 h-10 text-white" />
          </motion.div>

          <h2 
            className="text-3xl font-bold text-slate-900 mb-2"
            style={{ fontFamily: 'Geologica, sans-serif' }}
          >
            Better Luck Tomorrow!
          </h2>

          <p 
            className="text-slate-500 mb-4"
            style={{ fontFamily: 'Geologica, sans-serif' }}
          >
            The word was
          </p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex justify-center gap-1.5 mb-8"
          >
            {targetWord.split('').map((letter, index) => (
              <div
                key={index}
                className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center bg-[#0F82FF] text-white text-xl sm:text-2xl font-bold uppercase rounded-lg shadow-lg"
                style={{ fontFamily: 'Geologica, sans-serif' }}
              >
                {letter}
              </div>
            ))}
          </motion.div>

          <div className="space-y-3">
            <div 
              className="flex items-center justify-center gap-2 text-slate-500"
              style={{ fontFamily: 'Geologica, sans-serif' }}
            >
              <RefreshCw className="w-4 h-4" />
              <span>New word available at midnight</span>
            </div>

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