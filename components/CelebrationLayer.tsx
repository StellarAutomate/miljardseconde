import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';

interface CelebrationLayerProps {
    active: boolean;
}

// Dynamically import all GIFs
const gifModules = import.meta.glob('../public/assets/gifs/*.{gif,png,jpg,webp}', { eager: true, import: 'default' });
const GIF_URLS = Object.values(gifModules) as string[];
const FALLBACK_EMOJIS = ['🎉', '🎆', '🚀', '💖', '✨', '🔥'];

export const CelebrationLayer: React.FC<CelebrationLayerProps> = ({ active }) => {
    const [gifStorm, setGifStorm] = useState<{ id: number, x: number, y: number, src: string }[]>([]);

    useEffect(() => {
        if (active) {
            // Sound
            const audio = new Audio('/assets/celebrate.mp3');
            audio.play().catch(e => console.log("Audio play blocked", e));

            // Confetti
            const duration = 120 * 1000;
            const animationEnd = Date.now() + duration;

            const interval = setInterval(() => {
                const timeLeft = animationEnd - Date.now();
                if (timeLeft <= 0) return clearInterval(interval);

                confetti({
                    particleCount: 50,
                    startVelocity: 30,
                    spread: 360,
                    origin: { x: Math.random(), y: Math.random() - 0.2 }
                });
            }, 250);

            // GIF + Emoji Storm
            const gifInterval = setInterval(() => {
                const id = Date.now() + Math.random();
                let src = 'emoji';

                // 70% chance of GIF (if available), 30% chance of Emoji
                if (GIF_URLS.length > 0 && Math.random() > 0.3) {
                    src = GIF_URLS[Math.floor(Math.random() * GIF_URLS.length)];
                } else {
                    src = 'emoji:' + FALLBACK_EMOJIS[Math.floor(Math.random() * FALLBACK_EMOJIS.length)];
                }

                setGifStorm(prev => [...prev.slice(-40), {
                    id,
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    src
                }]);
            }, 150);

            return () => {
                clearInterval(interval);
                clearInterval(gifInterval);
            };
        }
    }, [active]);

    if (!active) return null;

    return (
        <div className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" />

            {gifStorm.map(g => (
                <motion.div
                    key={g.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1.5, 1] }}
                    className="absolute w-32 h-32 flex items-center justify-center"
                    style={{ left: `${g.x}%`, top: `${g.y}%` }}
                >
                    {g.src.startsWith('emoji:') ? (
                        <span className="text-6xl select-none drop-shadow-md">{g.src.split(':')[1]}</span>
                    ) : (
                        <img src={g.src} className="w-full h-full object-contain" alt="celebration" />
                    )}
                </motion.div>
            ))}

            <motion.div
                initial={{ scale: 0.5, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                className="relative z-50 flex flex-col items-center text-center p-8 border-4 border-yellow-400 bg-black/80 rounded-3xl"
            >
                <h1 className="text-6xl md:text-9xl font-black text-yellow-400 drop-shadow-[5px_5px_0px_#ff0000]">
                    1,000,000,000
                </h1>
                <p className="text-white text-2xl font-bold uppercase mt-4 animate-bounce">
                    HET IS GELUKT!
                </p>
            </motion.div>
        </div>
    );
};
