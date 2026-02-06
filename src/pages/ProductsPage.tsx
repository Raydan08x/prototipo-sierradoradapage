import { motion } from 'framer-motion';
import Features from '../components/Features';

const ProductsPage = () => {
  return (
    <div className="pt-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 text-center"
      >
        <h1 className="text-7xl font-bold text-[#E5E1E6] mb-4 font-dorsa">Nuestros Productos</h1>
        <p className="text-xl text-[#E5E1E6]/80 max-w-3xl mx-auto">
          Descubre nuestra selección de cervezas artesanales, cada una con su propia historia y carácter único.
        </p>
      </motion.div>

      <Features />
    </div>
  );
};

export default ProductsPage;