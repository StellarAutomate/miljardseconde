import React, { useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { motion } from 'framer-motion';

interface MayhemLayerProps {
  active: boolean;
}

const FlyingCow = ({ delay, duration, yPos }: { delay: number, duration: number, yPos: number }) => (
  <motion.div
    initial={{ x: "-20vw", rotate: 0 }}
    animate={{ x: "120vw", rotate: 360 }}
    transition={{ 
      duration: duration, 
      ease: "linear", 
      repeat: Infinity, 
      delay: delay 
    }}
    className="fixed z-50 text-[8rem] pointer-events-none drop-shadow-2xl"
    style={{ top: `${yPos}%` }}
  >
    🐄
  </motion.div>
);

const SpinningCat = ({ xPos, yPos }: { xPos: number, yPos: number }) => (
  <motion.div
    animate={{ rotate: 360, scale: [1, 1.5, 1] }}
    transition={{ duration: 0.5, repeat: Infinity, ease: "linear" }}
    className="fixed z-50 text-[6rem] pointer-events-none"
    style={{ left: `${xPos}%`, top: `${yPos}%` }}
  >
    🐈
  </motion.div>
);

export const MayhemLayer: React.FC<MayhemLayerProps> = ({ active }) => {
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (active) {
      const duration = 15 * 1000;
      const animationEnd = Date.now() + duration;

      const randomInRange = (min: number, max: number) => {
        return Math.random() * (max - min) + min;
      }

      const launchConfetti = () => {
        confetti({
          angle: randomInRange(55, 125),
          spread: randomInRange(50, 70),
          particleCount: randomInRange(50, 100),
          origin: { y: 0.6 }
        });
      };

      // Initial blast
      launchConfetti();

      // Continuous fireworks
      intervalRef.current = setInterval(() => {
        launchConfetti();
        
        // Random side cannons
        confetti({
          angle: 60,
          spread: 55,
          origin: { x: 0 },
          colors: ['#bb0000', '#ffffff']
        });
        confetti({
          angle: 120,
          spread: 55,
          origin: { x: 1 },
          colors: ['#bb0000', '#ffffff']
        });

      }, 800);

      // Flash background effect helper (handled in parent via overlay state usually, but we can do a strobe here)
      
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
      confetti.reset();
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [active]);

  if (!active) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {/* Background Strobe Overlay */}
      <motion.div 
        animate={{ opacity: [0, 0.3, 0] }}
        transition={{ duration: 0.2, repeat: Infinity }}
        className="absolute inset-0 bg-red-500/20 mix-blend-overlay"
      />

      {/* Flying Cows */}
      <FlyingCow delay={0} duration={4} yPos={10} />
      <FlyingCow delay={2} duration={5} yPos={60} />
      <FlyingCow delay={1} duration={3} yPos={30} />
      <FlyingCow delay={3.5} duration={6} yPos={80} />

      {/* Spinning Cats */}
      <SpinningCat xPos={10} yPos={20} />
      <SpinningCat xPos={80} yPos={15} />
      <SpinningCat xPos={20} yPos={80} />
      <SpinningCat xPos={85} yPos={70} />
      
      {/* Extra Text */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: [1, 1.2, 1], opacity: 1, rotate: [-5, 5, -5] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-9xl font-black text-yellow-400 drop-shadow-[0_0_15px_rgba(255,255,0,0.8)] z-50 whitespace-nowrap"
      >
        1 BILLION!
      </motion.div>
    </div>
  );
};