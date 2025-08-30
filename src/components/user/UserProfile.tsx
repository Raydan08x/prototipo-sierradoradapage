import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { User, Heart, Clock, ShoppingBag } from 'lucide-react';

const UserProfile = () => {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/login');
    return null;
  }

  const getUserDisplayName = () => {
    if (user.email === 'carlosmadero@sierradorada.co') {
      return 'Carlos';
    }
    
    if (profile?.full_name) {
      return profile.full_name;
    }

    if (profile?.gender === 'female') {
      return 'Sra. Cervecera';
    }

    if (profile?.gender === 'male') {
      return 'Sr. Cervecero';
    }

    return 'Cervecero(a)';
  };

  return (
    <div className="min-h-screen bg-[#222223] pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="bg-[#2A2A2B] rounded-lg p-6 h-fit">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-[#B3A269]/20 rounded-full flex items-center justify-center">
                <User className="w-6 h-6 text-[#B3A269]" />
              </div>
              <div>
                <h2 className="text-[#E5E1E6] font-medium">{getUserDisplayName()}</h2>
                <p className="text-[#E5E1E6]/60 text-sm">{user.email}</p>
              </div>
            </div>
            
            <nav className="space-y-2">
              <button className="w-full flex items-center gap-3 px-4 py-2 text-[#E5E1E6] hover:bg-[#B3A269]/10 rounded-lg transition-colors">
                <Heart className="w-5 h-5" />
                Favoritos
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2 text-[#E5E1E6] hover:bg-[#B3A269]/10 rounded-lg transition-colors">
                <Clock className="w-5 h-5" />
                Historial
              </button>
              <button className="w-full flex items-center gap-3 px-4 py-2 text-[#E5E1E6] hover:bg-[#B3A269]/10 rounded-lg transition-colors">
                <ShoppingBag className="w-5 h-5" />
                Pedidos
              </button>
              <button
                onClick={() => signOut()}
                className="w-full mt-4 px-4 py-2 bg-[#B3A269] text-[#222223] rounded-lg hover:bg-[#B3A269]/90 transition-colors"
              >
                Cerrar Sesión
              </button>
            </nav>
          </div>

          {/* Main Content */}
          <div className="md:col-span-3 space-y-8">
            <div className="bg-[#2A2A2B] rounded-lg p-6">
              <h3 className="text-xl font-bold text-[#E5E1E6] mb-4">Mis Favoritos</h3>
              <p className="text-[#E5E1E6]/60">No tienes productos favoritos aún.</p>
            </div>

            <div className="bg-[#2A2A2B] rounded-lg p-6">
              <h3 className="text-xl font-bold text-[#E5E1E6] mb-4">Historial de Compras</h3>
              <p className="text-[#E5E1E6]/60">No hay compras registradas.</p>
            </div>

            <div className="bg-[#2A2A2B] rounded-lg p-6">
              <h3 className="text-xl font-bold text-[#E5E1E6] mb-4">Pedidos Activos</h3>
              <p className="text-[#E5E1E6]/60">No tienes pedidos activos.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;