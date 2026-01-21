import React from 'react';
import { CalendarPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const imageModules = import.meta.glob('../public/assets/nathan pics/*.{png,jpg,jpeg,webp}', { eager: true, import: 'default' });
const IMAGE_URLS = Object.values(imageModules) as string[];

export const InvitationCard: React.FC = () => {
    const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

    React.useEffect(() => {
        if (IMAGE_URLS.length === 0) return;
        const interval = setInterval(() => {
            setCurrentImageIndex(prev => (prev + 1) % IMAGE_URLS.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    // Google Calendar Link Construction
    const title = encodeURIComponent("Nathan's 1 Miljardste Seconde & DoMiBo");
    const dates = "20260326T170000/20260326T230000";
    const details = encodeURIComponent("Vier dit unieke moment met mij! Lieve vrienden, binnenkort zal ik een miljard seconden rondlopen op deze prachtige aardbol. Kom dit vieren!");
    const location = encodeURIComponent("Zaagmolenkade 22, Utrecht");

    // ICS File Generation Logic (for download)
    const downloadIcs = () => {
        const icsContent = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
URL:${document.location.href}
DTSTART:20260326T170000
DTEND:20260326T230000
SUMMARY:Nathan's 1 Miljardste Seconde
DESCRIPTION:Vier dit unieke moment met mij!
LOCATION:Zaagmolenkade 22, Utrecht
END:VEVENT
END:VCALENDAR`;
        const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.setAttribute('download', 'nathan-miljard.ics');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="bg-black/40 backdrop-blur-md border border-white/20 p-6 rounded-2xl max-w-xl shadow-2xl pointer-events-auto flex flex-col gap-4 mx-4 md:mx-0">

            {/* Top Section: Title & Intro */}
            <div className="text-center md:text-right">
                <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-pink-500 mb-2">
                    Uitnodiging: 1 Miljard Seconden
                </h3>
                <p className="text-sm text-gray-200 leading-relaxed">
                    Lieve vrienden. Binnenkort zal ik een <span className="text-yellow-300 font-bold">miljard seconden</span> rondlopen op deze prachtige aardbol.
                    Kom dit vieren aan de <span className="font-bold">Zaagmolenkade 22 te Utrecht</span> op <span className="text-pink-300 font-bold">26 maart</span> (vanaf 17:00).
                </p>
            </div>

            {/* Bottom Section: Split View */}
            <div className="flex flex-row items-center justify-between gap-4 border-t border-white/10 pt-4">

                {/* Left: Slideshow */}
                {IMAGE_URLS.length > 0 && (
                    <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 relative">
                        <motion.div
                            animate={{ y: [0, -5, 0] }}
                            transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                            className="w-full h-full"
                        >
                            <AnimatePresence mode='wait'>
                                <motion.img
                                    key={currentImageIndex}
                                    src={IMAGE_URLS[currentImageIndex]}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.5 }}
                                    className="w-full h-full object-cover rounded-full border-2 border-white/20 drop-shadow-lg"
                                    alt="Nathan"
                                />
                            </AnimatePresence>
                        </motion.div>
                    </div>
                )}

                {/* Right: CTA & Button */}
                <div className="flex-1 text-right flex flex-col items-end gap-2">
                    <p className="text-xs text-white/80 max-w-[150px]">
                        Voeg deze gelegenheid direct toe aan je agenda!
                    </p>
                    <button
                        onClick={downloadIcs}
                        className="bg-white text-black px-4 py-2 rounded-full font-bold text-xs uppercase tracking-wide flex items-center gap-2 hover:bg-yellow-300 transition-colors shadow-lg whitespace-nowrap"
                    >
                        <CalendarPlus size={14} />
                        Zet in Agenda
                    </button>
                </div>
            </div>
        </div>
    );
};
