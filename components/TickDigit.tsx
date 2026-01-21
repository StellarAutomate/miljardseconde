import React from 'react';
import { motion } from 'framer-motion';

interface TickDigitProps {
  digit: string;
  height?: number; // Height of the digit container in roughly REM/Tailwind units conceptual size
}

export const TickDigit: React.FC<TickDigitProps> = ({ digit, height = 160 }) => {
  // If it's a separator like ',' or '.', just render it static
  if (isNaN(parseInt(digit))) {
    return (
      <div className="flex items-end justify-center pb-4 text-gray-500 opacity-50" style={{ height: height, width: height * 0.3 }}>
        <span className="text-[4rem] leading-none">{digit}</span>
      </div>
    );
  }

  return (
    <div
      className="relative overflow-hidden flex justify-center bg-[#111] rounded-lg border border-[#222] shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]"
      style={{ height: height, width: height * 0.65 }}
    >
      <motion.div
        initial={false}
        animate={{ y: -parseInt(digit) * height }}
        transition={{ type: "spring", stiffness: 150, damping: 20, mass: 1 }}
        className="absolute w-full flex flex-col items-center"
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <div
            key={num}
            className="flex items-center justify-center font-bold text-gray-100"
            style={{ height: height, fontSize: height * 0.85, lineHeight: 1 }}
          >
            {num}
          </div>
        ))}
      </motion.div>

      {/* Glass/Gloss overlay effect */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40 pointer-events-none z-10"></div>
    </div>
  );
};
