import React, { useEffect, useRef } from 'react';

const Hero = () => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 0.8;
    }
  }, []);

  return (
    <div className="relative h-screen overflow-hidden">
      <div className="absolute inset-0 w-full h-full">
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover"
          style={{ filter: 'brightness(0.4)' }}
        >
          <source
            src="https://player.vimeo.com/external/492834541.hd.mp4?s=eb7a4f3a2aa9b32a11e17ff86f52c7d0d598d615&profile_id=175"
            type="video/mp4"
          />
        </video>
      </div>

      <div className="relative z-10 h-full flex items-center justify-center">
        <div className="text-center px-4 sm:px-6 lg:px-8">
          <h1 className="animate-title text-5xl md:text-7xl font-bold tracking-tight">
            <span className="block shimmer-title mb-2">Sierra Dorada | Cerveza Artesanal de Alta Calidad</span>
            <span className="block bg-gradient-to-r from-[#B3A269] to-[#E5E1E6] text-transparent bg-clip-text animate-gradient">
              Descubre El Tesoro Cervecero de Zipaquirá
            </span>
          </h1>
          <p className="mt-6 max-w-lg mx-auto text-xl text-[#E5E1E6] opacity-90">
            Inspirados en la mítica leyenda de El Dorado y en la ancestral cultura Muisca, 
            elaboramos cervezas artesanales premium con ingredientes locales como el corozo, 
            el durazno y la miel. En cada botella, entregamos una experiencia única que celebra 
            el sabor, la historia y la autenticidad de nuestra tierra.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => document.getElementById('productos')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 bg-[#B3A269] text-[#222223] rounded-full font-medium hover:bg-[#B3A269]/90 transition-all duration-300 transform hover:scale-105"
            >
              Descubrir Cervezas
            </button>
            <button
              onClick={() => document.getElementById('nuestra-leyenda')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-8 py-3 border-2 border-[#B3A269] text-[#B3A269] rounded-full font-medium hover:bg-[#B3A269] hover:text-[#222223] transition-all duration-300 transform hover:scale-105"
            >
              Nuestra Historia
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#222223] to-transparent" />
    </div>
  );
};

export default Hero;