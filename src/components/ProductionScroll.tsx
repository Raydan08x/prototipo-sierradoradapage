import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Wheat,
    Waves,
    Flame,
    Sparkles,
    Hourglass,
    Filter,
    Wind,
    Beer
} from 'lucide-react';

const steps = [
    {
        id: 1,
        name: 'Malta',
        icon: Wheat,
        description: 'El alma de nuestra cerveza. Seleccionamos granos dorados que han absorbido la energía del sol.'
    },
    {
        id: 2,
        name: 'Maceración',
        icon: Waves,
        description: 'El agua pura de manantial despierta los azúcares dormidos en el grano, creando un mosto dulce y aromático.'
    },
    {
        id: 3,
        name: 'Cocción',
        icon: Flame,
        description: 'El fuego transforma el mosto. Aquí el lúpulo danza en el caldero, aportando su carácter amargo y floral.'
    },
    {
        id: 4,
        name: 'Fermentación',
        icon: Sparkles,
        description: 'La magia ocurre en la oscuridad. La levadura trabaja incansablemente, convirtiendo el azúcar en espíritu.'
    },
    {
        id: 5,
        name: 'Maduración',
        icon: Hourglass,
        description: 'La paciencia es nuestra virtud. Dejamos que el tiempo pula las asperezas y armonice los sabores.'
    },
    {
        id: 6,
        name: 'Filtración',
        icon: Filter,
        description: 'Claridad cristalina. Eliminamos lo innecesario para revelar la brillantez de nuestra creación.'
    },
    {
        id: 7,
        name: 'Carbonatación',
        icon: Wind,
        description: 'El soplo de vida. Infundimos la chispa que hace bailar las burbujas en tu copa.'
    },
    {
        id: 8,
        name: 'Envasado',
        icon: Beer,
        description: 'El tesoro final. Sellamos nuestra leyenda en cada botella, lista para ser descubierta por ti.'
    }
];

const ProductionScroll = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    return (
        <div ref={containerRef} className="py-20 relative overflow-hidden">
            {/* Central Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-[#B3A269]/20 transform -translate-x-1/2">
                <motion.div
                    className="absolute top-0 left-0 right-0 bg-[#B3A269]"
                    style={{ height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
                />
            </div>

            <div className="max-w-5xl mx-auto px-4 relative z-10">
                <h2 className="text-4xl md:text-5xl font-dorsa text-[#B3A269] text-center mb-24 tracking-wider">
                    EL VIAJE SAGRADO
                </h2>

                {steps.map((step, index) => {
                    const isEven = index % 2 === 0;
                    return (
                        <div key={step.id} className={`flex items-center mb-32 ${isEven ? 'justify-end' : 'justify-start'} relative`}>
                            {/* Timeline Node */}
                            <div className="absolute left-1/2 transform -translate-x-1/2 flex items-center justify-center w-12 h-12 bg-[#222223] border-4 border-[#B3A269] rounded-full z-20">
                                <span className="text-[#B3A269] font-bold text-sm">{step.id}</span>
                            </div>

                            {/* Content Card */}
                            <motion.div
                                initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true, margin: "-100px" }}
                                transition={{ duration: 0.8, type: "spring" }}
                                className={`w-[45%] bg-[#2A2A2B]/80 backdrop-blur-sm p-8 rounded-xl border border-[#B3A269]/20 hover:border-[#B3A269]/50 transition-colors group ${isEven ? 'text-left pl-12' : 'text-right pr-12'
                                    }`}
                            >
                                <div className={`flex items-center gap-4 mb-4 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
                                    <step.icon className="w-8 h-8 text-[#B3A269] group-hover:text-[#E5E1E6] transition-colors" />
                                    <h3 className="text-2xl font-barlow-condensed font-bold text-[#E5E1E6] uppercase tracking-wide">
                                        {step.name}
                                    </h3>
                                </div>
                                <p className="text-[#E5E1E6]/70 leading-relaxed font-barlow">
                                    {step.description}
                                </p>
                            </motion.div>
                        </div>
                    );
                })}
            </div>

            {/* Background Ambience */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-20">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#B3A269] rounded-full filter blur-[100px]" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#8B4513] rounded-full filter blur-[120px]" />
            </div>
        </div>
    );
};

export default ProductionScroll;
