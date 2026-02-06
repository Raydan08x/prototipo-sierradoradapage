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
          {/* Dark Background with Optimized Particles for Mobile */}
          <div className="absolute inset-0 block md:hidden bg-[#0a0a0a]">
            {/* Dark Gradient Base */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a] via-[#0a0a0a]/90 to-[#0a0a0a]" />
            {/* Particles ABOVE Gradient - 6 particles, smaller, higher opacity */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={`mobile-particle-${i}`}
                className="absolute bg-[#B3A269] rounded-full z-10"
                style={{
                  width: Math.random() * 3 + 1,
                  height: Math.random() * 3 + 1,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, -60, 0],
                  opacity: [0.2, 0.9, 0.2],
                  scale: [0.8, 1.3, 0.8]
                }}
                transition={{
                  duration: Math.random() * 6 + 6,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: Math.random() * 3
                }}
              />
            ))}
          </div>

          {/* Video for Desktop */}
          <div className="hidden md:block w-full h-full">
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
                  src="/assets/logo-circular.png"
                  alt="Sierra Dorada"
                  className="w-full h-full relative z-20 opacity-90"
                />
              </div>
            </motion.div>

            <motion.h1
              variants={fadeIn}
              className="text-6xl md:text-8xl mb-6 tracking-tight"
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
                className="px-8 py-3 bg-[#B3A269] text-[#222223] rounded-full font-medium hover:bg-[#B3A269]/90 transition-all duration-300 shadow-[0_0_20px_rgba(179,162,105,0.4)]"
              >
                Descubrir Cervezas
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/nuestra-leyenda?openTest=true')}
                className="px-8 py-3 bg-gradient-to-r from-[#8B4513] to-[#B3A269] text-[#E5E1E6] rounded-full font-medium hover:brightness-110 transition-all duration-300 flex items-center gap-2 border border-[#B3A269]/50"
              >
                <Beer className="w-4 h-4" />
                Test de Cerveza
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

        <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent z-20 pointer-events-none" />
      </section>

      {/* Process Section */}
      <section className="py-20 relative overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {/* Dark Background */}
          <div className="absolute inset-0 bg-[#0a0a0a]" />

          {/* Particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`process-particle-${i}`}
              className="absolute bg-[#B3A269] rounded-full z-10"
              style={{
                width: Math.random() * 3 + 1,
                height: Math.random() * 3 + 1,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.2
              }}
              animate={{
                y: [0, -60, 0],
                opacity: [0.2, 0.5, 0.2],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: Math.random() * 6 + 6,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 3
              }}
            />
          ))}
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
                image: "/assets/proceso-produccion.png",
                title: "Arte de la Elaboración",
                description: "Ingredientes locales de la más alta calidad",
                link: "/nuestra-leyenda"
              },
              {
                image: "/assets/viaje-dorado.png",
                title: "Viaje Dorado",
                description: "Técnicas artesanales tradicionales",
                link: "/viaje-sagrado"
              },
              {
                image: "/assets/reserva.png",
                title: "Reserva tu Visita",
                description: "Vive la experiencia Sierra Dorada en persona",
                link: "/servicios"
              }
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10, scale: 1.02 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                className="relative group cursor-pointer"
                onClick={() => navigate(item.link)}
              >
                <div className="aspect-w-16 aspect-h-9 rounded-lg overflow-hidden mb-4 shadow-2xl ring-1 ring-[#B3A269]/20 group-hover:ring-[#B3A269] transition-all duration-500">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-500" />

                  {/* Hover Icon Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div className="w-16 h-16 rounded-full bg-[#B3A269] flex items-center justify-center transform scale-0 group-hover:scale-100 transition-transform duration-500 delay-100">
                      <Beer className="w-8 h-8 text-[#222223]" />
                    </div>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-[#E5E1E6] mb-2 group-hover:text-[#B3A269] transition-colors text-center">{item.title}</h3>
                <p className="text-[#E5E1E6]/80 text-center">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Heritage Section */}
      <section className="py-20 relative overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {/* Particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`heritage-particle-${i}`}
              className="absolute bg-[#B3A269] rounded-full z-10"
              style={{
                width: Math.random() * 3 + 1,
                height: Math.random() * 3 + 1,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.15
              }}
              animate={{
                y: [0, -60, 0],
                opacity: [0.1, 0.3, 0.1],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: Math.random() * 8 + 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 4
              }}
            />
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
            ].map((feature) => (
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
      <section className="py-20 relative overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {/* Particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`features-particle-${i}`}
              className="absolute bg-[#B3A269] rounded-full z-10"
              style={{
                width: Math.random() * 3 + 1,
                height: Math.random() * 3 + 1,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.15
              }}
              animate={{
                y: [0, -60, 0],
                opacity: [0.1, 0.3, 0.1],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: Math.random() * 8 + 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 4
              }}
            />
          ))}
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
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
            ].map((feature) => (
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
      <section className="py-20 relative overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {/* Particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`cta-particle-${i}`}
              className="absolute bg-[#B3A269] rounded-full z-10"
              style={{
                width: Math.random() * 3 + 1,
                height: Math.random() * 3 + 1,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.15
              }}
              animate={{
                y: [0, -60, 0],
                opacity: [0.1, 0.3, 0.1],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: Math.random() * 8 + 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 4
              }}
            />
          ))}
        </div>
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
      <section className="py-20 relative overflow-hidden bg-[#0a0a0a]">
        <div className="absolute inset-0 w-full h-full overflow-hidden">
          {/* Particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={`newsletter-particle-${i}`}
              className="absolute bg-[#B3A269] rounded-full z-10"
              style={{
                width: Math.random() * 3 + 1,
                height: Math.random() * 3 + 1,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                opacity: 0.15
              }}
              animate={{
                y: [0, -60, 0],
                opacity: [0.1, 0.3, 0.1],
                scale: [0.8, 1.2, 0.8]
              }}
              transition={{
                duration: Math.random() * 8 + 8,
                repeat: Infinity,
                ease: "easeInOut",
                delay: Math.random() * 4
              }}
            />
          ))}
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