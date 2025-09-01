import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Beer, Calendar, X, ExternalLink } from 'lucide-react';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

interface RegisterFormData {
  firstName: string;
  lastName: string;
  birthDate: Date | null;
  address: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  gender: 'male' | 'female' | '';
  termsAccepted: boolean;
  newsletterSubscription: boolean;
}

const RegisterForm = () => {
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: '',
    lastName: '',
    birthDate: null,
    address: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    gender: '',
    termsAccepted: false,
    newsletterSubscription: false
  });
  const [showTerms, setShowTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const calculateAge = (birthDate: Date) => {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.birthDate) {
      toast.error('Por favor, ingresa tu fecha de nacimiento');
      return;
    }

    const age = calculateAge(formData.birthDate);
    if (age < 18) {
      toast.error('Debes ser mayor de edad para registrarte');
      return;
    }

    if (!formData.termsAccepted) {
      toast.error('Debes aceptar los términos y condiciones para continuar');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return;
    }

    if (!formData.phone.startsWith('+')) {
      toast.error('El número de teléfono debe incluir el indicativo del país (ej: +57)');
      return;
    }

    setIsLoading(true);

    try {
      const userData = {
        full_name: `${formData.firstName} ${formData.lastName}`,
        gender: formData.gender || null,
        address: formData.address,
        phone: formData.phone,
        birth_date: formData.birthDate.toISOString(),
        terms_accepted: true,
        terms_accepted_at: new Date().toISOString(),
        newsletter_subscription: formData.newsletterSubscription,
        marketing_consent: formData.newsletterSubscription
      };

      await signUp(formData.email, formData.password, userData);
      toast.success('Registro exitoso. Por favor, inicia sesión.');
      navigate('/login');
    } catch (error) {
      toast.error('Error al registrarse. Por favor, intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const TermsModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-h-[80vh] w-full max-w-2xl overflow-y-auto p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4">Términos y Condiciones</h3>
        <div className="prose prose-sm max-w-none">
          <h4>1. Introducción</h4>
          <p>Los presentes términos y condiciones (los "Términos") rigen el uso de los servicios ofrecidos por Sierra Dorada ("nosotros", "nuestro", "la Empresa") a través de su sitio web y aplicaciones.</p>

          <h4>2. Marco Legal</h4>
          <p>De acuerdo con la Ley 1581 de 2012 de Protección de Datos Personales y el Decreto 1377 de 2013 de Colombia, al aceptar estos términos, usted autoriza el tratamiento de sus datos personales.</p>

          <h4>3. Tratamiento de Datos Personales</h4>
          <p>La información personal será utilizada para:</p>
          <ul>
            <li>Verificar su identidad y edad</li>
            <li>Procesar y gestionar pedidos</li>
            <li>Enviar información sobre productos y servicios</li>
            <li>Mejorar nuestros servicios</li>
            <li>Cumplir con obligaciones legales</li>
          </ul>

          <h4>4. Derechos del Titular</h4>
          <p>Conforme a la Ley 1581 de 2012, usted tiene derecho a:</p>
          <ul>
            <li>Conocer, actualizar y rectificar sus datos personales</li>
            <li>Solicitar prueba de la autorización otorgada</li>
            <li>Ser informado sobre el uso de sus datos</li>
            <li>Revocar la autorización y/o solicitar la supresión de datos</li>
            <li>Acceder gratuitamente a sus datos personales</li>
          </ul>

          <h4>5. Seguridad</h4>
          <p>Implementamos medidas de seguridad técnicas y organizativas para proteger sus datos personales.</p>

          <h4>6. Comunicaciones Comerciales</h4>
          <p>Al aceptar recibir comunicaciones comerciales, autoriza el envío de información sobre productos, servicios y promociones.</p>

          <button
            onClick={() => setShowTerms(false)}
            className="mt-6 px-4 py-2 bg-[#B3A269] text-white rounded-lg hover:bg-[#B3A269]/90 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#222223] py-12 px-4 sm:px-6 lg:px-8">
      {showTerms && <TermsModal />}
      <div className="max-w-md w-full space-y-8 bg-[#E5E1E6] p-8 rounded-lg shadow-xl relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-4 right-4 p-2 text-gray-500 hover:text-[#B3A269] transition-colors rounded-full hover:bg-gray-100"
          aria-label="Cerrar"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="text-center">
          <Beer className="mx-auto h-12 w-12 text-[#B3A269]" />
          <h2 className="mt-6 text-3xl font-extrabold text-[#222223]">
            Crear Cuenta
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">
                  Nombre
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#B3A269] focus:border-[#B3A269] focus:z-10 sm:text-sm"
                  placeholder="Nombre"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">
                  Apellidos
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#B3A269] focus:border-[#B3A269] focus:z-10 sm:text-sm"
                  placeholder="Apellidos"
                />
              </div>
            </div>

            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700">
                Fecha de Nacimiento
              </label>
              <div className="relative">
                <DatePicker
                  selected={formData.birthDate}
                  onChange={(date) => setFormData({ ...formData, birthDate: date })}
                  dateFormat="dd/MM/yyyy"
                  showYearDropdown
                  scrollableYearDropdown
                  yearDropdownItemNumber={100}
                  placeholderText="DD/MM/AAAA"
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#B3A269] focus:border-[#B3A269] focus:z-10 sm:text-sm"
                  maxDate={new Date()}
                  required
                />
                <Calendar className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
              </div>
            </div>

            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                Género
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' | '' })}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#B3A269] focus:border-[#B3A269] focus:z-10 sm:text-sm"
              >
                <option value="">Seleccionar género</option>
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
              </select>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Dirección de Residencia
              </label>
              <input
                id="address"
                name="address"
                type="text"
                required
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#B3A269] focus:border-[#B3A269] focus:z-10 sm:text-sm"
                placeholder="Dirección completa"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Correo Electrónico
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#B3A269] focus:border-[#B3A269] focus:z-10 sm:text-sm"
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                Teléfono (con indicativo)
              </label>
              <input
                id="phone"
                name="phone"
                type="tel"
                required
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#B3A269] focus:border-[#B3A269] focus:z-10 sm:text-sm"
                placeholder="+57 300 123 4567"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#B3A269] focus:border-[#B3A269] focus:z-10 sm:text-sm"
                placeholder="Contraseña"
              />
            </div>

            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700">
                Confirmar Contraseña
              </label>
              <input
                id="confirm-password"
                name="confirm-password"
                type="password"
                autoComplete="new-password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#B3A269] focus:border-[#B3A269] focus:z-10 sm:text-sm"
                placeholder="Confirmar Contraseña"
              />
            </div>

            <div className="space-y-4 mt-6">
              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="terms"
                    name="terms"
                    type="checkbox"
                    checked={formData.termsAccepted}
                    onChange={(e) => setFormData({ ...formData, termsAccepted: e.target.checked })}
                    className="h-4 w-4 text-[#B3A269] focus:ring-[#B3A269] border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="terms" className="text-sm text-gray-700">
                    Acepto los{' '}
                    <button
                      type="button"
                      onClick={() => setShowTerms(true)}
                      className="text-[#B3A269] hover:text-[#B3A269]/80 inline-flex items-center"
                    >
                      términos y condiciones
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </button>
                  </label>
                  <p className="text-xs text-gray-500">
                    Al aceptar, reconozco que he leído y entendido la política de tratamiento de datos personales según la Ley 1581 de 2012.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="newsletter"
                    name="newsletter"
                    type="checkbox"
                    checked={formData.newsletterSubscription}
                    onChange={(e) => setFormData({ ...formData, newsletterSubscription: e.target.checked })}
                    className="h-4 w-4 text-[#B3A269] focus:ring-[#B3A269] border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="newsletter" className="text-sm text-gray-700">
                    Deseo recibir información sobre productos, promociones y eventos
                  </label>
                  <p className="text-xs text-gray-500">
                    Puedes cancelar tu suscripción en cualquier momento.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-[#222223] bg-[#B3A269] hover:bg-[#B3A269]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B3A269] transition-colors duration-200"
            >
              {isLoading ? 'Registrando...' : 'Registrarse'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="text-sm text-[#222223] hover:text-[#B3A269] transition-colors"
            >
              ¿Ya tienes una cuenta? Inicia sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;