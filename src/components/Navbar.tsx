import React, { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, UserCircle } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { setIsCartOpen, items } = useCart();
  const { user, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigation = (path: string) => {
    navigate(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setIsOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const navItems = [
    { name: 'Inicio', path: '/' },
    { name: 'Productos', path: '/productos' },
    { name: 'Nuestra Leyenda', path: '/nuestra-leyenda' },
    { name: 'Servicios', path: '/servicios' },
    { name: 'Contacto', path: '/contacto' }
  ];

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-[#222223]/80 backdrop-blur-lg border-b border-[#B3A269]/10' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex-shrink-0">
            <button 
              onClick={() => handleNavigation('/')}
              className="focus:outline-none"
            >
              <img 
                src="/assets/logo-color.svg" 
                alt="Sierra Dorada" 
                className="h-12 w-auto"
              />
            </button>
          </div>

          <div className="hidden md:flex md:items-center md:justify-end md:flex-1">
            <div className="flex items-center space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleNavigation(item.path)}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === item.path
                      ? 'text-[#B3A269]'
                      : 'text-[#E5E1E6] hover:text-[#B3A269]'
                  }`}
                >
                  {item.name}
                </button>
              ))}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative p-2 text-[#E5E1E6] hover:text-[#B3A269] transition-colors"
              >
                <ShoppingCart className="w-6 h-6" />
                {items.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-[#B3A269] text-[#222223] w-5 h-5 rounded-full text-xs flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </button>
              {user ? (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleNavigation('/perfil')}
                    className="flex items-center gap-2 px-4 py-2 text-[#E5E1E6] hover:text-[#B3A269] transition-colors"
                  >
                    <UserCircle className="w-5 h-5" />
                    Mi Perfil
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 text-[#222223] bg-[#B3A269] rounded-full hover:bg-[#B3A269]/90 transition-colors"
                  >
                    Cerrar Sesión
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleNavigation('/login')}
                    className="px-4 py-2 text-[#E5E1E6] hover:text-[#B3A269] transition-colors"
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    onClick={() => handleNavigation('/register')}
                    className="px-4 py-2 text-[#222223] bg-[#B3A269] rounded-full hover:bg-[#B3A269]/90 transition-colors"
                  >
                    Registrarse
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[#E5E1E6] hover:text-[#B3A269] transition-colors"
            >
              <ShoppingCart className="w-6 h-6" />
              {items.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#B3A269] text-[#222223] w-5 h-5 rounded-full text-xs flex items-center justify-center">
                  {items.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-[#E5E1E6] hover:text-[#B3A269] focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-[#222223]/95 backdrop-blur-lg border-t border-[#B3A269]/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navItems.map((item) => (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`block w-full text-left px-3 py-2 rounded-md text-base font-medium ${
                  location.pathname === item.path
                    ? 'text-[#B3A269]'
                    : 'text-[#E5E1E6] hover:text-[#B3A269]'
                }`}
              >
                {item.name}
              </button>
            ))}
            {user ? (
              <>
                <button
                  onClick={() => handleNavigation('/perfil')}
                  className="block w-full text-left px-3 py-2 text-[#E5E1E6] hover:text-[#B3A269] transition-colors"
                >
                  Mi Perfil
                </button>
                <button
                  onClick={handleSignOut}
                  className="block w-full text-left px-4 py-2 mt-2 bg-[#B3A269] text-[#222223] rounded-full hover:bg-[#B3A269]/90 transition-colors"
                >
                  Cerrar Sesión
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => handleNavigation('/login')}
                  className="block w-full text-left px-4 py-2 text-[#E5E1E6] hover:text-[#B3A269] transition-colors"
                >
                  Iniciar Sesión
                </button>
                <button
                  onClick={() => handleNavigation('/register')}
                  className="block w-full text-left px-4 py-2 bg-[#B3A269] text-[#222223] rounded-full hover:bg-[#B3A269]/90 transition-colors"
                >
                  Registrarse
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;