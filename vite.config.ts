import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/.supabase': {
        target: process.env.VITE_SUPABASE_URL,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/.supabase/, ''),
      },
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          ui: ['framer-motion', 'lucide-react', 'react-hot-toast', 'react-datepicker']
        }
      }
    }
  }
});