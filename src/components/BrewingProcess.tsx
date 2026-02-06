import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
import { useNavigate, useLocation } from 'react-router-dom';

const BrewingProcess = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const testRef = useRef<HTMLDivElement>(null);
  const [showTest, setShowTest] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('openTest') === 'true') {
      setShowTest(true);
      // Wait for layout update then scroll
      setTimeout(() => {
        testRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 500);
    }
  }, [location.search]);

  const steps = [
    {
      id: 1,
      name: 'Malta',
      icon: Wheat,
      color: '#8B4513',
      description: 'Seleccionamos cuidadosamente las mejores maltas según el estilo de cerveza a elaborar. La malta base proporciona los azúcares fermentables, mientras que las maltas especiales aportan color y sabores únicos. Luego, molemos la malta para exponer el endospermo sin dañar la cáscara, lo que es crucial para una maceración eficiente.'
    },
    {
      id: 2,
      name: 'Maceración',
      icon: Waves,
      color: '#B3A269',
      description: 'Durante la maceración, mezclamos la malta molida con agua caliente a temperaturas específicas (entre 63-68°C) para activar las enzimas que convierten el almidón en azúcares fermentables. Este proceso dura aproximadamente 60-90 minutos, y la temperatura exacta afecta el perfil final de la cerveza.'
    },
    {
      id: 3,
      name: 'Cocción',
      icon: Flame,
      color: '#B3A269',
      description: 'El mosto se hierve durante 60-90 minutos. Durante este tiempo, agregamos lúpulos en diferentes momentos: al inicio para el amargor, a la mitad para el sabor, y al final para el aroma. La cocción también esteriliza el mosto y concentra los azúcares.'
    },
    {
      id: 4,
      name: 'Fermentación',
      icon: Sparkles,
      color: '#B3A269',
      description: 'Añadimos levadura seleccionada al mosto enfriado. Durante 5-7 días, la levadura convierte los azúcares en alcohol y CO2, creando también compuestos aromáticos característicos. La temperatura de fermentación se controla cuidadosamente según el estilo de cerveza.'
    },
    {
      id: 5,
      name: 'Maduración',
      icon: Hourglass,
      color: '#B3A269',
      description: 'La cerveza "verde" se madura a bajas temperaturas durante varias semanas. Este proceso permite que los sabores se desarrollen y se suavicen, mejorando la claridad y estabilidad de la cerveza. El tiempo varía según el estilo, desde una semana hasta varios meses.'
    },
    {
      id: 6,
      name: 'Filtración',
      icon: Filter,
      color: '#B3A269',
      description: 'Filtramos la cerveza para eliminar levaduras residuales y partículas en suspensión, logrando una brillantez característica. Algunas cervezas, como nuestras ales especiales, se dejan sin filtrar para mantener su complejidad natural.'
    },
    {
      id: 7,
      name: 'Carbonatación',
      icon: Wind,
      color: '#B3A269',
      description: 'Ajustamos el nivel de CO2 según el estilo. La carbonatación puede ser natural (con azúcares residuales o priming) o forzada (CO2 presurizado). Este proceso afecta la textura y la presentación de la espuma.'
    },
    {
      id: 8,
      name: 'Envasado',
      icon: Beer,
      color: '#B3A269',
      description: 'La cerveza se envasa en botellas o barriles con extremo cuidado para evitar la oxidación. Cada lote se etiqueta con información de trazabilidad y se almacena en condiciones controladas hasta su distribución.'
    }
  ];

  const questions = [
    {
      question: "¿Qué prefieres hacer en tu tiempo libre?",
      options: [
        "Explorar nuevos lugares y aventuras",
        "Meditar y reflexionar sobre la vida",
        "Bailar y celebrar con amigos",
        "Disfrutar de una buena conversación"
      ]
    },
    {
      question: "¿Qué sabores te atraen más?",
      options: [
        "Cítricos y tropicales",
        "Intensos y complejos",
        "Ácidos y frutales",
        "Tostados y robustos"
      ]
    },
    {
      question: "¿Cómo te describes a ti mismo?",
      options: [
        "Aventurero y espontáneo",
        "Místico y espiritual",
        "Social y extrovertido",
        "Reflexivo y profundo"
      ]
    },
    {
      question: "¿Qué tipo de música prefieres?",
      options: [
        "Rock alternativo y indie",
        "Música clásica y experimental",
        "Ritmos tropicales y electrónica",
        "Jazz y blues"
      ]
    },
    {
      question: "¿Cuál es tu momento favorito del día?",
      options: [
        "El amanecer, cuando sale el sol",
        "El atardecer, hora de reflexión",
        "La tarde, llena de energía",
        "La noche, momento de calma"
      ]
    },
    {
      question: "¿Qué tipo de clima prefieres?",
      options: [
        "Soleado y cálido",
        "Tormentoso y místico",
        "Brisa fresca y tropical",
        "Frío y acogedor"
      ]
    },
    {
      question: "¿Qué tipo de comida prefieres?",
      options: [
        "Platos frescos y ligeros",
        "Sabores intensos y especiados",
        "Comida picante y vibrante",
        "Platos reconfortantes y robustos"
      ]
    },
    {
      question: "¿Cuál es tu lugar ideal para relajarte?",
      options: [
        "Una montaña con vista al valle",
        "Un templo antiguo",
        "Una playa tropical",
        "Una cabaña junto al fuego"
      ]
    },
    {
      question: "¿Qué elemento natural te identifica más?",
      options: [
        "El sol y su energía",
        "El viento y su libertad",
        "El agua y su fluidez",
        "La tierra y su fuerza"
      ]
    },
    {
      question: "¿Qué cualidad valoras más en una bebida?",
      options: [
        "Refrescante y equilibrada",
        "Compleja y contemplativa",
        "Vibrante y única",
        "Intensa y reconfortante"
      ]
    }
  ];

  const beers = [
    {
      id: '1',
      name: 'American Pale Ale',
      description: 'Inspirada en Xue, dios del sol. Perfecta para espíritus aventureros y vibrantes.',
      match: [0, 0, 0, 0] // Perfil aventurero
    },
    {
      id: '2',
      name: 'Barley Wine',
      description: 'Inspirada en Bochica, el sabio. Ideal para almas contemplativas y profundas.',
      match: [1, 1, 1, 1] // Perfil místico
    },
    {
      id: '3',
      name: 'Sour Ale con Corozo',
      description: 'Inspirada en Bachué, madre de la humanidad. Para espíritus sociales y alegres.',
      match: [2, 2, 2, 2] // Perfil social
    },
    {
      id: '4',
      name: 'Stout Premium',
      description: 'Inspirada en Chibchacum, dios de la tierra. Para almas reflexivas y complejas.',
      match: [3, 3, 3, 3] // Perfil reflexivo
    }
  ];

  const handleAnswer = (selectedOption: number) => {
    const newAnswers = [...answers, selectedOption];
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // Calculate match
      const result = calculateMatch(newAnswers);
      showResult(result);
    }
  };

  const calculateMatch = (userAnswers: number[]) => {
    // Count frequency of each answer
    const frequency = userAnswers.reduce((acc, val) => {
      acc[val] = (acc[val] || 0) + 1;
      return acc;
    }, {} as Record<number, number>);

    // Find the most frequent answer
    let maxCount = 0;
    let bestMatch = 0;

    Object.entries(frequency).forEach(([answer, count]) => {
      if (count > maxCount) {
        maxCount = count;
        bestMatch = parseInt(answer);
      }
    });

    return beers[bestMatch];
  };

  const showResult = (beer: typeof beers[0]) => {
    setTimeout(() => {
      setShowTest(false);
      setCurrentQuestion(0);
      setAnswers([]);
      navigate(`/producto/${beer.id}`);
    }, 3000);
  };

  return (
    <div className="py-12">
      <div className="max-w-full sm:max-w-4xl mx-auto px-1 sm:px-4">
        <div className="relative bg-[#222223] p-4 sm:p-8 rounded-lg">
          <h3 className="text-center text-[#B3A269] text-4xl md:text-5xl font-dorsa mb-12">PROCESO CERVECERO</h3>

          {/* Steps Grid 1-4 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8 mb-8">
            {steps.slice(0, 4).map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative group cursor-pointer"
                  onClick={() => setSelectedStep(selectedStep === step.id ? null : step.id)}
                >
                  <div
                    className={`w-16 sm:w-20 h-20 sm:h-24 bg-[#2A2A2B] rounded-xl flex items-center justify-center mb-2 transition-all duration-300 shadow-lg ${selectedStep === step.id ? 'ring-2 ring-[#B3A269] shadow-[0_0_15px_rgba(179,162,105,0.3)]' : 'group-hover:bg-[#333]'
                      }`}
                  >
                    <div className="absolute top-1 left-1 sm:top-2 sm:left-2 w-5 h-5 sm:w-6 sm:h-6 bg-[#B3A269] rounded-full flex items-center justify-center text-[#222223] text-xs sm:text-sm font-bold shadow-sm">
                      {step.id}
                    </div>
                    <step.icon className={`w-6 h-6 sm:w-8 sm:h-8 transition-colors duration-300 ${selectedStep === step.id ? 'text-[#B3A269] drop-shadow-[0_0_8px_rgba(179,162,105,0.5)]' : 'text-[#E5E1E6]/50 group-hover:text-[#B3A269]'}`} />
                  </div>
                  <span className={`text-xs sm:text-sm font-barlow-condensed text-center block transition-colors duration-300 ${selectedStep === step.id ? 'text-[#B3A269] font-bold' : 'text-[#E5E1E6]/70 group-hover:text-[#E5E1E6]'}`}>
                    {step.name}
                  </span>
                </motion.div>
              </div>
            ))}
          </div>

          {/* Steps Grid 5-8 */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-8">
            {steps.slice(4).map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ delay: (index + 4) * 0.1 }}
                  className="relative group cursor-pointer"
                  onClick={() => setSelectedStep(selectedStep === step.id ? null : step.id)}
                >
                  <div
                    className={`w-16 sm:w-20 h-20 sm:h-24 bg-[#2A2A2B] rounded-xl flex items-center justify-center mb-2 transition-all duration-300 shadow-lg ${selectedStep === step.id ? 'ring-2 ring-[#B3A269] shadow-[0_0_15px_rgba(179,162,105,0.3)]' : 'group-hover:bg-[#333]'
                      }`}
                  >
                    <div className="absolute top-1 left-1 sm:top-2 sm:left-2 w-5 h-5 sm:w-6 sm:h-6 bg-[#B3A269] rounded-full flex items-center justify-center text-[#222223] text-xs sm:text-sm font-bold shadow-sm">
                      {step.id}
                    </div>
                    <step.icon className={`w-6 h-6 sm:w-8 sm:h-8 transition-colors duration-300 ${selectedStep === step.id ? 'text-[#B3A269] drop-shadow-[0_0_8px_rgba(179,162,105,0.5)]' : 'text-[#E5E1E6]/50 group-hover:text-[#B3A269]'}`} />
                  </div>
                  <span className={`text-xs sm:text-sm font-barlow-condensed text-center block transition-colors duration-300 ${selectedStep === step.id ? 'text-[#B3A269] font-bold' : 'text-[#E5E1E6]/70 group-hover:text-[#E5E1E6]'}`}>
                    {step.name}
                  </span>
                </motion.div>
              </div>
            ))}
          </div>

          {/* Step Description */}
          <AnimatePresence mode="wait">
            {selectedStep && (
              <motion.div
                key={selectedStep}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="mt-8 bg-[#1a1a1a]/80 backdrop-blur-md p-6 rounded-xl border border-[#B3A269]/20 shadow-2xl"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-[#B3A269]/10 rounded-full">
                    {(() => {
                      const Icon = steps[selectedStep - 1].icon;
                      return <Icon className="w-5 h-5 text-[#B3A269]" />;
                    })()}
                  </div>
                  <h4 className="text-[#B3A269] text-xl font-bold font-dorsa tracking-wide">
                    {steps[selectedStep - 1].name}
                  </h4>
                </div>
                <p className="text-[#E5E1E6]/90 text-base leading-relaxed font-barlow">
                  {steps[selectedStep - 1].description}
                </p>

                {/* Prev/Next Navigation Buttons */}
                <div className="flex justify-between items-center mt-6 pt-4 border-t border-[#B3A269]/10">
                  <button
                    onClick={() => setSelectedStep(selectedStep > 1 ? selectedStep - 1 : steps.length)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-[#E5E1E6]/70 hover:text-[#B3A269] transition-colors group"
                  >
                    <span className="transform group-hover:-translate-x-1 transition-transform">←</span>
                    <span className="hidden sm:inline">{steps[(selectedStep - 2 + steps.length) % steps.length].name}</span>
                    <span className="sm:hidden">Anterior</span>
                  </button>
                  <span className="text-[#B3A269] text-sm font-bold">{selectedStep} / {steps.length}</span>
                  <button
                    onClick={() => setSelectedStep(selectedStep < steps.length ? selectedStep + 1 : 1)}
                    className="flex items-center gap-2 px-4 py-2 text-sm text-[#E5E1E6]/70 hover:text-[#B3A269] transition-colors group"
                  >
                    <span className="hidden sm:inline">{steps[selectedStep % steps.length].name}</span>
                    <span className="sm:hidden">Siguiente</span>
                    <span className="transform group-hover:translate-x-1 transition-transform">→</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Test / Quiz Section */}
          <div ref={testRef} className="mt-16 text-center">
            <AnimatePresence mode="wait">
              {!showTest ? (
                <motion.button
                  key="start-btn"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  whileHover={{ scale: 1.05, boxShadow: "0 0 25px rgba(179,162,105,0.5)" }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowTest(true)}
                  className="px-8 py-4 bg-gradient-to-r from-[#B3A269] to-[#D4C385] text-[#1a1a1a] rounded-full font-bold uppercase tracking-widest text-sm sm:text-base shadow-xl transition-all duration-300 relative overflow-hidden group"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Descubre tu cerveza ideal
                  </span>
                  <div className="absolute inset-0 bg-white/30 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                </motion.button>
              ) : (
                <motion.div
                  key="quiz-container"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 30 }}
                  layout
                  className="bg-[#1a1a1a] border border-[#B3A269]/30 p-6 sm:p-8 rounded-2xl max-w-sm sm:max-w-xl mx-auto shadow-2xl relative overflow-hidden"
                >
                  {/* Progress Bar */}
                  {currentQuestion < questions.length && (
                    <div className="absolute top-0 left-0 w-full h-1 bg-[#333]">
                      <motion.div
                        className="h-full bg-[#B3A269]"
                        initial={{ width: 0 }}
                        animate={{ width: `${((currentQuestion) / questions.length) * 100}%` }}
                        transition={{ duration: 0.5 }}
                      />
                    </div>
                  )}

                  {currentQuestion < questions.length ? (
                    <div className="mt-4">
                      <motion.h4
                        key={`q-${currentQuestion}`}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-[#E5E1E6] text-lg sm:text-xl mb-6 font-bold font-barlow"
                      >
                        {questions[currentQuestion].question}
                      </motion.h4>
                      <div className="grid grid-cols-1 gap-3">
                        {questions[currentQuestion].options.map((option, index) => (
                          <motion.button
                            key={`${currentQuestion}-${index}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            whileHover={{ scale: 1.02, backgroundColor: "rgba(179,162,105,0.15)", borderColor: "rgba(179,162,105,0.5)" }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleAnswer(index)}
                            className="px-6 py-4 bg-[#222223] border border-[#333] text-[#E5E1E6] rounded-xl transition-all duration-300 text-sm sm:text-base text-left flex items-center justify-between group"
                          >
                            <span>{option}</span>
                            <div className="w-4 h-4 rounded-full border border-[#B3A269]/50 group-hover:bg-[#B3A269] transition-colors" />
                          </motion.button>
                        ))}
                      </div>
                      <div className="mt-6 flex justify-between items-center text-xs sm:text-sm text-[#E5E1E6]/50">
                        <span>Pregunta {currentQuestion + 1} de {questions.length}</span>
                        <span className="text-[#B3A269]">Sierra Dorada</span>
                      </div>
                    </div>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-8"
                    >
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="w-12 h-12 border-4 border-[#B3A269] border-t-transparent rounded-full mx-auto mb-4"
                      />
                      <h4 className="text-[#E5E1E6] text-xl font-bold mb-2">¡Analizando tu perfil!</h4>
                      <p className="text-[#B3A269]">Buscando tu tesoro líquido...</p>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrewingProcess;