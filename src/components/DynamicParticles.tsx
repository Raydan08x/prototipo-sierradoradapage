import { useMemo } from 'react';
import { motion, MotionValue, useTransform, useSpring, useScroll } from 'framer-motion';

interface DynamicParticlesProps {
    scrollYProgress?: MotionValue<number>;
    colorSequence?: string[]; // Primary colors for interpolation
    secondaryColorSequence?: string[]; // Secondary colors
    inputRange?: number[]; // Custom scroll breakpoints
    auraOpacity?: number; // Opacity of the atmospheric glow
    particleCount?: number; // Number of particles to render
}

const DynamicParticles = ({
    scrollYProgress: externalScrollProgress,
    colorSequence = ['#DAA520', '#B8860B', '#8B4513', '#DAA520'], // Default Gold Cycle
    secondaryColorSequence = ['#FFD700', '#DAA520', '#CD853F', '#FFD700'],
    inputRange,
    auraOpacity = 0.4,
    particleCount = 12
}: DynamicParticlesProps) => {

    // Internal scroll hook if not provided externally
    const { scrollYProgress: internalScrollProgress } = useScroll();
    const scrollYProgress = externalScrollProgress || internalScrollProgress;

    // Interpolate Global Colors based on scroll
    const numSteps = colorSequence.length;
    // Default to linear 0-1 if no range provided
    const defaultRange = Array.from({ length: numSteps }).map((_, i) => i / (numSteps - 1));
    const range = inputRange || defaultRange;

    // Ensure range length matches color length to avoid errors
    if (range.length !== numSteps) {
        console.warn("DynamicParticles: inputRange length mismatch", range.length, numSteps);
    }

    const color1 = useTransform(scrollYProgress, range, colorSequence);
    const color2 = useTransform(scrollYProgress, range, secondaryColorSequence);

    // Create a particle set
    const particles = useMemo(() => {
        return Array.from({ length: particleCount }).map((_, i) => ({
            id: i,
            x: Math.random() * 100,
            y: Math.random() * 100,
            size: Math.random() * 5 + 2, // Reduced: 2-7px
            isSecondary: Math.random() > 0.5,
            duration: Math.random() * 10 + 10,
            delay: Math.random() * 5,
        }));
    }, []);

    // Parallax effect for particles as a whole or individually?
    // Let's move them slightly with scroll to feel "connected"
    const yMove = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const springY = useSpring(yMove, { stiffness: 40, damping: 20 });

    return (
        <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
            {/* Global Atmospheric Glow that changes color */}
            <motion.div
                className="absolute inset-0 blur-3xl will-change-transform" // Added will-change via class or style
                style={{
                    opacity: auraOpacity,
                    background: useTransform(color1, (c) => `radial-gradient(circle at 50% 50%, ${c} 0%, transparent 60%)`),
                    willChange: "opacity, background" // Hint to browser
                }}
            />

            {/* Particles */}
            {particles.map((p) => (
                <motion.div
                    key={p.id}
                    className="absolute rounded-full" // Removed blur
                    style={{
                        left: `${p.x}%`,
                        top: `${p.y}%`,
                        width: p.size,
                        height: p.size,
                        backgroundColor: p.isSecondary ? color2 : color1,
                        // Optimized: Removed box-shadow entirely for performance
                        y: springY,
                        willChange: "transform, opacity" // Critical for fluidity
                    }}
                    animate={{
                        y: [0, -100, 0],
                        x: [0, Math.random() * 60 - 30, 0],
                        opacity: [0.1, 0.9, 0.1],
                        scale: [0.5, 1.8, 0.5],
                    }}
                    transition={{
                        duration: p.duration,
                        repeat: Infinity,
                        delay: p.delay,
                        ease: "easeInOut",
                    }}
                />
            ))}

            {/* Extra "Sparkles" Layer - Optimized */}
            {Array.from({ length: 3 }).map((_, i) => ( // Reduced to 3
                <motion.div
                    key={`sparkle-${i}`}
                    className="absolute rounded-full bg-white"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        width: Math.random() * 2 + 1,
                        height: Math.random() * 2 + 1,
                        // Removed box-shadow
                        y: springY,
                        willChange: "transform, opacity"
                    }}
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [0, 1, 0]
                    }}
                    transition={{
                        duration: Math.random() * 3 + 2,
                        repeat: Infinity,
                        delay: Math.random() * 5,
                    }}
                />
            ))}
        </div>
    );
};

export default DynamicParticles;
