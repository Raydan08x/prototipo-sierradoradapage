import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';
import { Beer, X, Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signIn(email, password);
      toast.success('¡Bienvenido!');
      navigate('/');
    } catch (error) {
      toast.error('Error al iniciar sesión. Por favor, verifica tus credenciales.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const response = await fetch('http://localhost:3000/api/auth/google-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential: credentialResponse.credential }),
      });
      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      // Save token and state consistent with manual login
      // Assuming AuthContext handles this, but here we might need manual handling if context doesn't expose a method for token/user object directly.
      // Actually, looking at AuthContext usage in RegisterForm verify, it seems we save to localStorage manually there?
      // Let's check VerificationPage: Yes, it saves to localStorage manually.
      // We should really use AuthContext.login if available, but checking LoginForm it calls signIn. 
      // For consistency and cleaner code, ideally signIn handles it. Since we are adding a NEW flow, we'll manually set localstorage and reload or dispatch event if needed.
      // Or better yet, we can reload to let AuthProvider pick up the token?

      localStorage.setItem('token', data.access_token);
      localStorage.setItem('user', JSON.stringify(data.user));

      toast.success(`¡Bienvenido ${data.user.full_name || 'Usuari@'}!`);
      window.location.href = '/'; // Force reload to update context

    } catch (error: any) {
      toast.error(error.message || 'Error con Google Login');
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
            Iniciar Sesión
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Accede a tu cuenta de Sierra Dorada
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="email" className="sr-only">
                Correo Electrónico
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
                placeholder="Correo Electrónico"
              />
            </div>
            <div className="relative">
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
                className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-[#B3A269] focus:border-[#B3A269] focus:z-10 sm:text-sm pr-10"
                placeholder="Contraseña"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-[#B3A269] cursor-pointer z-20"
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <Eye className="h-5 w-5" />
                )}
              </button>
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

          <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-300"></div>
            <span className="flex-shrink-0 mx-4 text-gray-400">O continúa con</span>
            <div className="flex-grow border-t border-gray-300"></div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => toast.error('Error al conectar con Google')}
              theme="filled_black"
              shape="circle"
              text="continue_with"
            />
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="text-sm text-[#222223] hover:text-[#B3A269] transition-colors"
            >
              ¿No tienes una cuenta? Regístrate
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
