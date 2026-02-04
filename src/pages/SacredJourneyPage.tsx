import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';
import {
    Wheat,
    Waves,
    Flame,
    Sparkles,
    Hourglass,
    Filter,
    Wind,
    Gem,
    ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import MuiscaBackground, { MuiscaPattern } from '../components/MuiscaBackground';
import DynamicParticles from '../components/DynamicParticles';

const steps = [
    {
        id: 1,
        element: 'Tierra',
        color: '#8B4513',
        particleColors: ['#DAA520', '#8B4513'], // Gold & Brown
        glow: 'rgba(139, 69, 19, 0.4)',
        title: 'El Oro de la Tierra',
        date: 'El Comienzo',
        icon: Wheat,
        myth: 'Bachué, madre de la humanidad, emergió de la laguna trayendo vida. Bendijo la tierra fértil donde el sol de Xue besa los campos dorados.',
        ritual: 'Seleccionamos cebada que guarda la memoria del suelo. Al maltearla, despertamos la semilla, liberando la energía vital de la tierra.'
    },
    {
        id: 2,
        element: 'Agua',
        color: '#0077BE',
        particleColors: ['#0077BE', '#DAA520'], // Blue & Gold - Blue dominant
        glow: 'rgba(0, 119, 190, 0.4)',
        title: 'El Baño Sagrado',
        date: 'La Purificación',
        icon: Waves,
        myth: 'En Guatavita, el Zipa se cubría de oro y se sumergía en las aguas para restaurar el equilibrio entre lo humano y lo divino.',
        ritual: 'Sumergimos el grano en un baño caliente, extrayendo su alma dulce. Es un acto de purificación donde lo sólido se vuelve líquido vital.'
    },
    {
        id: 3,
        element: 'Fuego',
        color: '#FF4500',
        particleColors: ['#FF4500', '#FF0000', '#FFA500'], // Reds & Orange
        glow: 'rgba(255, 69, 0, 0.4)',
        title: 'El Fuego de Xue',
        date: 'La Alquimia',
        icon: Flame,
        myth: 'Xue entregó el fuego no para destruir, sino para transformar. Es la fuerza masculina que otorga vigor y carácter a la existencia.',
        ritual: 'El mosto hierve bajo la protección del lúpulo. El fuego esteriliza y concentra, mientras las flores sacrifican su aroma para proteger la bebida.'
    },
    {
        id: 4,
        element: 'Espíritu',
        color: '#90EE90', // Light Green
        particleColors: ['#90EE90', '#98FB98', '#00FA9A'], // Green variants
        glow: 'rgba(144, 238, 144, 0.4)',
        title: 'El Aliento de Huitaca',
        date: 'La Transmutación',
        icon: Sparkles,
        myth: 'Huitaca, diosa rebelde de la luna, danza en lo oculto. Ella enseña que la verdadera magia ocurre en el silencio de la noche.',
        ritual: 'En la oscuridad, sembramos la levadura. Ella respira vida en el líquido inerte, transformando el azúcar en espíritu. La magia es invisible.'
    },
    {
        id: 5,
        element: 'Tiempo',
        color: '#DAA520',
        particleColors: ['#DAA520', '#B8860B'], // Gold & Dark Goldenrod
        glow: 'rgba(218, 165, 32, 0.3)',
        title: 'El Sueño de Bochica',
        date: 'La Sabiduría',
        icon: Hourglass,
        myth: 'Bochica meditó en las cumbres, enseñando que nada grandioso nace de la prisa. El tiempo es el ingrediente que los dioses regalan.',
        ritual: 'La maduración es un acto de fe. En el frío silencio, los sabores se armonizan y el carácter se asienta. Honramos la paciencia.'
    },
    {
        id: 6,
        element: 'Pureza',
        color: '#E0FFFF',
        particleColors: ['#E0FFFF', '#00FFFF', '#F0F8FF'], // Cyan & AliceBlue
        glow: 'rgba(224, 255, 255, 0.3)',
        title: 'La Claridad del Zipa',
        date: 'La Revelación',
        icon: Filter,
        myth: 'Cuando la niebla se levanta, el oro brilla en el fondo de la laguna. La verdad se revela solo cuando se aparta lo innecesario.',
        ritual: 'Filtramos para buscar el brillo, la claridad que permite a la luz atravesar el líquido como si fuera una joya ofrendada al sol.'
    },
    {
        id: 7,
        element: 'Aire',
        color: '#87CEEB',
        particleColors: ['#87CEEB', '#B0C4DE'], // Sky Blue
        glow: 'rgba(135, 206, 235, 0.4)',
        title: 'El Espíritu del Viento',
        date: 'El Aliento',
        icon: Wind,
        myth: 'Cuchavira, el arcoíris, une cielo y tierra. Su aliento invisible anima la materia, dándole voz y movimiento.',
        ritual: 'La carbonatación es el soplo final. Infundimos la chispa que hará bailar las burbujas en tu copa, celebrando la vida.'
    },
    {
        id: 8,
        element: 'Tesoro',
        color: '#FFD700',
        particleColors: ['#FFD700', '#FFD700'], // Pure Gold
        glow: 'rgba(255, 215, 0, 0.5)',
        title: 'La Ofrenda Final',
        date: 'El Legado',
        icon: Gem,
        myth: 'El Dorado es un rito de gratitud. El oro vuelve a la tierra para cerrar el ciclo sagrado de dar y recibir.',
        ritual: 'Sellamos este mito líquido en vidrio. No es solo un producto, es una historia lista para ser bebida. El ritual está completo.'
    }
];



const SacredJourneyPage = () => {
    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end end"]
    });

    // "Illuminated Path" - The main progress line fills with gold
    const pathHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

    // Smooth scroll progress for top bar
    const smoothProgress = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

    // Extract color sequences for DynamicParticles
    // We prepend a "Hero" state (Black/Dark) at the start so the color kicks in only when the first step appears
    const primaryColors = ['#0a0a0a', ...steps.map(s => s.particleColors[0])];
    const secondaryColors = ['#0a0a0a', ...steps.map(s => s.particleColors[1] || s.particleColors[0])];

    // Custom breakpoints to synchronize with the scroll position of each step
    // Custom breakpoints to simplify valid scroll synchronization
    // User defined specific values
    const colorOffsets = [0.0, 0.18, 0.22, 0.30, 0.40, 0.52, 0.63, 0.74, 0.85];

    return (
        <div ref={containerRef} className="bg-[#0a0a0a] text-[#E5E1E6] relative overflow-hidden min-h-screen">

            {/* Dynamic Background & Particles - Global & Enhanced */}
            <MuiscaBackground />
            <DynamicParticles
                scrollYProgress={scrollYProgress}
                colorSequence={primaryColors}
                secondaryColorSequence={secondaryColors}
                inputRange={colorOffsets}
            />

            {/* Navigation */}
            <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => navigate('/nuestra-leyenda')}
                className="fixed top-6 left-6 md:top-8 md:left-8 z-50 flex items-center gap-2 text-[#B3A269] hover:text-[#E5E1E6] transition-colors group bg-black/50 p-2 rounded-full backdrop-blur-sm sm:bg-transparent sm:p-0"
            >
                <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
                <span className="font-barlow font-medium hidden sm:inline">Volver a la Leyenda</span>
            </motion.button>

            {/* Progress Bar (Top) */}
            <motion.div
                className="fixed top-0 left-0 h-1 bg-[#B3A269] z-50 origin-left shadow-[0_0_10px_#B3A269]"
                style={{ scaleX: smoothProgress }}
            />

            {/* Hero Section */}
            <section className="min-h-screen flex flex-col items-center justify-center relative z-10 px-4 pt-10">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1.5 }}
                    className="text-center relative"
                >
                    {/* Decorative Top Line */}
                    <div className="mb-8 flex justify-center">
                        <motion.div
                            className="w-[1px] bg-gradient-to-b from-transparent to-[#B3A269]"
                            initial={{ height: 0 }}
                            animate={{ height: 100 }}
                            transition={{ duration: 1.5 }}
                        />
                    </div>

                    <h1 className="text-7xl md:text-9xl font-dorsa text-[#B3A269] mb-4 tracking-widest text-shadow-gold relative z-20">
                        EL VIAJE
                    </h1>
                    <motion.h1
                        className="text-7xl md:text-9xl font-dorsa text-[#B3A269] mb-8 tracking-widest text-shadow-gold relative z-20"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                    >
                        SAGRADO
                    </motion.h1>

                    <p className="text-lg md:text-2xl text-[#E5E1E6]/80 font-barlow max-w-xl mx-auto leading-relaxed relative z-20 bg-[#0a0a0a]/50 backdrop-blur-sm p-4 rounded-xl">
                        Una travesía mística desde la tierra hasta lo divino.
                        <br />
                        <span className="text-[#B3A269] italic">El mito se hace líquido.</span>
                    </p>
                </motion.div>
            </section>

            {/* Timeline Section */}
            <div className="relative z-10 pb-40">

                {/* Main Path Lines */}
                <div className="absolute left-[24px] md:left-1/2 top-0 bottom-0 w-px transform md:-translate-x-1/2 overflow-hidden h-full z-0">
                    {/* Faint Guide Line */}
                    <div className="absolute inset-0 bg-[#B3A269]/10" />

                    {/* Illuminated Line (Progressive Fill) */}
                    <motion.div
                        className="absolute top-0 left-0 right-0 bg-[#B3A269] shadow-[0_0_15px_rgba(179,162,105,0.8)]"
                        style={{ height: pathHeight }}
                    />
                </div>

                {steps.map((step, index) => {
                    const isEven = index % 2 === 0;
                    return (
                        <div key={step.id} className="relative min-h-[70vh] flex items-center mb-12 overflow-hidden">
                            {/* Particles are now Global - Removed Local ElementalParticles */}
                            {/* Glow is now Global Atmospheric - Removed Local Contextual Glow */}

                            <div className="container mx-auto px-4 md:px-8 relative grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 items-center z-10">

                                {/* Timeline Marker (Center) */}
                                <div className="absolute left-[24px] md:left-1/2 transform -translate-x-1/2 flex flex-col items-center justify-center z-10">
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0.5, borderColor: '#333', boxShadow: 'none' }}
                                        whileInView={{
                                            scale: 1.2,
                                            opacity: 1,
                                            borderColor: step.color,
                                            backgroundColor: '#1a1a1a',
                                            boxShadow: `0 0 30px ${step.color}66` // 66 = ~40% opacity
                                        }}
                                        transition={{ duration: 0.5 }}
                                        viewport={{ margin: "-45% 0px -45% 0px" }} // Triggers when roughly centered
                                        className="w-12 h-12 md:w-16 md:h-16 bg-[#0a0a0a] border-2 rounded-full flex items-center justify-center transition-colors duration-500"
                                    >
                                        <step.icon className="w-5 h-5 md:w-8 md:h-8" style={{ color: step.color }} />
                                    </motion.div>
                                </div>

                                {/* Left Side Content */}
                                <motion.div
                                    initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                                    whileInView={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.8 }}
                                    // Removed viewport: { once: true } for persistent dynamism
                                    className={`pl-16 md:pl-0 ${isEven ? 'md:text-right md:pr-12' : 'md:order-2 md:pl-12'} relative`}
                                >
                                    <MuiscaPattern className={`absolute w-full h-full text-[#B3A269] opacity-[0.04] pointer-events-none -z-10 top-0 ${isEven ? 'right-0' : 'left-0'}`} />

                                    <span style={{ color: step.color }} className="text-xs font-bold tracking-[0.2em] uppercase block mb-2">
                                        {step.date}
                                    </span>
                                    <h3 className="text-4xl md:text-6xl font-barlow-condensed font-bold text-[#E5E1E6] mb-4 uppercase leading-none">
                                        {step.title}
                                    </h3>
                                    <div
                                        className={`p-6 border-l-2 bg-[#1a1a1a]/80 backdrop-blur-sm rounded-r-lg relative z-20 ${isEven ? 'md:border-l-0 md:border-r-2 md:rounded-r-none md:rounded-l-lg' : ''}`}
                                        style={{ borderColor: `${step.color}4D` }} // 30% opacity
                                    >
                                        <p className="text-[#E5E1E6]/90 font-serif text-lg italic leading-relaxed">
                                            "{step.myth}"
                                        </p>
                                    </div>
                                </motion.div>

                                {/* Right Side Content (Ritual) */}
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.8, delay: 0.2 }}
                                    className={`pl-16 md:pl-0 ${isEven ? 'md:order-2 md:pl-12' : 'md:text-right md:pr-12'} mt-4 md: mt-0`}
                                >
                                    <h4 style={{ color: step.color }} className={`font-barlow-condensed font-bold text-xl uppercase mb-3 flex items-center gap-3 ${isEven ? '' : 'md:justify-end'}`}>
                                        <span className="w-8 h-[1px]" style={{ backgroundColor: step.color }} />
                                        El Ritual
                                    </h4>
                                    <p className="text-[#E5E1E6]/60 font-barlow text-base leading-relaxed text-justify">
                                        {step.ritual}
                                    </p>
                                </motion.div>

                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Footer */}
            <section className="min-h-[60vh] flex flex-col items-center justify-center relative z-10 px-4 text-center">
                <div className="absolute top-0 w-[1px] h-32 bg-gradient-to-b from-[#B3A269] to-transparent" />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8 }}
                >
                    <Gem className="w-16 h-16 text-[#B3A269] mx-auto mb-6 animate-[bounce_3s_infinite]" />
                    <h2 className="text-6xl md:text-8xl font-dorsa text-[#E5E1E6] mb-8">
                        LEYENDA VIVA
                    </h2>
                    <div className="flex flex-col md:flex-row gap-6 justify-center">
                        <button
                            onClick={() => navigate('/productos')}
                            className="px-8 py-4 bg-[#B3A269] text-[#0a0a0a] text-lg font-bold tracking-widest hover:bg-[#E5E1E6] transition-all duration-300 shadow-[0_0_30px_rgba(179,162,105,0.4)] rounded-sm"
                        >
                            DESCUBRE NUESTROS TESOROS
                        </button>
                        <button
                            onClick={() => navigate('/contacto')}
                            className="px-8 py-4 border-2 border-[#B3A269] text-[#B3A269] text-lg font-bold tracking-widest hover:bg-[#B3A269]/10 transition-all duration-300 rounded-sm"
                        >
                            VISITA EL TEMPLO
                        </button>
                    </div>
                </motion.div>
            </section>

            {/* Removed BookingForm, added CTA */}
            <section className="py-24 px-4 bg-transparent relative z-10">
                <div className="max-w-4xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="mb-12"
                    >
                        <h2 className="text-4xl md:text-5xl font-bold text-[#B3A269] mb-6">Vive la Experiencia</h2>
                        <p className="text-xl text-[#E5E1E6] mb-8">
                            Únete a nosotros los fines de semana y descubre el secreto de nuestra alquimia.
                        </p>
                        <button
                            onClick={() => navigate('/servicios')}
                            className="px-8 py-4 bg-[#B3A269] text-[#0a0a0a] text-xl font-bold tracking-widest hover:bg-[#E5E1E6] transition-all duration-300 shadow-[0_0_20px_rgba(179,162,105,0.4)] rounded-sm"
                        >
                            AGENDAR VISITA
                        </button>
                    </motion.div>
                </div>
            </section>
        </div>
    );
};

export default SacredJourneyPage;
