import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, Beer } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { brain } from '../lib/ai/brain';

interface Message {
  id: string;
  type: 'user' | 'bot';
  text: string;
  options?: string[];
}

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [flowState, setFlowState] = useState<'idle' | 'booking' | 'sommelier'>('idle');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize AI Brain
    if (isOpen) {
      brain.init();
    }

    if (isOpen && messages.length === 0) {
      // Initial greeting
      addBotMessage(
        "¡Hola! 🐻 Soy Bachu, el oso de anteojos y tu guía cervecero. ¿En qué te ayudo hoy?",
        [
          "Recomiéndame una cerveza",
          "Quiero reservar",
          "Ver el menú del Gastrobar",
          "Ubicación"
        ]
      );
    }
  }, [isOpen]);

  const addBotMessage = (text: string, options?: string[]) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'bot',
      text,
      options
    }]);
  };

  const addUserMessage = (text: string) => {
    setMessages(prev => [...prev, {
      id: Date.now().toString(),
      type: 'user',
      text
    }]);
  };

  const handleSend = () => {
    if (!inputValue.trim()) return;

    addUserMessage(inputValue);
    handleUserInput(inputValue);
    setInputValue('');
  };

  const handleOptionClick = (option: string) => {
    addUserMessage(option);
    handleUserInput(option);
  };

  const redirectToWhatsApp = (message: string) => {
    const whatsappMessage = encodeURIComponent(message);
    window.open(`https://wa.me/573138718154?text=${whatsappMessage}`, '_blank');
  };

  const openGoogleMaps = () => {
    window.open('https://www.google.com/maps/search/?api=1&query=5.0361865663151395,-73.99458376574964', '_blank');
  };

  const handleUserInput = (input: string) => {
    const lowerInput = input.toLowerCase();

    // --- FLOW: BOOKING ---
    if (flowState === 'booking') {
      addBotMessage(
        "¡Perfecto! Preparando tu solicitud... 📝",
      );

      const friendlyMessage = `¡Hola amigos de Sierra Dorada! 🍻\n\n` +
        `Quiero agendar una visita desde la Web. 🤖\n\n` +
        `📝 *Mis detalles:* ${input}\n\n` +
        `¡Espero confirmación! 🤘`;

      setTimeout(() => {
        redirectToWhatsApp(friendlyMessage);
        setFlowState('idle');
        addBotMessage("Te he redirigido a WhatsApp para finalizar. ¿Necesitas algo más?", ["Volver al inicio"]);
      }, 1500);
      return;
    }

    // --- FLOW: SOMMELIER ---
    if (flowState === 'sommelier') {
      // Simple logic for Sommelier flow
      if (lowerInput.includes('amargo') || lowerInput.includes('fuerte') || lowerInput.includes('ipa') || lowerInput.includes('intenso')) {
        addBotMessage(
          "Para un paladar valiente como el tuyo, la **India Pale Ale (IPA)** y nuestra **Stout Premium** son ideales. 🦅🔥 Ambas tienen carácter y profundidad. ¿Cuál te llama la atención?",
          ["Ver la IPA", "Ver la Stout", "Volver al menú"]
        );
      } else if (lowerInput.includes('suave') || lowerInput.includes('dulce') || lowerInput.includes('refrescante') || lowerInput.includes('rubia')) {
        addBotMessage(
          "Si buscas algo más relajado, te encantará nuestra **American Pale Ale (Rubia)** o la exótica **Sour con Corozo**. 🍒✨ Son refrescantes y fáciles de beber. ¿Te gustaría probarlas?",
          ["Ver la Rubia", "Ver la Sour", "Volver al menú"]
        );
      } else {
        // Fallback inside sommelier
        addBotMessage(
          "Interesante... Para estar seguro, ¿te gustan más los sabores **cítricos** o **tostados**?",
          ["Cítricos (Fresca)", "Tostados (Café/Cacao)"]
        );
        // Keep state in sommelier, let them answer again
        return;
      }
      setFlowState('idle'); // Reset after recommendation
      return;
    }

    // --- MAIN AI LOGIC ---
    const result = brain.process(input);
    console.log("🐻 Bachu Reasoning:", result);

    // Act on Intent
    switch (result.label) {
      case 'booking.request':
        setFlowState('booking');
        addBotMessage(result.response); // The response asks for details
        break;

      case 'sommelier.start':
        setFlowState('sommelier');
        addBotMessage(result.response, ["Prefiero sabores Fuertes/Amargos", "Prefiero sabores Suaves/Dulces"]);
        break;

      case 'gastrobar.menu':
        addBotMessage(result.response);
        setTimeout(() => {
          window.open('https://toteat.shop/r/co/Sierra-Dorada-Gastrobar/21360/checkin/menu', '_blank');
        }, 1500);
        break;

      case 'gastrobar.info':
        addBotMessage(result.response, ["Ver menú", "Quiero reservar"]);
        break;

      case 'products.list':
        addBotMessage(result.response, ["Recomiéndame una", "Ver precios"]);
        break;

      case 'products.price':
        addBotMessage(result.response, ["Ver catálogo completo"]);
        setTimeout(() => {
          navigate('/productos');
          setIsOpen(false);
        }, 2000);
        break;

      case 'gastrobar.price':
        addBotMessage(result.response, ["Ver Menú Digital"]);
        break;

      case 'company.location':
        addBotMessage("🐻 Estamos en CC Paseo de Gracia, Local 112, Zipaquirá. Te abro la ubicación en Google Maps");
        setTimeout(() => {
          openGoogleMaps();
        }, 1500);
        break;

      case 'contact':
        addBotMessage(result.response, ["Ir a WhatsApp"]);
        break;

      case 'schedule':
        addBotMessage(result.response, ["Quiero reservar", "Ver ubicación"]);
        break;

      case 'about':
        addBotMessage(result.response, ["Ver nuestra historia"]);
        break;

      case 'thanks':
        addBotMessage(result.response);
        break;

      case 'goodbye':
        addBotMessage(result.response);
        break;

      case 'reset':
        addBotMessage(result.response, [
          "Recomiéndame una cerveza",
          "Quiero reservar",
          "Ver el menú del Gastrobar",
          "Ubicación"
        ]);
        break;

      default:
        // Generic response
        addBotMessage(result.response);
    }
  };

  return (
    <>
      {/* Chat button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 p-4 bg-[#B3A269] text-[#222223] rounded-full shadow-lg hover:bg-[#B3A269]/90 transition-colors"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 z-50 w-full max-w-sm bg-[#2A2A2B] rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[500px]"
          >
            {/* Header */}
            <div className="p-4 bg-[#B3A269] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <Beer className="w-6 h-6 text-[#222223]" />
                <div>
                  <h3 className="font-bold text-[#222223] text-sm md:text-base">Bachu 🐻</h3>
                  <div className="flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                    <span className="text-xs text-[#222223]/80">En línea</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-[#222223]/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-[#222223]" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
              {messages.map(message => (
                <div key={message.id}>
                  <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl ${message.type === 'user'
                        ? 'bg-[#B3A269] text-[#222223] rounded-tr-none'
                        : 'bg-[#222223] text-[#E5E1E6] rounded-tl-none border border-[#B3A269]/20'
                        }`}
                    >
                      {message.text}
                    </div>
                  </div>
                  {message.options && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {message.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleOptionClick(option)}
                          className="px-3 py-1.5 text-xs md:text-sm bg-[#222223] text-[#B3A269] border border-[#B3A269] rounded-full hover:bg-[#B3A269] hover:text-[#222223] transition-colors"
                        >
                          {option}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-[#B3A269]/20 bg-[#2A2A2B] shrink-0">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Pregunta algo..."
                  className="flex-1 bg-[#222223] text-[#E5E1E6] p-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#B3A269] border border-[#B3A269]/10 text-sm"
                />
                <button
                  onClick={handleSend}
                  className="p-2.5 bg-[#B3A269] text-[#222223] rounded-xl hover:bg-[#B3A269]/90 transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatBot;