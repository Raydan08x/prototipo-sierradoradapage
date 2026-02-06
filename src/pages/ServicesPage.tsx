import { motion } from 'framer-motion';
import { GraduationCap, Beer, PartyPopper, Store } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import BookingForm from '../components/reservations/BookingForm';

const ServicesPage = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: GraduationCap,
      title: "Capacitaciones de Maridaje",
      description: "Aprende a combinar nuestras cervezas con diferentes platillos para crear experiencias gastronómicas únicas.",
      features: [
        "Sesiones personalizadas",
        "Material didáctico",
        "Degustación guiada",
        "Certificado de participación"
      ]
    },
    {
      icon: Beer,
      title: "Cervezas Personalizadas",
      description: "Creamos cervezas exclusivas para tu restaurante o establecimiento, adaptadas a tu concepto y clientela.",
      features: [
        "Desarrollo de recetas únicas",
        "Etiquetado personalizado",
        "Asesoría continua",
        "Producción a medida"
      ]
    },
    {
      icon: PartyPopper,
      title: "Eventos Especiales",
      description: "Hacemos de tu evento una experiencia única con nuestras cervezas artesanales y servicios especializados.",
      features: [
        "Bodas y celebraciones",
        "Eventos corporativos",
        "Festivales de cerveza",
        "Catas privadas"
      ]
    },
    {
      icon: Store,
      title: "Asesoría para Negocios",
      description: "Te ayudamos a optimizar tu oferta de cervezas artesanales y a capacitar a tu personal.",
      features: [
        "Selección de productos",
        "Capacitación de personal",
        "Gestión de inventario",
        "Estrategias de venta"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#222223] pt-28">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="font-dorsa text-7xl text-[#E5E1E6] mb-4">Nuestros Servicios</h1>
          <p className="font-barlow text-xl text-[#E5E1E6]/80 max-w-3xl mx-auto">
            Descubre todo lo que Sierra Dorada puede hacer por ti y tu negocio.
            Desde capacitaciones hasta eventos especiales, estamos aquí para crear
            experiencias únicas en torno a la cerveza artesanal.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-[#2A2A2B] rounded-lg p-8 hover:bg-[#2A2A2B]/80 transition-colors"
            >
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-[#B3A269]/20 rounded-lg flex items-center justify-center mr-4">
                  <service.icon className="w-6 h-6 text-[#B3A269]" />
                </div>
                <h2 className="font-dorsa text-3xl text-[#E5E1E6]">{service.title}</h2>
              </div>

              <p className="font-barlow text-[#E5E1E6]/80 mb-6">{service.description}</p>

              <ul className="space-y-3">
                {service.features.map((feature, index) => (
                  <li key={index} className="flex items-center font-barlow text-[#E5E1E6]">
                    <span className="w-2 h-2 bg-[#B3A269] rounded-full mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => navigate('/contacto')}
                className="mt-8 w-full px-6 py-3 bg-[#B3A269] text-[#222223] rounded-full font-barlow-condensed font-medium hover:bg-[#B3A269]/90 transition-colors"
              >
                Solicitar Información
              </button>
            </motion.div>
          ))}
        </div>

        {/* Booking Section */}
        <section className="mt-24 pt-16 border-t border-[#B3A269]/20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            <div className="text-center mb-12">
              <h2 className="font-dorsa text-6xl text-[#E5E1E6] mb-4">Reserva tu Visita</h2>
              <p className="font-barlow text-xl text-[#E5E1E6]/80">
                Ven y vive la experiencia Sierra Dorada. Recorridos guiados todos los fines de semana.
              </p>
            </div>
            <BookingForm />
          </motion.div>
        </section>
      </div>
    </div>
  );
};

export default ServicesPage;