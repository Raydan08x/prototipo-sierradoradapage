import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Routes, Route, useLocation } from 'react-router-dom';
import { 
  Beer, 
  Calendar, 
  ShoppingCart, 
  Users, 
  Settings, 
  LogOut, 
  Factory, 
  BarChart as ChartBar,
  Truck,
  ArrowLeft
} from 'lucide-react';
import DashboardHome from './DashboardHome';
import ProductManagement from './ProductManagement';
import ReservationManagement from './ReservationManagement';
import SalesManagement from './SalesManagement';
import CustomerManagement from './CustomerManagement';
import ProductionManagement from './ProductionManagement';
import LogisticsManagement from './LogisticsManagement';
import Analytics from './Analytics';

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

  const isSubPage = location.pathname !== '/admin/dashboard';

  const modules = [
    {
      title: 'Gestión de Productos',
      icon: Beer,
      description: 'Administra el catálogo de cervezas y productos',
      path: '/admin/dashboard/products'
    },
    {
      title: 'Reservas',
      icon: Calendar,
      description: 'Gestiona las reservas y visitas guiadas',
      path: '/admin/dashboard/reservations'
    },
    {
      title: 'Ventas',
      icon: ShoppingCart,
      description: 'Control de pedidos y ventas online',
      path: '/admin/dashboard/sales'
    },
    {
      title: 'Clientes',
      icon: Users,
      description: 'Administración de usuarios y club de cerveceros',
      path: '/admin/dashboard/customers'
    },
    {
      title: 'Producción',
      icon: Factory,
      description: 'Gestión de producción y control de calidad',
      path: '/admin/dashboard/production'
    },
    {
      title: 'Logística',
      icon: Truck,
      description: 'Control de inventario y gestión de envíos',
      path: '/admin/dashboard/logistics'
    },
    {
      title: 'Analytics',
      icon: ChartBar,
      description: 'Métricas e indicadores de gestión',
      path: '/admin/dashboard/analytics'
    }
  ];

  return (
    <div className="min-h-screen bg-[#222223]">
      <nav className="bg-[#B3A269] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              {isSubPage && (
                <button
                  onClick={() => navigate('/admin/dashboard')}
                  className="mr-4 p-2 rounded-full hover:bg-[#222223]/10 transition-colors"
                >
                  <ArrowLeft className="h-5 w-5 text-[#222223]" />
                </button>
              )}
              <img 
                src="/assets/logo-white.svg" 
                alt="Sierra Dorada" 
                className="h-8 w-auto"
              />
              <span className="ml-2 text-[#222223] font-bold text-lg">
                Panel de Administración
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-[#222223]">{user?.email}</span>
              <button
                onClick={() => navigate('/admin/dashboard/settings')}
                className="p-2 rounded-full hover:bg-[#222223]/10 transition-colors"
              >
                <Settings className="h-5 w-5 text-[#222223]" />
              </button>
              <button
                onClick={handleSignOut}
                className="p-2 rounded-full hover:bg-[#222223]/10 transition-colors"
              >
                <LogOut className="h-5 w-5 text-[#222223]" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route index element={<DashboardHome modules={modules} />} />
          <Route path="products/*" element={<ProductManagement />} />
          <Route path="reservations/*" element={<ReservationManagement />} />
          <Route path="sales/*" element={<SalesManagement />} />
          <Route path="customers/*" element={<CustomerManagement />} />
          <Route path="production/*" element={<ProductionManagement />} />
          <Route path="logistics/*" element={<LogisticsManagement />} />
          <Route path="analytics/*" element={<Analytics />} />
        </Routes>
      </div>
    </div>
  );
};

export default Dashboard;