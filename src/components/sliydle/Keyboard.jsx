import React from 'react';
import { motion } from 'framer-motion';
import { Delete } from 'lucide-react';

const ROWS = [
  ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
  ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
  ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACK']
];

const getKeyStyle = (status) => {
  switch (status) {
    case 'correct':
      return 'bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600';
    case 'present':
      return 'bg-amber-500 text-white border-amber-500 hover:bg-amber-600';
    case 'absent':
      return 'bg-slate-500 text-white border-slate-500 hover:bg-slate-600';
    default:
      return 'bg-slate-100 text-slate-900 border-slate-200 hover:bg-slate-200';
  }
};

export default function Keyboard({ onKeyPress, letterStatuses }) {
  const handleClick = (key) => {
    if (key === 'ENTER') {
      onKeyPress('Enter');
    } else if (key === 'BACK') {
      onKeyPress('Backspace');
    } else {
      onKeyPress(key);
    }
  };

  return (
    <div className="flex flex-col gap-1.5 sm:gap-2 w-full max-w-lg mx-auto px-1">
      {ROWS.map((row, rowIndex) => (
        <div key={rowIndex} className="flex gap-1 sm:gap-1.5 justify-center">
          {row.map((key) => {
            const isSpecial = key === 'ENTER' || key === 'BACK';
            const status = letterStatuses[key.toLowerCase()] || 'unused';
            
            return (
              <motion.button
                key={key}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleClick(key)}
                className={`
                  ${isSpecial ? 'px-2 sm:px-4 min-w-[52px] sm:min-w-[65px]' : 'w-8 sm:w-10 md:w-11'}
                  h-12 sm:h-14
                  flex items-center justify-center
                  text-xs sm:text-sm font-semibold uppercase
                  border rounded-lg
                  transition-colors duration-150
                  ${isSpecial ? 'bg-[#0F82FF] text-white border-[#0F82FF] hover:bg-[#0066CC]' : getKeyStyle(status)}
                `}
                style={{ fontFamily: 'Geologica, sans-serif' }}
              >
                {key === 'BACK' ? <Delete className="w-5 h-5" /> : key}
              </motion.button>
            );
          })}
        </div>
      ))}
    </div>
  );
}