import { motion } from 'framer-motion';

export const MuiscaPattern = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M50 50C50 50 60 40 70 50C80 60 70 80 50 80C30 80 20 60 30 40C40 20 60 10 80 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" opacity="0.2" />
        <circle cx="50" cy="50" r="5" fill="currentColor" opacity="0.3" />
    </svg>
);

const MuiscaBackground = () => {
    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden pointer-events-none bg-[#0a0a0a]">
            {/* Base Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#111] to-[#0a0a0a]" />

            {/* Floating Particles (Golden Dust) */}
            {[...Array(30)].map((_, i) => (
                <motion.div
                    key={`particle-${i}`}
                    className="absolute bg-[#B3A269] rounded-full blur-[1px]"
                    style={{
                        width: Math.random() * 3 + 1,
                        height: Math.random() * 3 + 1,
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                    }}
                    animate={{
                        y: [0, -100, 0],
                        opacity: [0, 0.4, 0],
                        scale: [0, 1.5, 0]
                    }}
                    transition={{
                        duration: Math.random() * 10 + 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: Math.random() * 5
                    }}
                />
            ))}

            {/* Large Muisca Patterns */}
            <div className="absolute inset-0 opacity-[0.03] text-[#B3A269]">
                <MuiscaPattern className="absolute top-[5%] left-[5%] w-96 h-96 animate-pulse" />
                <MuiscaPattern className="absolute top-[40%] right-[10%] w-[30rem] h-[30rem] transform rotate-45" />
                <MuiscaPattern className="absolute bottom-[10%] left-[20%] w-80 h-80 transform -rotate-12" />
            </div>

            {/* Noise Texture Overlay */}
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]" />
        </div>
    );
};

export default MuiscaBackground;
