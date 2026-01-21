import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ClickEffectProps {
    isActive: boolean;
}

interface SpawnedGif {
    id: number;
    x: number;
    y: number;
    rotation: number;
    scale: number;
    src: string;
}

// Dynamically import all GIFs from the assets/gifs folder
// Adjusted path to look in ../public/assets/gifs since user placed them there
const gifModules = import.meta.glob('../public/assets/gifs/*.{gif,png,jpg,webp}', { eager: true, import: 'default' });
const GIF_URLS = Object.values(gifModules) as string[];

export const ClickEffects: React.FC<ClickEffectProps> = ({ isActive }) => {
    const [spawns, setSpawns] = useState<SpawnedGif[]>([]);

    useEffect(() => {
        if (!isActive) return;

        const handleClick = (e: MouseEvent | TouchEvent) => {
            const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
            const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;

            // If no GIFs, do nothing (User requested only GIFs for normal clicks)
            if (GIF_URLS.length === 0) return;

            const id = Date.now();
            const src = GIF_URLS[Math.floor(Math.random() * GIF_URLS.length)];

            const newSpawn: SpawnedGif = {
                id,
                x: clientX,
                y: clientY,
                rotation: (Math.random() - 0.5) * 60,
                scale: 0.5 + Math.random() * 1.5,
                src
            };

            setSpawns(prev => [...prev, newSpawn]);

            // Cleanup
            setTimeout(() => {
                setSpawns(prev => prev.filter(s => s.id !== id));
            }, 3000);
        };

        window.addEventListener('click', handleClick);

        return () => {
            window.removeEventListener('click', handleClick);
        };
    }, [isActive]);

    return (
        <div className="fixed inset-0 pointer-events-none z-40 overflow-hidden">
            <AnimatePresence>
                {spawns.map(gif => (
                    <motion.div
                        key={gif.id}
                        initial={{ scale: 0, opacity: 0, x: gif.x, y: gif.y, rotate: 0 }}
                        animate={{ scale: gif.scale, opacity: 1, rotate: gif.rotation }}
                        exit={{ scale: 0, opacity: 0 }}
                        className="absolute -ml-16 -mt-16 flex items-center justify-center w-32 h-32"
                    >
                        <img
                            src={gif.src}
                            className="w-full h-full object-contain pointer-events-none"
                            alt="sticker"
                        />
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
};
