import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      components: path.resolve(__dirname, './src/components'),
      containers: path.resolve(__dirname, './src/containers'),
      services: path.resolve(__dirname, './src/services'),
      stores: path.resolve(__dirname, './src/stores'),
      routes: path.resolve(__dirname, './src/routes'),
      utils: path.resolve(__dirname, './src/utils'),
      constants: path.resolve(__dirname, './src/constants'),
      locales: path.resolve(__dirname, './src/locales'),
      layouts: path.resolve(__dirname, './src/layouts'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
});
