import React from 'react';
import { motion } from 'framer-motion';

const getTileStyle = (status) => {
  switch (status) {
    case 'correct':
      return 'bg-emerald-500 border-emerald-500 text-white';
    case 'present':
      return 'bg-amber-500 border-amber-500 text-white';
    case 'absent':
      return 'bg-slate-500 border-slate-500 text-white';
    default:
      return 'bg-white border-slate-300 text-slate-900';
  }
};

export default function GameBoard({ guesses, currentGuess, targetWord, maxGuesses = 6 }) {
  const emptyRows = Math.max(0, maxGuesses - guesses.length - 1);

  const getLetterStatus = (guess, index) => {
    const letter = guess[index];
    if (!letter) return 'empty';
    if (targetWord[index] === letter) return 'correct';
    if (targetWord.includes(letter)) return 'present';
    return 'absent';
  };

  return (
    <div className="flex flex-col gap-1.5 sm:gap-2">
      {/* Submitted guesses */}
      {guesses.map((guess, rowIndex) => (
        <div key={rowIndex} className="flex gap-1.5 sm:gap-2 justify-center">
          {Array(5).fill(null).map((_, colIndex) => (
            <motion.div
              key={colIndex}
              initial={{ rotateX: 0 }}
              animate={{ rotateX: [0, 90, 0] }}
              transition={{ delay: colIndex * 0.15, duration: 0.5 }}
              className={`
                w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16
                max-[400px]:w-9 max-[400px]:h-9
                flex items-center justify-center
                text-xl sm:text-2xl font-bold uppercase
                max-[400px]:text-base
                border-2 rounded-lg
                max-[400px]:border max-[400px]:rounded-md
                ${getTileStyle(getLetterStatus(guess, colIndex))}
              `}
              style={{ fontFamily: 'Geologica, sans-serif' }}
            >
              {guess[colIndex] || ''}
            </motion.div>
          ))}
        </div>
      ))}

      {/* Current guess row */}
      {guesses.length < maxGuesses && (
        <div className="flex gap-1.5 sm:gap-2 justify-center">
          {Array(5).fill(null).map((_, colIndex) => (
            <motion.div
              key={colIndex}
              animate={currentGuess[colIndex] ? { scale: [1, 1.1, 1] } : {}}
              transition={{ duration: 0.1 }}
              className={`
                w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16
                max-[400px]:w-9 max-[400px]:h-9
                flex items-center justify-center
                text-xl sm:text-2xl font-bold uppercase
                max-[400px]:text-base
                border-2 rounded-lg
                max-[400px]:border max-[400px]:rounded-md
                ${currentGuess[colIndex] ? 'border-slate-500 bg-white' : 'border-slate-200 bg-slate-50'}
                text-slate-900
              `}
              style={{ fontFamily: 'Geologica, sans-serif' }}
            >
              {currentGuess[colIndex] || ''}
            </motion.div>
          ))}
        </div>
      )}

      {/* Empty rows */}
      {Array(emptyRows).fill(null).map((_, rowIndex) => (
        <div key={`empty-${rowIndex}`} className="flex gap-1.5 sm:gap-2 justify-center">
          {Array(5).fill(null).map((_, colIndex) => (
            <div
              key={colIndex}
              className="
                w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16
                max-[400px]:w-9 max-[400px]:h-9
                flex items-center justify-center
                border-2 border-slate-200 rounded-lg
                max-[400px]:border max-[400px]:rounded-md
                bg-slate-50
              "
            />
          ))}
        </div>
      ))}
    </div>
  );
}
