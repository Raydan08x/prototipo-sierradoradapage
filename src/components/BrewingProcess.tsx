import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Cog as Mill, 
  Droplets, 
  Flame, 
  Container as Fermenter, 
  Timer, 
  Filter, 
  Wind as CO2, 
  Beer 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const BrewingProcess = () => {
  const navigate = useNavigate();
  const [showTest, setShowTest] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selectedStep, setSelectedStep] = useState<number | null>(null);

  const steps = [
    { 
      id: 1, 
      name: 'Malta', 
      icon: Mill, 
      color: '#8B4513',
      description: 'Seleccionamos cuidadosamente las mejores maltas según el estilo de cerveza a elaborar. La malta base proporciona los azúcares fermentables, mientras que las maltas especiales aportan color y sabores únicos. Luego, molemos la malta para exponer el endospermo sin dañar la cáscara, lo que es crucial para una maceración eficiente.'
    },
    { 
      id: 2, 
      name: 'Maceración', 
      icon: Droplets, 
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
      icon: Fermenter, 
      color: '#B3A269',
      description: 'Añadimos levadura seleccionada al mosto enfriado. Durante 5-7 días, la levadura convierte los azúcares en alcohol y CO2, creando también compuestos aromáticos característicos. La temperatura de fermentación se controla cuidadosamente según el estilo de cerveza.'
    },
    { 
      id: 5, 
      name: 'Maduración', 
      icon: Timer, 
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
      icon: CO2, 
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
    <div className="py-8 sm:py-12 w-full">
      <div className="w-full sm:max-w-5xl mx-auto px-2 sm:px-4">
        <div className="relative bg-[#222223] p-4 sm:p-8 rounded-lg w-full brewing-process-container">
          <h3 className="text-center text-[#B3A269] text-4xl sm:text-5xl font-dorsa mb-8 sm:mb-12 brewing-process-title">PROCESO CERVECERO</h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 mb-8 brewing-process-grid">
            {steps.slice(0, 4).map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="relative"
                >
                  <button
                    onClick={() => setSelectedStep(selectedStep === step.id ? null : step.id)}
                    className={`w-20 sm:w-24 h-20 sm:h-24 bg-[#2A2A2B] rounded-lg flex items-center justify-center mb-2 transition-all duration-300 ${
                      selectedStep === step.id ? 'ring-2 ring-[#B3A269]' : ''
                    }`}
                  >
                    <div className="absolute top-1 left-1 sm:top-2 sm:left-2 w-5 h-5 sm:w-6 sm:h-6 bg-[#B3A269] rounded-full flex items-center justify-center text-[#222223] text-xs sm:text-sm font-bold">
                      {step.id}
                    </div>
                    <step.icon className="w-6 h-6 sm:w-8 sm:h-8 text-[#B3A269]" />
                  </button>
                  <span className="text-[#B3A269] text-xs sm:text-sm font-barlow-condensed text-center block">
                    {step.name}
                  </span>
                </motion.div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 brewing-process-grid">
            {steps.slice(4).map((step, index) => (
              <div key={step.id} className="flex flex-col items-center">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: (index + 4) * 0.2 }}
                  className="relative"
                >
                  <button
                    onClick={() => setSelectedStep(selectedStep === step.id ? null : step.id)}
                    className={`w-20 sm:w-24 h-20 sm:h-24 bg-[#2A2A2B] rounded-lg flex items-center justify-center mb-2 transition-all duration-300 ${
                      selectedStep === step.id ? 'ring-2 ring-[#B3A269]' : ''
                    }`}
                  >
                    <div className="absolute top-1 left-1 sm:top-2 sm:left-2 w-5 h-5 sm:w-6 sm:h-6 bg-[#B3A269] rounded-full flex items-center justify-center text-[#222223] text-xs sm:text-sm font-bold">
                      {step.id}
                    </div>
                    <step.icon className="w-6 h-6 sm:w-8 sm:h-8 text-[#B3A269]" />
                  </button>
                  <span className="text-[#B3A269] text-xs sm:text-sm font-barlow-condensed text-center block">
                    {step.name}
                  </span>
                </motion.div>
              </div>
            ))}
          </div>

          {/* Step Description */}
          <AnimatePresence>
            {selectedStep && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="mt-6 sm:mt-8 bg-[#2A2A2B] p-4 sm:p-6 rounded-lg"
              >
                <h4 className="text-[#B3A269] text-lg sm:text-xl mb-3 sm:mb-4">
                  {steps[selectedStep - 1].name}
                </h4>
                <p className="text-[#E5E1E6] text-sm sm:text-base leading-relaxed">
                  {steps[selectedStep - 1].description}
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Vertical connection line removed */}

          {/* Test Button */}
          <div className="mt-8 sm:mt-12 text-center">
            {!showTest ? (
              <button
                onClick={() => setShowTest(true)}
                className="px-4 sm:px-6 py-2 bg-[#B3A269] text-[#222223] rounded-full font-medium hover:bg-[#B3A269]/90 transition-colors text-sm sm:text-base"
              >
                Descubre tu cerveza ideal
              </button>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
               className="bg-[#2A2A2B] p-4 sm:p-6 rounded-lg max-w-sm sm:max-w-xl mx-auto"
              >
                {currentQuestion < questions.length ? (
                  <>
                    <h4 className="text-[#E5E1E6] text-base sm:text-lg mb-4 text-center">
                      {questions[currentQuestion].question}
                    </h4>
                   <div className="grid grid-cols-1 gap-3">
                      {questions[currentQuestion].options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleAnswer(index)}
                         className="px-4 py-3 bg-[#222223] text-[#E5E1E6] rounded-lg hover:bg-[#B3A269] hover:text-[#222223] transition-colors text-sm sm:text-base leading-tight text-center min-h-[3rem] flex items-center justify-center"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                   <p className="text-[#B3A269] mt-4 text-center text-sm sm:text-base">
                      Pregunta {currentQuestion + 1} de {questions.length}
                    </p>
                  </>
                ) : (
                  <div className="text-center">
                    <h4 className="text-[#E5E1E6] text-lg sm:text-xl mb-2">¡Analizando tu perfil!</h4>
                    <p className="text-[#B3A269] text-sm sm:text-base">
                      Descubriendo tu cerveza ideal...
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrewingProcess;