import { motion } from 'framer-motion';
import BrewingProcess from '../components/BrewingProcess';


const LegendPage = () => {
  return (
    <div className="min-h-screen bg-[#222223] pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-7xl font-bold text-[#E5E1E6] mb-4 font-dorsa">La Leyenda de Sierra Dorada</h1>
          <p className="text-xl text-[#E5E1E6]/80 max-w-3xl mx-auto">
            Una historia que se entrelaza con los mitos y leyendas de El Dorado,
            donde cada cerveza cuenta una parte de nuestra búsqueda por la perfección.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <img
              src="https://images.unsplash.com/photo-1584225064785-c62a8b43d148?ixlib=rb-1.2.1&auto=format&fit=crop&w=1567&q=80"
              alt="Cervecería Sierra Dorada"
              className="rounded-lg shadow-2xl"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-bold text-[#B3A269]">Los Orígenes</h2>
            <p className="text-lg text-[#E5E1E6]">
              Así como los conquistadores buscaban la legendaria ciudad de El Dorado,
              nosotros emprendimos nuestra propia búsqueda de la perfección cervecera.
              Cada receta es un tributo a esa incansable persecución de la excelencia.
            </p>
            <p className="text-lg text-[#E5E1E6]">
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
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-[#2A2A2B] rounded-lg p-12 mb-20"
        >
          <h2 className="text-3xl font-bold text-[#B3A269] mb-6 text-center">
            El Arte de la Elaboración
          </h2>
          <p className="text-lg text-[#E5E1E6] text-center max-w-3xl mx-auto mb-12">
            Descubre el proceso ancestral de elaboración de nuestras cervezas,
            donde cada paso es un ritual que honra las tradiciones cerveceras y
            la búsqueda de la perfección.
          </p>
          <BrewingProcess />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="py-20 text-center"
        >
          <div className="max-w-4xl mx-auto bg-[#2A2A2B]/50 backdrop-blur-sm border border-[#B3A269]/20 rounded-xl p-12">
            <h2 className="text-4xl md:text-5xl font-dorsa text-[#B3A269] mb-6 tracking-wide">EL VIAJE SAGRADO</h2>
            <p className="text-xl text-[#E5E1E6]/80 mb-8 max-w-2xl mx-auto font-barlow">
              Descubre el mito detrás de nuestra creación. Una experiencia inmersiva que conecta la tradición cervecera con la cosmogonía Muisca.
            </p>
            <a
              href="/viaje-sagrado"
              className="inline-flex items-center gap-3 px-8 py-4 bg-[#B3A269] text-[#1a1a1a] rounded-full font-bold text-lg hover:bg-[#E5E1E6] hover:scale-105 transition-all duration-300 shadow-[0_0_20px_rgba(179,162,105,0.3)]"
            >
              INICIAR EL RITUAL
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </a>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          {[
            {
              title: "Tradición",
              description: "Recetas transmitidas a través de generaciones, perfeccionadas con el tiempo."
            },
            {
              title: "Artesanía",
              description: "Cada cerveza es elaborada con dedicación y atención al detalle."
            },
            {
              title: "Excelencia",
              description: "Compromiso inquebrantable con la calidad en cada paso del proceso."
            }
          ].map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="bg-[#2A2A2B] p-8 rounded-lg transform hover:scale-105 transition-transform duration-300"
            >
              <div className="h-12 w-12 bg-[#B3A269]/20 rounded-lg flex items-center justify-center mb-6">
                <span className="text-[#B3A269] text-2xl font-bold">{index + 1}</span>
              </div>
              <h3 className="text-xl font-bold text-[#E5E1E6] mb-4">{section.title}</h3>
              <p className="text-[#E5E1E6]/80">{section.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LegendPage;