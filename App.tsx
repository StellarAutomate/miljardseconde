import React, { useState, useEffect, useMemo } from 'react';
import { TickDigit } from './components/TickDigit';
import { VideoBackground } from './components/VideoBackground';
import { CelebrationLayer } from './components/CelebrationLayer';
import { ClickEffects } from './components/ClickEffects';
import { calculateSecondsAlive, getBillionthSecondDate, formatFutureDate } from './utils/timeUtils';
import { Play, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { InvitationCard } from './components/InvitationCard';

const App: React.FC = () => {
  const [seconds, setSeconds] = useState<number>(0);
  const [isTestMode, setIsTestMode] = useState(false);
  const [showControls, setShowControls] = useState(false);

  // Calculate milestone once
  const billionthDate = useMemo(() => getBillionthSecondDate(), []);

  // We don't need formattedMilestone here anymore since we use InvitationCard, 
  // but let's keep it if we ever want to revert or debug. 
  // Actually, the InvitationCard replaces the generic milestone text.
  const formattedMilestone = useMemo(() => formatFutureDate(billionthDate), [billionthDate]);

  useEffect(() => {
    setSeconds(calculateSecondsAlive());
    const interval = setInterval(() => {
      setSeconds(calculateSecondsAlive());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const BILLION = 1_000_000_000;
  const [displaySeconds, setDisplaySeconds] = useState(seconds);

  useEffect(() => {
    if (!isTestMode) setDisplaySeconds(seconds);
  }, [seconds, isTestMode]);

  useEffect(() => {
    let testInterval: ReturnType<typeof setInterval>;
    if (isTestMode) {
      let tempSeconds = BILLION - 8;
      setDisplaySeconds(tempSeconds);
      testInterval = setInterval(() => {
        tempSeconds++;
        setDisplaySeconds(tempSeconds);
      }, 1000);
    }
    return () => clearInterval(testInterval);
  }, [isTestMode]);

  const isCelebration = displaySeconds >= BILLION;

  // Helper to get separate digits including commas
  const richDisplayArray = useMemo(() => {
    const s = displaySeconds.toString().padStart(10, '0');
    const digits = s.split('');
    const arr: string[] = [];
    let charCount = 0;
    for (let i = digits.length - 1; i >= 0; i--) {
      arr.unshift(digits[i]);
      charCount++;
      if (charCount % 3 === 0 && i !== 0) arr.unshift(',');
    }
    return arr;
  }, [displaySeconds]);

  return (
    <div className="relative min-h-screen w-full bg-[#111] text-white overflow-hidden selection:bg-yellow-400 selection:text-black font-sans">

      {/* Background Layer */}
      <VideoBackground />

      {/* Click Interactions */}
      <ClickEffects isActive={!isCelebration} />

      {/* Main Content */}
      <div className="relative z-10 w-full min-h-screen flex flex-col justify-between pointer-events-none overflow-y-auto overflow-x-hidden md:overflow-hidden">

        {/* Header - Flow on Mobile, Absolute on Desktop */}
        <header className="relative md:absolute top-0 left-0 w-full p-4 md:p-8 flex flex-col items-center md:flex-row md:justify-between md:items-start pointer-events-auto z-50 shrink-0">

          {/* Invitation Card (Moves to top on mobile, Right on Desktop) */}
          <div className="w-full md:w-auto flex justify-center md:order-2 md:justify-end mb-4 md:mb-0">
            <InvitationCard />
          </div>

          {/* Title Text (Hidden on mobile, Visible on Desktop, Left on Desktop) */}
          <div className="hidden md:flex flex-col drop-shadow-md md:order-1 text-left">
            <h1 className="text-4xl font-bold uppercase tracking-widest flex items-center gap-2">
              <span className="inline-block w-4 h-4 bg-yellow-400"></span>
              Aantal seconden dat Nathan leeft
            </h1>
            <p className="text-xl opacity-80 mt-1 font-light tracking-wide">
              Seconden sinds geboorte
            </p>
          </div>
        </header>

        {/* Counter - Centered vertically in remaining space */}
        <main className="flex-1 flex flex-col h-full items-center justify-center scale-50 sm:scale-75 md:scale-100 transition-transform duration-500 origin-center py-10 md:py-0">
          <div className="flex items-end gap-1 sm:gap-2 md:gap-3">
            {richDisplayArray.map((char, index) => (
              <TickDigit
                key={`digit-${index}-${char === ',' ? 'comma' : 'num'}`}
                digit={char}
                height={140}
              />
            ))}
          </div>

          <div className="mt-8 text-center bg-black/50 px-6 py-2 rounded-full backdrop-blur-sm">
            <p className="uppercase tracking-[0.5em] text-sm font-semibold opacity-90">Totaal Aantal Seconden</p>
          </div>
        </main>

        {/* Footer Controls */}
        <footer className="relative md:absolute bottom-0 w-full p-8 flex justify-between items-end pointer-events-auto shrink-0 bg-gradient-to-t from-black/80 to-transparent md:bg-none">
          <div className="flex flex-col gap-2 text-xs opacity-60">
            <p>Geboren: 18-07-1994 17:27 (UTC+1)</p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={() => setShowControls(!showControls)}
              className="text-sm uppercase font-bold tracking-widest border border-white/40 px-4 py-2 hover:bg-white hover:text-black transition-colors bg-black/50 backdrop-blur-sm"
            >
              Besturing
            </button>
          </div>
        </footer>
      </div>

      {/* Dev Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="absolute bottom-24 right-8 bg-white p-6 rounded-lg shadow-xl z-50 text-black"
          >
            <h3 className="font-bold text-lg mb-4">Simulatie</h3>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setIsTestMode(!isTestMode)}
                className={`flex items-center gap-2 px-4 py-3 rounded font-bold transition-all text-white ${isTestMode ? 'bg-red-600 hover:bg-red-700' : 'bg-black hover:bg-gray-800'
                  }`}
              >
                {isTestMode ? <RotateCcw size={18} /> : <Play size={18} />}
                {isTestMode ? 'Stop Simulatie' : 'Simuleer 1 Miljard'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Celebration Overlay */}
      <CelebrationLayer active={isCelebration} />
    </div>
  );
};

export default App;