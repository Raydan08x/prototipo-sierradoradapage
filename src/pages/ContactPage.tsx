import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Phone, Mail, MapPin, Clock, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessType: '',
    serviceType: '',
    productFormat: [] as string[],
    message: ''
  });

  const businessTypes = [
    'Bar',
    'Restaurante',
    'Hotel',
    'Tienda especializada',
    'Distribuidor',
    'Otro'
  ];

  const serviceTypes = [
    'Capacitaciones de Maridaje',
    'Cervezas Personalizadas',
    'Eventos Especiales',
    'Asesoría para Negocios',
    'Ser Distribuidor'
  ];

  const productFormats = [
    '4-pack',
    'Botellas individuales',
    'Barriles',
    'Cajas (24 unidades)'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Here you would typically send the data to your backend
    console.log('Form submitted:', formData);
    
    // Show success message
    toast.success('Formulario enviado correctamente');
    
    // Redirect to WhatsApp
    const whatsappMessage = encodeURIComponent(
      `Hola, estoy interesado en contactarme con Sierra Dorada.\n` +
      `Nombre: ${formData.name}\n` +
      `Tipo de negocio: ${formData.businessType}\n` +
      `Servicio de interés: ${formData.serviceType}\n` +
      `Formatos de interés: ${formData.productFormat.join(', ')}`
    );
    window.open(`https://wa.me/573138718154?text=${whatsappMessage}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-[#222223] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="font-dorsa text-7xl text-[#E5E1E6] mb-4">Contáctanos</h1>
          <p className="font-barlow text-xl text-[#E5E1E6]/80 max-w-3xl mx-auto">
            Estamos aquí para responder tus preguntas y ayudarte a descubrir el mundo de la cerveza artesanal.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-8"
          >
            <div>
              <h2 className="font-dorsa text-4xl text-[#B3A269] mb-6">Información de Contacto</h2>
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#B3A269]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-[#B3A269]" />
                  </div>
                  <div>
                    <h3 className="font-barlow-condensed text-xl text-[#E5E1E6] mb-2">Teléfono</h3>
                    <a 
                      href="tel:+573138718154"
                      className="font-barlow text-[#E5E1E6]/80 hover:text-[#B3A269] transition-colors"
                    >
                      +57 313 871 8154
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#B3A269]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-[#B3A269]" />
                  </div>
                  <div>
                    <h3 className="font-barlow-condensed text-xl text-[#E5E1E6] mb-2">Correo Electrónico</h3>
                    <a 
                      href="mailto:contacto@sierradorada.co"
                      className="font-barlow text-[#E5E1E6]/80 hover:text-[#B3A269] transition-colors"
                    >
                      contacto@sierradorada.co
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#B3A269]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-[#B3A269]" />
                  </div>
                  <div>
                    <h3 className="font-barlow-condensed text-xl text-[#E5E1E6] mb-2">Ubicación</h3>
                    <p className="font-barlow text-[#E5E1E6]/80">
                      Calle Principal 123<br />
                      Ciudad, País
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-[#B3A269]/20 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-[#B3A269]" />
                  </div>
                  <div>
                    <h3 className="font-barlow-condensed text-xl text-[#E5E1E6] mb-2">Horario</h3>
                    <p className="font-barlow text-[#E5E1E6]/80">
                      Lunes a Viernes: 9:00 AM - 6:00 PM<br />
                      Sábados: 10:00 AM - 3:00 PM
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="bg-[#2A2A2B] rounded-lg p-8"
          >
            <h2 className="font-dorsa text-4xl text-[#B3A269] mb-6">Envíanos un Mensaje</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="name" className="font-barlow-condensed text-[#E5E1E6] block mb-1">
                  Nombre completo
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  className="w-full bg-[#222223] text-[#E5E1E6] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B3A269]"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="businessType" className="font-barlow-condensed text-[#E5E1E6] block mb-1">
                  Tipo de negocio
                </label>
                <select
                  id="businessType"
                  required
                  className="w-full bg-[#222223] text-[#E5E1E6] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B3A269]"
                  value={formData.businessType}
                  onChange={(e) => setFormData({ ...formData, businessType: e.target.value })}
                >
                  <option value="">Selecciona una opción</option>
                  {businessTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="serviceType" className="font-barlow-condensed text-[#E5E1E6] block mb-1">
                  Servicio de interés
                </label>
                <select
                  id="serviceType"
                  required
                  className="w-full bg-[#222223] text-[#E5E1E6] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B3A269]"
                  value={formData.serviceType}
                  onChange={(e) => setFormData({ ...formData, serviceType: e.target.value })}
                >
                  <option value="">Selecciona un servicio</option>
                  {serviceTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-barlow-condensed text-[#E5E1E6] block mb-1">
                  Formatos de interés
                </label>
                <div className="space-y-2">
                  {productFormats.map((format) => (
                    <label key={format} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value={format}
                        checked={formData.productFormat.includes(format)}
                        onChange={(e) => {
                          const newFormats = e.target.checked
                            ? [...formData.productFormat, format]
                            : formData.productFormat.filter(f => f !== format);
                          setFormData({ ...formData, productFormat: newFormats });
                        }}
                        className="form-checkbox text-[#B3A269] rounded border-[#B3A269]"
                      />
                      <span className="text-[#E5E1E6]">{format}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="font-barlow-condensed text-[#E5E1E6] block mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  className="w-full bg-[#222223] text-[#E5E1E6] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B3A269]"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="phone" className="font-barlow-condensed text-[#E5E1E6] block mb-1">
                  Teléfono
                </label>
                <input
                  type="tel"
                  id="phone"
                  required
                  className="w-full bg-[#222223] text-[#E5E1E6] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B3A269]"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="message" className="font-barlow-condensed text-[#E5E1E6] block mb-1">
                  Mensaje adicional
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full bg-[#222223] text-[#E5E1E6] p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#B3A269]"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#B3A269] text-[#222223] py-3 rounded-lg font-barlow-condensed font-medium hover:bg-[#B3A269]/90 transition-colors flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                Enviar
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;