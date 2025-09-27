import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/' : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor libraries
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', 'sonner'],
          'form-vendor': ['react-hook-form', '@hookform/resolvers', 'zod'],
          'query-vendor': ['@tanstack/react-query'],
          'i18n-vendor': [
            'i18next',
            'react-i18next',
            'i18next-browser-languagedetector',
            'i18next-http-backend',
            'i18next-icu',
          ],
          'utils-vendor': [
            'axios',
            'js-cookie',
            'clsx',
            'zustand',
            'socket.io-client',
          ],
          'charts-vendor': ['recharts'],
          // Feature-based chunks
          auth: [
            './src/features/auth/views/Login.tsx',
            './src/features/auth/views/SignUp.tsx',
            './src/features/auth/views/ForgotPassword.tsx',
          ],
          dashboard: ['./src/features/dashboard/views/Dashboard.tsx'],
          landing: [
            './src/features/landing/views/Landing.tsx',
            './src/features/landing/views/About.tsx',
            './src/features/landing/views/ContactUs.tsx',
          ],
        },
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
    chunkSizeWarningLimit: 1000,
    assetsInlineLimit: 4096, // Inline assets smaller than 4KB
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'axios',
      'zustand',
    ],
  },
});
