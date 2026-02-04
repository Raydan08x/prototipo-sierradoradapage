import { useRef, useMemo } from 'react';
import { motion } from 'framer-motion';

const FireParticles = () => {
    // Generate static initial positions to avoid hydration mismatch if SSR (though this is SPA)
    // and to be performant.
    const particles = useMemo(() => {
        return Array.from({ length: 40 }).map((_, i) => ({
            id: i,
            x: Math.random() * 100, // %
            y: Math.random() * 100, // %
            size: Math.random() * 4 + 1, // px
            duration: Math.random() * 10 + 10,
            delay: Math.random() * 5,
        }));
    }, []);

    return (
        <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {/* Red Atmospheric Glow */}
            <div className="absolute inset-0 bg-gradient-radial from-[#FF4500]/10 via-transparent to-transparent opacity-50" />

            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full bg-[#FF4500] blur-[1px]"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                    }}
                    animate={{
                        y: [0, -100, 0], // Float up and down gently
                        x: [0, Math.random() * 20 - 10, 0], // Sways
                        opacity: [0, 0.6, 0],
                        scale: [1, 1.5, 1],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "linear",
                    }}
                />
            ))}
        </div>
    );
};

export default FireParticles;
