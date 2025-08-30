import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, Send, X, ShoppingCart, Beer, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

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
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen && messages.length === 0) {
      // Initial greeting
      addBotMessage(
        "¡Hola! 👋 Soy Sierra, tu asistente virtual. ¿En qué puedo ayudarte hoy?",
        [
          "Conocer las cervezas",
          "Hacer un pedido",
          "Información de contacto",
          "Visitar la cervecería"
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
    window.open('https://maps.app.goo.gl/6LLNjY8wCXvAMRCr8', '_blank');
  };

  const handleUserInput = (input: string) => {
    const lowerInput = input.toLowerCase();

    // Handle different user inputs
    if (lowerInput.includes('cerveza') || lowerInput.includes('conocer') || lowerInput === "conocer las cervezas") {
      addBotMessage(
        "¡Excelente elección! Tenemos cuatro variedades excepcionales:",
        [
          "American Pale Ale",
          "India Pale Ale",
          "Sour Ale con Corozo",
          "Stout Premium"
        ]
      );
    }
    else if (lowerInput.includes('american pale ale') || lowerInput.includes('dorada imperial')) {
      addBotMessage(
        "Nuestra American Pale Ale es una cerveza de 6.2% ABV y 48.8 IBUs. Con un perfecto balance entre maltas y lúpulos americanos, ofrece notas cítricas y tropicales. ¿Te gustaría hacer un pedido?",
        ["Hacer pedido", "Ver más cervezas", "Contactar vendedor"]
      );
    }
    else if (lowerInput.includes('stout premium') || lowerInput.includes('leyenda negra')) {
      addBotMessage(
        "Nuestra Stout Premium es una cerveza oscura con 6.2% ABV y 49 IBUs. Tiene intensos sabores a café y chocolate negro. ¿Te gustaría hacer un pedido?",
        ["Hacer pedido", "Ver más cervezas", "Contactar vendedor"]
      );
    }
    else if (lowerInput.includes('rubia mítica') || lowerInput.includes('sour')) {
      addBotMessage(
        "Nuestra Sour Ale con Corozo tiene 4.5% ABV y 5 IBUs. Es una cerveza ácida y refrescante con un intenso color rojo carmesí y notas de frutos rojos. ¿Te gustaría hacer un pedido?",
        ["Hacer pedido", "Ver más cervezas", "Contactar vendedor"]
      );
    }
    else if (lowerInput.includes('tesoro rojo') || lowerInput.includes('india pale ale')) {
      addBotMessage(
        "Nuestra India Pale Ale tiene 7.0% ABV y 51 IBUs, con un intenso perfil de lúpulos que evoca el misterio de la noche. ¿Te gustaría hacer un pedido?",
        ["Hacer pedido", "Ver más cervezas", "Contactar vendedor"]
      );
    }
    else if (lowerInput.includes('pedido') || lowerInput.includes('comprar')) {
      addBotMessage(
        "¡Genial! ¿Te gustaría hacer el pedido por WhatsApp o prefieres usar nuestra tienda en línea?",
        ["Comprar por WhatsApp", "Ir a la tienda", "Ver más información"]
      );
    }
    else if (lowerInput.includes('whatsapp')) {
      addBotMessage(
        "Te conectaré con uno de nuestros asesores por WhatsApp para que puedas hacer tu pedido. ¡En un momento te redirigimos!",
      );
      setTimeout(() => {
        redirectToWhatsApp("¡Hola! Me interesa hacer un pedido de cerveza Sierra Dorada. ¿Podrían ayudarme?");
      }, 1500);
    }
    else if (lowerInput.includes('tienda')) {
      addBotMessage(
        "Te llevaré a nuestra tienda en línea donde podrás ver todo nuestro catálogo.",
      );
      setTimeout(() => {
        navigate('/productos');
        setIsOpen(false);
      }, 1500);
    }
    else if (lowerInput.includes('contacto') || lowerInput.includes('información')) {
      addBotMessage(
        "Puedes contactarnos de las siguientes maneras:",
        [
          "Llamar al +57 313 871 8154",
          "Escribir por WhatsApp",
          "Visitar la cervecería"
        ]
      );
    }
    else if (lowerInput.includes('visitar')) {
      addBotMessage(
        "¡Nos encantaría recibirte en nuestra cervecería! Ofrecemos tours guiados y catas. ¿Te gustaría agendar una visita?",
        ["Agendar visita por WhatsApp", "Ver ubicación", "Más información"]
      );
    }
    else if (lowerInput.includes('ubicación') || lowerInput.includes('mapa')) {
      addBotMessage(
        "Estamos ubicados en Zipaquirá, Colombia. Puedes encontrarnos fácilmente:",
        ["Ver en Google Maps", "Recibir ubicación por WhatsApp", "Volver al menú"]
      );
    }
    else if (lowerInput.includes('google maps')) {
      addBotMessage(
        "¡Perfecto! Te abriré Google Maps para que puedas ver nuestra ubicación exacta.",
      );
      setTimeout(() => {
        openGoogleMaps();
      }, 1000);
    }
    else if (lowerInput.includes('recibir ubicación')) {
      addBotMessage(
        "Te enviaré la ubicación por WhatsApp.",
      );
      setTimeout(() => {
        redirectToWhatsApp("¡Hola! Me gustaría recibir la ubicación de la cervecería Sierra Dorada.");
      }, 1000);
    }
    else {
      addBotMessage(
        "¿En qué más puedo ayudarte?",
        [
          "Conocer las cervezas",
          "Hacer un pedido",
          "Información de contacto",
          "Visitar la cervecería"
        ]
      );
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
            className="fixed bottom-24 right-6 z-50 w-full max-w-sm bg-[#2A2A2B] rounded-lg shadow-xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-4 bg-[#B3A269] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Beer className="w-6 h-6 text-[#222223]" />
                <span className="font-medium text-[#222223]">Sierra - Asistente Virtual</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 hover:bg-[#222223]/10 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-[#222223]" />
              </button>
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4">
              {messages.map(message => (
                <div key={message.id}>
                  <div className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === 'user'
                          ? 'bg-[#B3A269] text-[#222223]'
                          : 'bg-[#222223] text-[#E5E1E6]'
                      }`}
                    >
                      {message.text}
                    </div>
                  </div>
                  {message.options && (
                    <div className="mt-2 space-y-2">
                      {message.options.map((option, index) => (
                        <button
                          key={index}
                          onClick={() => handleOptionClick(option)}
                          className="block w-full text-left px-4 py-2 text-[#E5E1E6] hover:bg-[#222223] rounded-lg transition-colors"
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
            <div className="p-4 border-t border-[#B3A269]/20">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Escribe tu mensaje..."
                  className="flex-1 bg-[#222223] text-[#E5E1E6] p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B3A269]"
                />
                <button
                  onClick={handleSend}
                  className="p-2 bg-[#B3A269] text-[#222223] rounded-lg hover:bg-[#B3A269]/90 transition-colors"
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