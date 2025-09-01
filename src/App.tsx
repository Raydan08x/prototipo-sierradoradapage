import React, { useEffect } from 'react';
import './styles/mobile-optimize.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import UserProfile from './components/user/UserProfile';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AgeVerification from './components/AgeVerification';
import Preloader from './components/Preloader';
import Cart from './components/Cart';
import ChatBot from './components/ChatBot';

// Pages
import HomePage from './pages/HomePage';
import ProductsPage from './pages/ProductsPage';
import LegendPage from './pages/LegendPage';
import ProductDetail from './pages/ProductDetail';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAgeVerified, setIsAgeVerified, profile } = useAuth();

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
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <Toaster position="top-right" />
          <Routes>
            <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
            <Route path="/productos" element={<MainLayout><ProductsPage /></MainLayout>} />
            <Route path="/nuestra-leyenda" element={<MainLayout><LegendPage /></MainLayout>} />
            <Route path="/servicios" element={<MainLayout><ServicesPage /></MainLayout>} />
            <Route path="/contacto" element={<MainLayout><ContactPage /></MainLayout>} />
            <Route path="/producto/:id" element={<MainLayout><ProductDetail /></MainLayout>} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/register" element={<RegisterForm />} />
            <Route path="/perfil" element={<MainLayout><UserProfile /></MainLayout>} />
          </Routes>
        </CartProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;