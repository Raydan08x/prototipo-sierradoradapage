import React from 'react';
import { Facebook, Instagram, Phone, Mail, Linkedin, Video, MessageCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="bg-[#222223]">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-8">
            <img 
              src="/assets/logo-white.svg" 
              alt="Sierra Dorada" 
              className="h-12 w-auto"
            />
            <p className="text-[#E5E1E6]">
              Cervecería artesanal comprometida con la calidad y la tradición cervecera desde 2010.
            </p>
          </div>
          
          <div>
            <h3 className="text-[#B3A269] text-lg font-bold mb-4">Enlaces Rápidos</h3>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => navigate('/')} 
                  className="text-[#E5E1E6] hover:text-[#B3A269] transition-colors"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/productos')} 
                  className="text-[#E5E1E6] hover:text-[#B3A269] transition-colors"
                >
                  Productos
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/nuestra-leyenda')} 
                  className="text-[#E5E1E6] hover:text-[#B3A269] transition-colors"
                >
                  Nuestra Leyenda
                </button>
              </li>
              <li>
                <button 
                  onClick={() => navigate('/contacto')} 
                  className="text-[#E5E1E6] hover:text-[#B3A269] transition-colors"
                >
                  Contacto
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-[#B3A269] text-lg font-bold mb-4">Contacto</h3>
            <ul className="space-y-4 text-[#E5E1E6]">
              <li className="flex items-center">
                <Phone className="h-5 w-5 mr-2 text-[#B3A269]" />
                <a 
                  href="tel:+573138718154"
                  className="hover:text-[#B3A269] transition-colors"
                >
                  +57 313 871 8154
                </a>
              </li>
              <li className="flex items-center">
                <Mail className="h-5 w-5 mr-2 text-[#B3A269]" />
                <a 
                  href="mailto:contacto@sierradorada.co"
                  className="hover:text-[#B3A269] transition-colors"
                >
                  contacto@sierradorada.co
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media Links - Centered */}
        <div className="flex justify-center mt-8 mb-8">
          <div className="flex space-x-6">
            <a 
              href="https://www.facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#E5E1E6] hover:text-[#B3A269] transition-colors"
            >
              <Facebook className="h-6 w-6" />
            </a>
            <a 
              href="https://www.instagram.com/sierra.dorada" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#E5E1E6] hover:text-[#B3A269] transition-colors"
            >
              <Instagram className="h-6 w-6" />
            </a>
            <a 
              href="https://www.tiktok.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#E5E1E6] hover:text-[#B3A269] transition-colors"
            >
              <Video className="h-6 w-6" />
            </a>
            <a 
              href="https://www.linkedin.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#E5E1E6] hover:text-[#B3A269] transition-colors"
            >
              <Linkedin className="h-6 w-6" />
            </a>
            <a 
              href="https://wa.me/573138718154" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#E5E1E6] hover:text-[#B3A269] transition-colors"
            >
              <MessageCircle className="h-6 w-6" />
            </a>
          </div>
        </div>
        
        <div className="border-t border-[#B3A269] pt-8">
          <p className="text-center text-[#E5E1E6]">
            © {new Date().getFullYear()} Sierra Dorada. Todos los derechos reservados.
          </p>
          <p className="text-center text-[#E5E1E6] text-sm mt-2">
            EL EXCESO DE ALCOHOL ES PERJUDICIAL PARA LA SALUD. PROHÍBASE EL EXPENDIO DE BEBIDAS EMBRIAGANTES A MENORES DE EDAD.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;