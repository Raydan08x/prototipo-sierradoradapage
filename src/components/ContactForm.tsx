import React, { useState } from 'react';
import { Phone, Mail, Send, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface ContactFormProps {
  service: string;
  onSubmit: () => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ service, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    businessType: '',
    productFormat: [],
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
      `Hola, estoy interesado en el servicio de ${service}.\n` +
      `Nombre: ${formData.name}\n` +
      `Tipo de negocio: ${formData.businessType}\n` +
      `Formatos de interés: ${formData.productFormat.join(', ')}`
    );
    window.open(`https://wa.me/573138718154?text=${whatsappMessage}`, '_blank');
    
    onSubmit();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-[#2A2A2B] rounded-lg max-w-md w-full p-6 relative">
        <button
          onClick={onSubmit}
          className="absolute top-4 right-4 text-[#E5E1E6] hover:text-[#B3A269] transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <h3 className="font-dorsa text-3xl text-[#E5E1E6] mb-4">Solicitar Información</h3>
        {service && (
          <p className="font-barlow text-[#B3A269] mb-4">
            Servicio seleccionado: {service}
          </p>
        )}
        <p className="font-barlow text-[#E5E1E6]/80 mb-6">
          Completa el formulario y nos pondremos en contacto contigo.
        </p>

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

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="flex-1 bg-[#B3A269] text-[#222223] py-3 rounded-lg font-barlow-condensed font-medium hover:bg-[#B3A269]/90 transition-colors flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              Enviar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ContactForm;