import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HelpCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import GameBoard from '@/components/sliydle/GameBoard';
import Keyboard from '@/components/sliydle/Keyboard';
import WinModal from '@/components/sliydle/WinModal';
import LoseModal from '@/components/sliydle/LoseModal';
import { getTodaysWord, isValidWord /*, getTodayKey */ } from '@/components/sliydle/wordList';
import { format } from 'date-fns';

const MAX_GUESSES = 6;
const WORD_LENGTH = 5;

// Send events to parent frame
function sendEvent(eventName, data = {}) {
  if (!eventName) return;
  const safeData = JSON.parse(JSON.stringify(data || {}));
  window.parent.postMessage({ event: eventName, data: safeData }, "*");
}

export default function Sliydle() {
  const [targetWord, setTargetWord] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [currentGuess, setCurrentGuess] = useState('');
  const [gameState, setGameState] = useState('playing'); // 'playing', 'won', 'lost'
  const [letterStatuses, setLetterStatuses] = useState({});
  const [showHelp, setShowHelp] = useState(false);
  const [shake, setShake] = useState(false);
  const [showInvalidMessage, setShowInvalidMessage] = useState(false);
  // const [hasPlayedToday, setHasPlayedToday] = useState(false);

  // Initialize game
  useEffect(() => {
    const word = getTodaysWord();
    setTargetWord(word);

    // --- LOCALSTORAGE PERSISTENCE DISABLED (arcade build) ---
    // The original Base44 export saves/loads daily guesses + letters.
    // We do NOT want to store guesses/letters, so this is commented out.
    //
    // // Check if already played today
    // const todayKey = getTodayKey();
    // const savedGame = localStorage.getItem(`sliydle-${todayKey}`);
    //
    // if (savedGame) {
    //   const { guesses: savedGuesses, gameState: savedState } = JSON.parse(savedGame);
    //   setGuesses(savedGuesses);
    //   setGameState(savedState);
    //   setHasPlayedToday(savedState !== 'playing');
    //
    //   // Rebuild letter statuses
    //   const statuses = {};
    //   savedGuesses.forEach(guess => {
    //     guess.split('').forEach((letter, index) => {
    //       const lowerLetter = letter.toLowerCase();
    //       if (word[index] === letter) {
    //         statuses[lowerLetter] = 'correct';
    //       } else if (word.includes(letter) && statuses[lowerLetter] !== 'correct') {
    //         statuses[lowerLetter] = 'present';
    //       } else if (!statuses[lowerLetter]) {
    //         statuses[lowerLetter] = 'absent';
    //       }
    //     });
    //   });
    //   setLetterStatuses(statuses);
    // } else {
    //   // First time playing today - fire GAME_START
    //   sendEvent("GAME_START");
    // }

    // Always start fresh (no localStorage persistence)
    sendEvent("GAME_START");
  }, []);

  // --- LOCALSTORAGE PERSISTENCE DISABLED (arcade build) ---
  // // Save game state
  // useEffect(() => {
  //   if (targetWord && guesses.length > 0) {
  //     const todayKey = getTodayKey();
  //     localStorage.setItem(
  //       `sliydle-${todayKey}`,
  //       JSON.stringify({
  //         guesses,
  //         gameState
  //       })
  //     );
  //   }
  // }, [guesses, gameState, targetWord]);

  const updateLetterStatuses = useCallback((guess) => {
    const newStatuses = { ...letterStatuses };

    guess.split('').forEach((letter, index) => {
      const lowerLetter = letter.toLowerCase();
      if (targetWord[index] === letter) {
        newStatuses[lowerLetter] = 'correct';
      } else if (targetWord.includes(letter) && newStatuses[lowerLetter] !== 'correct') {
        newStatuses[lowerLetter] = 'present';
      } else if (!newStatuses[lowerLetter]) {
        newStatuses[lowerLetter] = 'absent';
      }
    });

    setLetterStatuses(newStatuses);
  }, [letterStatuses, targetWord]);

  const submitGuess = useCallback(() => {
    if (currentGuess.length !== WORD_LENGTH) return;

    if (!isValidWord(currentGuess)) {
      setShake(true);
      setShowInvalidMessage(true);
      setTimeout(() => {
        setShake(false);
        setShowInvalidMessage(false);
      }, 2000);
      return;
    }

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    updateLetterStatuses(currentGuess);

    // Fire PROGRESS event with guess number
    sendEvent("PROGRESS", { guessNumber: newGuesses.length });

    if (currentGuess === targetWord) {
      setGameState('won');
      // setHasPlayedToday(true);

      // Fire SLIYD_REWARD when user wins
      sendEvent("SLIYD_REWARD", { guessCount: newGuesses.length });
    } else if (newGuesses.length >= MAX_GUESSES) {
      setGameState('lost');
      // setHasPlayedToday(true);
    }

    setCurrentGuess('');
  }, [currentGuess, guesses, targetWord, updateLetterStatuses]);

  const handleKeyPress = useCallback((key) => {
    if (gameState !== 'playing') return;

    if (key === 'Enter') {
      submitGuess();
    } else if (key === 'Backspace') {
      setCurrentGuess(prev => prev.slice(0, -1));
    } else if (currentGuess.length < WORD_LENGTH && /^[A-Za-z]$/.test(key)) {
      setCurrentGuess(prev => prev + key.toUpperCase());
    }
  }, [currentGuess, gameState, submitGuess]);

  // Physical keyboard support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Enter' || e.key === 'Backspace' || /^[A-Za-z]$/.test(e.key)) {
        e.preventDefault();
        handleKeyPress(e.key);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyPress]);

  return (
    <div
      className="min-h-[100dvh] bg-gradient-to-b from-slate-50 to-slate-100 flex items-center justify-center rounded-2xl"
      style={{ fontFamily: 'Geologica, sans-serif' }}
    >
      {/* Google Font Import */}
      <style>
        {`@import url('https://fonts.googleapis.com/css2?family=Geologica:wght@300;400;500;600;700;800&display=swap');`}
      </style>

      {/* Game Container - 9:16 Aspect Ratio */}
      <div className="w-full mx-auto" style={{ aspectRatio: '9/16', maxHeight: '100dvh' }}>
        <div className="relative h-full bg-white/50 backdrop-blur-sm shadow-xl flex flex-col p-6 max-[400px]:p-4">
          {/* Help Button - Top Left */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setShowHelp(true)}
            className="absolute top-4 left-4 text-slate-500 hover:text-slate-700 z-10"
          >
            <HelpCircle className="w-5 h-5" />
          </Button>

          {/* Main Game Area */}
          <main className="flex-1 flex flex-col items-center justify-between">
            {/* Puzzle Info */}
            <div className="text-center mb-1 relative w-full pt-2">
              <p className="text-xs text-slate-500">{format(new Date(), 'MMMM d, yyyy')}</p>
              <p className="text-sm font-semibold text-slate-700">
                Puzzle #{Math.floor((new Date() - new Date('2025-11-25')) / (1000 * 60 * 60 * 24)) + 1}
              </p>

              {/* Invalid Word Message */}
              <AnimatePresence>
                {showInvalidMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute left-0 right-0 top-full mt-2 flex justify-center z-50"
                  >
                    <p
                      className="text-sm font-medium text-amber-600 bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 whitespace-nowrap"
                      style={{ fontFamily: 'Geologica, sans-serif' }}
                    >
                      Invalid Word
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Game Board */}
            <motion.div
              className="flex-1 flex items-center"
              animate={shake ? { x: [-10, 10, -10, 10, 0] } : {}}
              transition={{ duration: 0.4 }}
            >
              <GameBoard
                guesses={guesses}
                currentGuess={currentGuess}
                targetWord={targetWord}
                maxGuesses={MAX_GUESSES}
              />
            </motion.div>

            {/* Keyboard */}
            <div className="w-full mt-6 max-[400px]:mt-3">
              <Keyboard
                onKeyPress={handleKeyPress}
                letterStatuses={letterStatuses}
              />
            </div>
          </main>
        </div>
      </div>

      {/* Modals */}
      <WinModal
        isOpen={gameState === 'won'}
        guessCount={guesses.length}
        onClose={() => setGameState('finished')}
      />

      <LoseModal
        isOpen={gameState === 'lost'}
        targetWord={targetWord}
        onClose={() => setGameState('finished')}
      />

      {/* Help Modal */}
      {showHelp && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 max-[400px]:p-2"
          onClick={() => setShowHelp(false)}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-900">How to Play</h2>
              <Button variant="ghost" size="icon" onClick={() => setShowHelp(false)}>
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="space-y-4 text-slate-600">
              <p>Guess the <strong>SLIYDLE</strong> in 6 tries.</p>

              <ul className="space-y-2 text-sm">
                <li>• Each guess must be a valid 5-letter word</li>
                <li>• The color of the tiles will change to show how close your guess was</li>
              </ul>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center text-white font-bold">W</div>
                  <span className="text-sm">Letter is in the correct spot</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center text-white font-bold">I</div>
                  <span className="text-sm">Letter is in the word but wrong spot</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 bg-slate-500 rounded-lg flex items-center justify-center text-white font-bold">N</div>
                  <span className="text-sm">Letter is not in the word</span>
                </div>
              </div>

              <p className="text-sm font-medium text-[#0F82FF]">A new word is available each day!</p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}
