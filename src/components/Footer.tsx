
import { Facebook, Instagram, Phone, Mail, Linkedin, Video, MessageCircle, Lock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer>
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {/* Logo y descripción - centrado */}
          <div className="space-y-4 flex flex-col items-center">
            <img
              src="/assets/logo-vertical.png"
              alt="Sierra Dorada"
              className="h-24 w-auto"
            />
            <p className="text-[#E5E1E6] text-sm max-w-xs">
              Cervecería artesanal comprometida con la calidad y la tradición cervecera desde 2010.
            </p>
          </div>

          {/* Enlaces Rápidos - centrado */}
          <div className="flex flex-col items-center">
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

          {/* Contacto - centrado */}
          <div className="flex flex-col items-center">
            <h3 className="text-[#B3A269] text-lg font-bold mb-4">Contacto</h3>
            <ul className="space-y-4 text-[#E5E1E6]">
              <li className="flex items-start justify-center">
                <MapPin className="h-5 w-5 mr-2 text-[#B3A269] mt-1 shrink-0" />
                <a
                  href="https://www.google.com/maps/search/?api=1&query=5.0361865663151395,-73.99458376574964"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-[#B3A269] transition-colors text-sm leading-relaxed text-left"
                >
                  Calle 26#12-63 Local 112 <br />
                  CC Paseo de Gracia, Prados del Mirador, <br />
                  Zipaquirá, Cundinamarca.
                </a>
              </li>
              <li className="flex items-center justify-center">
                <Phone className="h-5 w-5 mr-2 text-[#B3A269]" />
                <a
                  href="tel:+573138718154"
                  className="hover:text-[#B3A269] transition-colors"
                >
                  +57 313 871 8154
                </a>
              </li>
              <li className="flex items-center justify-center">
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

        {/* Institutional Logos - Fondo Emprender Section */}
        <div className="flex flex-col items-center mt-8 mb-8 pt-8 border-t border-[#B3A269]/30">
          <p className="text-[#B3A269] text-sm font-semibold mb-4">Proyecto avalado por</p>
          <div className="flex flex-wrap justify-center items-center gap-8">
            <img
              src="/assets/sena-fe-png.webp"
              alt="SENA - Fondo Emprender"
              className="h-12 md:h-16 w-auto object-contain"
            />
            <img
              src="/assets/logo-presidencia.png"
              alt="Presidencia de la República de Colombia"
              className="h-12 md:h-16 w-auto object-contain"
            />
          </div>
          <p className="text-[#E5E1E6]/60 text-xs mt-4 text-center max-w-md">
            Proyecto financiado por Fondo Emprender del SENA
          </p>
        </div>

        <div className="border-t border-[#B3A269] pt-8 flex flex-col md:flex-row justify-between items-center relative">
          <div className="w-full text-center">
            <p className="text-[#E5E1E6]">
              © {new Date().getFullYear()} Sierra Dorada. Todos los derechos reservados.
            </p>
            <p className="text-[#E5E1E6] text-sm mt-2">
              EL EXCESO DE ALCOHOL ES PERJUDICIAL PARA LA SALUD. PROHÍBASE EL EXPENDIO DE BEBIDAS EMBRIAGANTES A MENORES DE EDAD.
            </p>
          </div>
          {/* Hidden Admin Entry */}
          <button
            onClick={() => navigate('/login')}
            className="absolute right-0 bottom-0 p-2 text-[#222223] hover:text-[#B3A269]/20 transition-colors"
            aria-label="Admin Access"
          >
            <Lock className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;