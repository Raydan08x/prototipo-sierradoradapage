import React from 'react';

const Legend = () => {
  return (
    <div id="nuestra-leyenda" className="relative bg-[#222223] py-24">
      {/* Patrón decorativo */}
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23B3A269' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-base text-[#B3A269] font-semibold tracking-wide uppercase">
            Nuestra Leyenda
          </h2>
          <p className="mt-2 text-4xl font-extrabold text-[#E5E1E6] sm:text-5xl">
            El Espíritu de El Dorado
          </p>
        </div>

        <div className="mt-20 grid grid-cols-1 gap-16 lg:grid-cols-2 lg:gap-24 items-center">
          <div className="relative">
            <div className="aspect-w-3 aspect-h-4">
              <img
                src="https://images.unsplash.com/photo-1584225064785-c62a8b43d148?ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80"
                alt="Cerveza artesanal Sierra Dorada"
                className="object-cover rounded-lg shadow-2xl"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#B3A269] rounded-full opacity-20" />
          </div>

          <div className="space-y-6 text-[#E5E1E6]">
            <p className="text-lg leading-relaxed">
              Así como los conquistadores buscaban la legendaria ciudad de El Dorado,
              nosotros emprendimos nuestra propia búsqueda de la perfección cervecera.
              Cada receta es un tributo a esa incansable persecución de la excelencia.
            </p>
            <p className="text-lg leading-relaxed">
              En Sierra Dorada, fusionamos técnicas ancestrales con innovación moderna,
              creando cervezas que son verdaderos tesoros líquidos. Nuestros maestros
              cerveceros son los guardianes de esta tradición, transformando ingredientes
              selectos en oro líquido.
            </p>
            <div className="pt-6">
              <div className="flex items-center gap-4">
                <div className="h-1 w-20 bg-[#B3A269]" />
                <span className="text-[#B3A269] font-medium">Desde 2010</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-[#2A2A2B] p-8 rounded-lg transform hover:scale-105 transition-transform duration-300">
            <div className="h-12 w-12 bg-[#B3A269]/20 rounded-lg flex items-center justify-center mb-6">
              <span className="text-[#B3A269] text-2xl font-bold">1</span>
            </div>
            <h3 className="text-xl font-bold text-[#E5E1E6] mb-4">Tradición</h3>
            <p className="text-[#E5E1E6]/80">
              Recetas transmitidas a través de generaciones, perfeccionadas con el tiempo.
            </p>
          </div>
          <div className="bg-[#2A2A2B] p-8 rounded-lg transform hover:scale-105 transition-transform duration-300">
            <div className="h-12 w-12 bg-[#B3A269]/20 rounded-lg flex items-center justify-center mb-6">
              <span className="text-[#B3A269] text-2xl font-bold">2</span>
            </div>
            <h3 className="text-xl font-bold text-[#E5E1E6] mb-4">Artesanía</h3>
            <p className="text-[#E5E1E6]/80">
              Cada cerveza es elaborada con dedicación y atención al detalle.
            </p>
          </div>
          <div className="bg-[#2A2A2B] p-8 rounded-lg transform hover:scale-105 transition-transform duration-300">
            <div className="h-12 w-12 bg-[#B3A269]/20 rounded-lg flex items-center justify-center mb-6">
              <span className="text-[#B3A269] text-2xl font-bold">3</span>
            </div>
            <h3 className="text-xl font-bold text-[#E5E1E6] mb-4">Excelencia</h3>
            <p className="text-[#E5E1E6]/80">
              Compromiso inquebrantable con la calidad en cada paso del proceso.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Legend;