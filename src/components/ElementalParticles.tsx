import { useMemo, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

interface ElementalParticlesProps {
    colors: string[];
    count?: number;
}

const ElementalParticles = ({ colors, count = 50 }: ElementalParticlesProps) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const yMove = useTransform(scrollYProgress, [0, 1], [0, -100]);
    const springY = useSpring(yMove, { stiffness: 50, damping: 20 });

    const particles = useMemo(() => {
        return Array.from({ length: count }).map((_, i) => ({
            id: i,
            x: Math.random() * 100, // %
            y: Math.random() * 100, // %
            size: Math.random() * 6 + 3, // px, bigger: 3-9px
            color: colors[Math.floor(Math.random() * colors.length)],
            duration: Math.random() * 10 + 10,
            delay: Math.random() * 5,
        }));
    }, [colors, count]);

    return (
        <div ref={containerRef} className="absolute inset-0 pointer-events-none overflow-hidden z-0">
            {/* Stronger Gradient Overlay */}
            <div
                className="absolute inset-0 opacity-30"
                style={{
                    background: `radial-gradient(circle at center, ${colors[0]}00 0%, transparent 80%)`
                }}
            />

            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full blur-[1px]"
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                        backgroundColor: p.color,
                        boxShadow: `0 0 ${p.size * 3}px ${p.color}`, // Stronger glow
                        y: springY // Parallax effect
                    }}
                    animate={{
                        y: [0, -50, 0], // Floating logic combined with parallax
                        x: [0, Math.random() * 40 - 20, 0], // Bigger sway
                        opacity: [0.2, 0.8, 0.2], // More visible pulse
                        scale: [0.8, 1.4, 0.8],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "easeInOut",
                    }}
                />
            ))}
        </div>
    );
};

export default ElementalParticles;
