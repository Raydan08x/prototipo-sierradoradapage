import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { loadEnv } from 'vite';

export default ({ mode }: { mode: string }) => {
  // Carga las variables de entorno según el modo (development, production)
  const env = loadEnv(mode, process.cwd(), '');

  return defineConfig({
    plugins: [react()],
    server: {
      host: true,
      port: 3000,
      // Solo configuramos el proxy si la URL de Supabase está definida
      ...(env.VITE_SUPABASE_URL ? {
        proxy: {
          '/.supabase': {
            target: env.VITE_SUPABASE_URL,
            changeOrigin: true,
            secure: false,
            rewrite: (path) => path.replace(/^\/\.supabase/, ''),
          }
        }
      } : {})
    },
    optimizeDeps: {
      exclude: ['lucide-react'],
    },
    build: {
      outDir: 'dist',
      sourcemap: true,
    }
  });
}