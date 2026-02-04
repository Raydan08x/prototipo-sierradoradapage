import React, { createContext, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { api } from '../lib/api';

// Types for local backend
export type User = {
  id: string;
  email: string;
  role?: string;
};

export type Profile = {
  id: string;
  full_name: string | null;
  phone: string | null;
  address?: string | null;
  birth_date?: string | null;
  gender?: string | null;
  // Add other fields as matched in schema.sql
};

interface AuthContextType {
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, userData: any) => Promise<void>;
  signOut: () => Promise<void>;
  isAgeVerified: boolean;
  setIsAgeVerified: (verified: boolean) => void;
  updateProfile: (data: Partial<Profile>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAgeVerified, setIsAgeVerified] = useState(() => {
    return localStorage.getItem('ageVerified') === 'true';
  });

  const navigate = useNavigate();

  useEffect(() => {
    // Persist age verification
    localStorage.setItem('ageVerified', isAgeVerified.toString());
  }, [isAgeVerified]);

  useEffect(() => {
    // Check active session on mount
    const checkUser = async () => {
      try {
        const { data, error } = await api.auth.getUser();
        if (data && data.user) {
          setUser(data.user);
          // In our local API auth/me returns merged user+profile, or we can fetch profile separately
          // For now, let's assume setUser gets the base user info
          // and we set profile if returned, or we rely on the object shape
          setProfile(data.user as any);
        }
      } catch (e) {
        // No active session
        console.log('No active session');
      } finally {
        setLoading(false);
      }
    };
    checkUser();
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await api.auth.signInWithPassword({ email, password });

      if (error) throw error;

      if (data.user) {
        setUser(data.user);
        setProfile(data.user as any); // Adapt based on actual API response
        toast.success('¡Bienvenido!');
        navigate('/');
      }
    } catch (error: any) {
      console.error(error);
      const msg = error.error || 'Error al iniciar sesión';
      toast.error(msg);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      const { data, error } = await api.auth.signUp({
        email,
        password,
        ...userData
      });

      if (error) throw error;

      toast.success('Cuenta creada exitosamente. Por favor inicia sesión.');
      navigate('/login');
    } catch (error: any) {
      console.error(error);
      const msg = error.error || 'Error al registrarse';
      toast.error(msg);
      throw error;
    }
  };

  const signOut = async () => {
    await api.auth.signOut();
    setUser(null);
    setProfile(null);
    navigate('/');
  };

  const updateProfile = async (data: Partial<Profile>) => {
    // Placeholder for update logic
    console.log('Update profile not fully implemented in local version yet', data);
    toast.success('Perfil actualizado (simulado)');
  };

  return (
    <AuthContext.Provider value={{
      user,
      profile,
      loading,
      signIn,
      signUp,
      signOut,
      isAgeVerified,
      setIsAgeVerified,
      updateProfile
    }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};