import React from 'react';

export const VideoBackground: React.FC = () => {
    return (
        <div className="fixed inset-0 z-0 bg-black overflow-hidden">
            <video
                src="/assets/bg.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="absolute inset-0 w-full h-full object-cover"
                onError={(e) => {
                    // Fallback if video fails
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.style.background = 'linear-gradient(45deg, #ff00cc, #3333ff)';
                }}
            />
            {/* Overlay to ensure text readability if needed, but requested "Cool and Animated" so keeping it clear */}
            <div className="absolute inset-0 bg-black/10 pointer-events-none"></div>
        </div>
    );
};
