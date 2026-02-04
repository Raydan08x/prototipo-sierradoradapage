import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import {
  LogOut,
} from 'lucide-react';
import ProductManagement from './ProductManagement';
import ReservationManagement from './ReservationManagement';

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/admin/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <div className="min-h-screen bg-[#222223]">
      <nav className="bg-[#B3A269] shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-4">
              <img
                src="/assets/logo-white.svg"
                alt="Sierra Dorada"
                className="h-8 w-auto"
              />
              <div className="flex flex-col">
                <span className="text-[#222223] font-extrabold text-lg leading-tight">
                  Panel Administrativo
                </span>
                <span className="text-[#222223]/80 text-xs font-medium">
                  Gestión Integral
                </span>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              <button
                onClick={() => navigate('/admin/dashboard/products')}
                className={`text-sm font-bold uppercase tracking-wide transition-colors ${location.pathname.includes('products') ? 'text-[#222223] border-b-2 border-[#222223]' : 'text-[#222223]/60 hover:text-[#222223]'
                  }`}
              >
                Productos
              </button>
              <button
                onClick={() => navigate('/admin/dashboard/reservations')}
                className={`text-sm font-bold uppercase tracking-wide transition-colors ${location.pathname.includes('reservations') ? 'text-[#222223] border-b-2 border-[#222223]' : 'text-[#222223]/60 hover:text-[#222223]'
                  }`}
              >
                Reservas
              </button>
            </div>

            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="p-2 rounded-full hover:bg-[#222223]/10 transition-colors text-[#222223] font-medium text-sm flex items-center gap-1"
              >
                Ver Sitio
              </button>
              <button
                onClick={handleSignOut}
                className="p-2 rounded-full hover:bg-[#222223]/10 transition-colors"
                title="Cerrar Sesión"
              >
                <LogOut className="h-5 w-5 text-[#222223]" />
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden flex pb-4 gap-4">
            <button
              onClick={() => navigate('/admin/dashboard/products')}
              className={`flex-1 text-center py-2 text-xs font-bold uppercase transition-colors rounded ${location.pathname.includes('products') ? 'bg-[#222223] text-[#B3A269]' : 'bg-[#222223]/10 text-[#222223]'
                }`}
            >
              Productos
            </button>
            <button
              onClick={() => navigate('/admin/dashboard/reservations')}
              className={`flex-1 text-center py-2 text-xs font-bold uppercase transition-colors rounded ${location.pathname.includes('reservations') ? 'bg-[#222223] text-[#B3A269]' : 'bg-[#222223]/10 text-[#222223]'
                }`}
            >
              Reservas
            </button>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-8 sm:px-6 lg:px-8">
        <Routes>
          <Route index element={<ProductManagement />} />
          <Route path="products" element={<ProductManagement />} />
          <Route path="reservations" element={<ReservationManagement />} />
          {/* Catch all */}
          <Route path="*" element={<ProductManagement />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;