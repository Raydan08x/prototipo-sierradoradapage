import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AgeVerification from './components/AgeVerification';
import Preloader from './components/Preloader';
import Cart from './components/Cart';
import ChatBot from './components/ChatBot';
import MuiscaBackground from './components/MuiscaBackground';

// Pages
// Pages imports replaced by lazy loading below

// Lazy load pages
const HomePageLazy = React.lazy(() => import('./pages/HomePage'));
const ProductsPageLazy = React.lazy(() => import('./pages/ProductsPage'));
const LegendPageLazy = React.lazy(() => import('./pages/LegendPage'));
const ProductDetailLazy = React.lazy(() => import('./pages/ProductDetail'));
const ServicesPageLazy = React.lazy(() => import('./pages/ServicesPage'));
const ContactPageLazy = React.lazy(() => import('./pages/ContactPage'));
const GastrobarPageLazy = React.lazy(() => import('./pages/GastrobarPage'));
const LoginFormLazy = React.lazy(() => import('./components/auth/LoginForm'));
const RegisterFormLazy = React.lazy(() => import('./components/auth/RegisterForm'));
const VerificationPageLazy = React.lazy(() => import('./pages/VerificationPage'));
const AdminLoginFormLazy = React.lazy(() => import('./components/auth/AdminLoginForm'));
const UserProfileLazy = React.lazy(() => import('./components/user/UserProfile'));
const SacredJourneyPageLazy = React.lazy(() => import('./pages/SacredJourneyPage'));

import { useLocation } from 'react-router-dom';
import DynamicParticles from './components/DynamicParticles';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAgeVerified, setIsAgeVerified, profile } = useAuth();
  const location = useLocation();

  // If user has a birth_date in their profile, they're verified
  if (profile?.birth_date) {
    return (
      <div className="min-h-screen animated-bg">
        <Preloader />
        <Navbar />
        <Cart />
        <ChatBot />
        {children}
        <Footer />
      </div>
    );
  }

  // Otherwise, check the stored verification status
  if (!isAgeVerified) {
    return <AgeVerification onVerified={() => setIsAgeVerified(true)} />;
  }

  // Determine Particle Theme based on Route
  const whiteThemeRoutes = ['/servicios', '/productos', '/contacto', '/gastrobar'];
  const isWhiteTheme = whiteThemeRoutes.some(route => location.pathname.startsWith(route));

  const particleProps = isWhiteTheme ? {
    // White Aura Theme for Services, Products, Contact (Subtle)
    colorSequence: ['#FFFFFF', '#F5F5F5', '#E0FFFF', '#FFFFFF'],
    secondaryColorSequence: ['#FFFFFF', '#E6E6FA', '#F0FFFF', '#FFFFFF'],
    auraOpacity: 0.08, // Very faint white glow
    particleCount: 25   // Reduced count for clean look
  } : {
    // Default Gold/Warm Theme for Home, Legend, etc. (Rich)
    colorSequence: ['#DAA520', '#FFFFFF', '#FF8C00', '#DAA520'],
    secondaryColorSequence: ['#FFFFFF', '#FFD700', '#FFFFFF', '#FFD700'],
    auraOpacity: 0.15,
    particleCount: 60
  };

  return (
    <div className="min-h-screen relative text-[#E5E1E6] font-barlow">
      <MuiscaBackground />
      <DynamicParticles {...particleProps} />
      <Preloader />
      <Navbar />
      <Cart />
      <ChatBot />
      {children}
      <Footer />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-right" />
          <React.Suspense fallback={<Preloader />}>
            <Routes>
              <Route path="/" element={<MainLayout><HomePageLazy /></MainLayout>} />
              <Route path="/productos" element={<MainLayout><ProductsPageLazy /></MainLayout>} />
              <Route path="/nuestra-leyenda" element={<MainLayout><LegendPageLazy /></MainLayout>} />
              <Route path="/viaje-sagrado" element={<SacredJourneyPageLazy />} />
              <Route path="/servicios" element={<MainLayout><ServicesPageLazy /></MainLayout>} />
              <Route path="/gastrobar" element={<MainLayout><GastrobarPageLazy /></MainLayout>} />
              <Route path="/contacto" element={<MainLayout><ContactPageLazy /></MainLayout>} />
              <Route path="/producto/:id" element={<MainLayout><ProductDetailLazy /></MainLayout>} />
              <Route path="/login" element={<LoginFormLazy />} />
              <Route path="/register" element={<RegisterFormLazy />} />
              <Route path="/verificar" element={<VerificationPageLazy />} />
              <Route path="/acceso-admin" element={<AdminLoginFormLazy />} />
              <Route path="/perfil" element={<MainLayout><UserProfileLazy /></MainLayout>} />
            </Routes>
          </React.Suspense>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;