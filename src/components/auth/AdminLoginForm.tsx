import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Beer, X } from 'lucide-react';

const AdminLoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.endsWith('@sierradorada.co')) {
      toast.error('Solo se permite el acceso con correo corporativo @sierradorada.co');
      return;
    }

    setIsLoading(true);

    try {
      await signIn(email, password);
      toast.success('¡Bienvenido al panel administrativo!');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error('Error al iniciar sesión. Por favor, verifica tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#222223] py-12 px-4 sm:px-6 lg:px-8">
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
            Panel Administrativo
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Acceso exclusivo para empleados de Sierra Dorada
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Correo Electrónico Corporativo
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#B3A269] focus:border-[#B3A269] focus:z-10 sm:text-sm"
                placeholder="correo@sierradorada.co"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Contraseña
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#B3A269] focus:border-[#B3A269] focus:z-10 sm:text-sm"
                placeholder="Contraseña"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-[#222223] bg-[#B3A269] hover:bg-[#B3A269]/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#B3A269] transition-colors duration-200"
            >
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="text-sm text-[#222223] hover:text-[#B3A269] transition-colors"
            >
              Volver al sitio principal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginForm;