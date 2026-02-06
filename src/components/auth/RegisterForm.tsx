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
  dataConsent: boolean;
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
    dataConsent: false,
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

    if (!formData.dataConsent) {
      toast.error('Debes autorizar el tratamiento de datos personales');
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
        data_processing_consent: true,
        terms_accepted_at: new Date().toISOString(),
        newsletter_subscription: formData.newsletterSubscription,
        marketing_consent: formData.newsletterSubscription
      };

      await signUp(formData.email, formData.password, userData);

      // Verify logic: Redirect to Verification Page
      toast.success('¡Cuenta creada! Verifica tu correo.');
      navigate('/verificar', { state: { email: formData.email } });

    } catch (error: any) {
      // Check for specific error messages from backend
      if (error.message?.includes('ya existe')) {
        toast.error('El usuario ya existe. Intenta iniciar sesión.');
      } else {
        toast.error('Error al registrarse. Por favor, intenta de nuevo.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const TermsModal = () => (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg max-h-[80vh] w-full max-w-2xl overflow-y-auto p-8 shadow-2xl relative">
        <button
          onClick={() => setShowTerms(false)}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-[#222223]"
        >
          <X className="w-6 h-6" />
        </button>

        <h3 className="text-2xl font-bold text-[#222223] mb-6 border-b pb-2 border-[#B3A269]">
          Términos y Condiciones y Política de Privacidad
        </h3>

        <div className="prose prose-sm text-gray-700 space-y-4">
          <h4 className="text-lg font-bold text-[#222223]">1. Aceptación de los Términos</h4>
          <p>
            Al registrarse y acceder a la plataforma de <strong>Sierra Dorada</strong>, usted confirma que ha leído, entendido y aceptado los presentes Términos y Condiciones. Asimismo, declara ser mayor de edad (18 años o más) de acuerdo con la legislación colombiana y la de su lugar de residencia. El consumo de alcohol por menores de edad está prohibido.
          </p>

          <h4 className="text-lg font-bold text-[#222223]">2. Política de Tratamiento de Datos Personales (Ley 1581 de 2012)</h4>
          <p>
            En cumplimiento de la <strong>Ley 1581 de 2012</strong> y el Decreto 1377 de 2013, <strong>Sierra Dorada</strong> informa que es responsable del tratamiento de sus datos personales. Al marcar la casilla "Autorizo el tratamiento de mis datos personales" en el formulario de registro, usted otorga su autorización previa, expresa e informada para que sus datos sean recolectados, almacenados, usados y circulados con las siguientes finalidades:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Verificación de Identidad y Edad:</strong> Asegurar que los usuarios cumplen con la edad legal para navegar en un sitio relacionado con bebidas alcohólicas.</li>
            <li><strong>Gestión de Usuarios:</strong> Permitir el acceso, administración de cuenta, y recuperación de perfil a través de correo electrónico o autenticación de terceros (Google).</li>
            <li><strong>Comunicaciones Comerciales (Opcional):</strong> Si usted lo autoriza, enviar promociones, novedades sobre lanzamientos de cervezas, invitaciones a catas y eventos en el Gastrobar.</li>
            <li><strong>Mejora del Servicio:</strong> Análisis estadístico anonimizado para mejorar la experiencia de usuario y la oferta de productos.</li>
            <li><strong>Cumplimiento Legal:</strong> Dar respuesta a requerimientos de autoridades competentes según sea necesario.</li>
          </ul>

          <h4 className="text-lg font-bold text-[#222223]">3. Derechos del Titular de los Datos</h4>
          <p>Como titular de sus datos personales, usted tiene derecho a:</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>Conocer, actualizar y rectificar sus datos personales frente a los Responsables del Tratamiento.</li>
            <li>Solicitar prueba de la autorización otorgada.</li>
            <li>Ser informado, previa solicitud, respecto del uso que se le ha dado a sus datos.</li>
            <li>Revocar la autorización y/o solicitar la supresión del dato cuando en el tratamiento no se respeten los principios, derechos y garantías constitucionales y legales.</li>
            <li>Acceder en forma gratuita a sus datos personales.</li>
          </ul>
          <p className="mt-2">
            Para ejercer estos derechos, puede contactarnos a través del correo electrónico: <strong>contacto@sierradorada.co</strong>.
          </p>

          <h4 className="text-lg font-bold text-[#222223]">4. Autenticación con Google</h4>
          <p>
            Al utilizar la opción "Continuar con Google", usted autoriza a Sierra Dorada a recibir información básica de su perfil público de Google (Nombre, Apellidos, Correo Electrónico y Foto de Perfil) para facilitar la creación automática de su cuenta. Estos datos serán tratados bajo la misma Política de Protección de Datos descrita anteriormente.
          </p>

          <h4 className="text-lg font-bold text-[#222223]">5. Uso Responsable</h4>
          <p>
            El usuario se compromete a hacer un uso adecuado de los contenidos y servicios (como chat, comentarios, etc.) que Sierra Dorada ofrece. Queda prohibido difundir contenidos de carácter racista, xenófobo, pornográfico-ilegal, de apología del terrorismo o atentatorio contra los derechos humanos.
          </p>

          <h4 className="text-lg font-bold text-[#222223]">6. Propiedad Intelectual</h4>
          <p>
            Todos los derechos de propiedad intelectual del contenido de este sitio web, su diseño gráfico y sus códigos fuente, son titularidad exclusiva de Sierra Dorada.
          </p>

          <h4 className="text-lg font-bold text-[#222223]">7. Modificaciones</h4>
          <p>
            Sierra Dorada se reserva el derecho de efectuar sin previo aviso las modificaciones que considere oportunas en su portal, pudiendo cambiar, suprimir o añadir tanto los contenidos y servicios que se presten a través de la misma como la forma en la que éstos aparezcan presentados.
          </p>
        </div>

        <div className="mt-8 flex justify-end pt-4 border-t border-gray-200">
          <button
            onClick={() => setShowTerms(false)}
            className="px-6 py-2.5 bg-[#B3A269] text-[#222223] font-bold rounded-lg hover:bg-[#9f8f5a] transition-colors shadow-md"
          >
            Entendido y Cerrar
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
                      className="text-[#B3A269] hover:text-[#B3A269]/80 inline-flex items-center font-bold"
                    >
                      términos y condiciones
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </button>
                  </label>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex items-center h-5">
                  <input
                    id="dataConsent"
                    name="dataConsent"
                    type="checkbox"
                    checked={formData.dataConsent}
                    onChange={(e) => setFormData({ ...formData, dataConsent: e.target.checked })}
                    className="h-4 w-4 text-[#B3A269] focus:ring-[#B3A269] border-gray-300 rounded"
                  />
                </div>
                <div className="ml-3">
                  <label htmlFor="dataConsent" className="text-sm text-gray-700">
                    Autorizo el <strong>tratamiento de mis datos personales</strong> conforme a la política de privacidad.
                  </label>
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
