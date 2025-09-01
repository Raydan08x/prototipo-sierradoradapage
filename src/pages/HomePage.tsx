import React, { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Beer, Award, Users, Mountain, Leaf, Sun, Mail, ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const HomePage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const { scrollYProgress } = useScroll();
  
  const backgroundOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);

  const backgroundVideos = [
    "https://player.vimeo.com/progressive_redirect/playback/688518575/rendition/720p/file.mp4?loc=external&oauth2_token_id=1747418641&signature=e0359b9fd0f20ae9e45d8a562552eaefb3f0c0e122daa19577cca8fedf6b6950",
    "https://player.vimeo.com/progressive_redirect/playback/688498340/rendition/720p/file.mp4?loc=external&oauth2_token_id=1747418641&signature=0c96ec8c0c27d5907dc567ed0f7bdcecdc19046416863b2f27e7eca1eef309f3",
    "https://player.vimeo.com/progressive_redirect/playback/690227434/rendition/720p/file.mp4?loc=external&oauth2_token_id=1747418641&signature=df6e89e21795d9f8ec31733d648e28c7c0b5c26c8641be5e5b55e48f0e523d7f"
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentVideoIndex((prev) => (prev + 1) % backgroundVideos.length);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('¡Gracias por suscribirte!');
      setEmail('');
    } catch (error) {
      toast.error('Error al suscribirse. Por favor, intenta de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen">
        {/* Background Videos */}
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {backgroundVideos.map((video, index) => (
            <motion.div
              key={video}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: index === currentVideoIndex ? 1 : 0 }}
              transition={{ duration: 1 }}
              style={{ opacity: backgroundOpacity }}
            >
              <video
                autoPlay
                loop
                muted
                playsInline
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 min-w-full min-h-full w-auto h-auto object-cover"
                style={{ filter: 'brightness(0.4)' }}
              >
                <source src={video} type="video/mp4" />
              </video>
            </motion.div>
          ))}
        </div>

        {/* Overlay Content */}
        <div className="relative z-10 h-full flex items-center justify-center text-center px-4">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="max-w-4xl mx-auto"
          >
            <motion.div variants={fadeIn} className="flex justify-center mb-8">
              <div className="relative w-24 h-24">
                <div className="absolute inset-0 bg-[#B3A269] rounded-full opacity-20 animate-pulse"></div>
                <img
                  src="/assets/isotipo-color.svg"
                  alt="Sierra Dorada"
                  className="w-full h-full relative z-10"
                />
              </div>
            </motion.div>

            <motion.h1
              variants={fadeIn}
              className="text-6xl md:text-8xl font-bold mb-6 tracking-tight"
            >
              <span className="block text-[#E5E1E6] font-dorsa">Sierra Dorada</span>
              <span className="block bg-gradient-to-r from-[#B3A269] to-[#E5E1E6] text-transparent bg-clip-text font-dorsa">
                El Tesoro del Dorado
              </span>
            </motion.h1>
            
            <motion.p
              variants={fadeIn}
              className="mt-6 text-xl md:text-2xl text-[#E5E1E6] opacity-90 font-barlow"
            >
              Inspirados en la legendaria búsqueda de El Dorado y la rica cultura Muisca,
              transformamos los tesoros de nuestra tierra en experiencias cerveceras únicas.
            </motion.p>

            <motion.div
              variants={fadeIn}
              className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
            >
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/productos')}
                className="px-8 py-3 bg-[#B3A269] text-[#222223] rounded-full font-medium hover:bg-[#B3A269]/90 transition-all duration-300"
              >
                Descubrir Cervezas
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/nuestra-leyenda')}
                className="px-8 py-3 border-2 border-[#B3A269] text-[#B3A269] rounded-full font-medium hover:bg-[#B3A269] hover:text-[#222223] transition-all duration-300"
              >
                Nuestra Historia
              </motion.button>
            </motion.div>
          </motion.div>
        </div>

        {/* Animated Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0, y: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10"
        >
          <div className="w-6 h-10 border-2 border-[#B3A269] rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              className="w-2 h-2 bg-[#B3A269] rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* Process Section */}
      <section className="py-20 glass-effect relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1559526324-593bc073d938?auto=format&fit=crop&w=2000&q=80"
            alt="Brewing Process"
            className="w-full h-full object-cover opacity-10"
          />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#E5E1E6] mb-4 font-dorsa">
              El Arte de la Cerveza Artesanal
            </h2>
            <p className="text-xl text-[#E5E1E6]/80 max-w-3xl mx-auto">
              Descubre el proceso meticuloso detrás de cada cerveza Sierra Dorada
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=800&q=80",
                title: "Selección de Ingredientes",
                description: "Ingredientes locales de la más alta calidad"
              },
              {
                image: "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=800&q=80",
                title: "Proceso de Elaboración",
                description: "Técnicas artesanales tradicionales"
              },
              {
                image: "https://images.unsplash.com/photo-1584225064785-c62a8b43d148?auto=format&fit=crop&w=800&q=80",
                title: "Resultado Final",
                description: "Cervezas únicas y llenas de carácter"
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative group"
              >
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-4">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h3 className="text-xl font-bold text-[#E5E1E6] mb-2">{item.title}</h3>
                <p className="text-[#E5E1E6]/80">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Heritage Section */}
      <section className="py-20 glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            variants={staggerContainer}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Mountain,
                title: "Región Andina",
                description: "Nuestro oso de anteojos, símbolo de la majestuosidad de los Andes colombianos, donde nace nuestra historia."
              },
              {
                icon: Sun,
                title: "Legado Muisca",
                description: "El sol dorado en nuestro logo rinde homenaje a la rica cultura Muisca y la leyenda de El Dorado."
              },
              {
                icon: Leaf,
                title: "Sabores Locales",
                description: "Incorporamos frutos nativos como el corozo en nuestras recetas, celebrando la biodiversidad colombiana."
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={fadeIn}
                className="bg-[#222223]/50 p-8 rounded-lg backdrop-blur-sm border border-[#B3A269]/10 hover:border-[#B3A269]/30 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-[#B3A269]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-[#B3A269]" />
                </div>
                <h3 className="text-xl font-bold text-[#E5E1E6] mb-4 text-center">{feature.title}</h3>
                <p className="text-[#E5E1E6]/80 text-center">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 glass-effect">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="initial"
            whileInView="animate"
            variants={staggerContainer}
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Beer,
                title: "Artesanía Cervecera",
                description: "Elaboramos nuestras cervezas con ingredientes locales y técnicas tradicionales."
              },
              {
                icon: Award,
                title: "Calidad Premium",
                description: "Nuestro compromiso con la excelencia nos ha valido reconocimientos internacionales."
              },
              {
                icon: Users,
                title: "Experiencia Única",
                description: "Ofrecemos visitas guiadas, catas y eventos especiales para los amantes de la cerveza."
              }
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={fadeIn}
                className="bg-[#222223]/50 p-8 rounded-lg backdrop-blur-sm border border-[#B3A269]/10 hover:border-[#B3A269]/30 transition-all duration-300"
              >
                <div className="w-16 h-16 bg-[#B3A269]/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <feature.icon className="w-8 h-8 text-[#B3A269]" />
                </div>
                <h3 className="text-xl font-bold text-[#E5E1E6] mb-4 text-center">{feature.title}</h3>
                <p className="text-[#E5E1E6]/80 text-center">{feature.description}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#222223]/90 backdrop-blur-sm" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-[#E5E1E6] mb-6 font-dorsa">
              Descubre el Tesoro de los Andes
            </h2>
            <p className="text-xl text-[#E5E1E6]/80 mb-8 max-w-2xl mx-auto">
              Únete a nuestra búsqueda por la cerveza perfecta, donde cada sorbo es un 
              tributo a la leyenda de El Dorado y los sabores de nuestra tierra.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/servicios')}
              className="px-8 py-3 bg-[#B3A269] text-[#222223] rounded-full font-medium hover:bg-[#B3A269]/90 transition-all duration-300"
            >
              Explorar Servicios
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 relative overflow-hidden glass-effect">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#222223] via-transparent to-[#222223]" />
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-2xl mx-auto text-center"
          >
            <div className="inline-block p-3 bg-[#B3A269]/20 rounded-full mb-6">
              <Mail className="w-6 h-6 text-[#B3A269]" />
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-[#E5E1E6] mb-4 font-dorsa">
              Únete a la Leyenda
            </h2>
            
            <p className="text-xl text-[#E5E1E6]/80 mb-8">
              Suscríbete para recibir noticias, eventos exclusivos y ofertas especiales 
              de Sierra Dorada directamente en tu bandeja de entrada.
            </p>

            <form onSubmit={handleNewsletterSubmit} className="relative max-w-md mx-auto">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu correo electrónico"
                className="w-full px-6 py-4 bg-[#222223] text-[#E5E1E6] rounded-full focus:outline-none focus:ring-2 focus:ring-[#B3A269] pr-36"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                disabled={isSubmitting}
                className="absolute right-2 top-2 px-6 py-2 bg-[#B3A269] text-[#222223] rounded-full font-medium hover:bg-[#B3A269]/90 transition-all duration-300 flex items-center gap-2"
              >
                {isSubmitting ? (
                  'Suscribiendo...'
                ) : (
                  <>
                    Suscribirse
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </motion.button>
            </form>

            <p className="mt-4 text-sm text-[#E5E1E6]/60">
              Al suscribirte, aceptas recibir correos electrónicos de marketing de Sierra Dorada.
              Puedes darte de baja en cualquier momento.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;