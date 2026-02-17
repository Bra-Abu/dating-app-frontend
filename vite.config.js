import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'firebase': ['firebase/app', 'firebase/auth'],
          'query': ['@tanstack/react-query'],
          'ui': ['@headlessui/react', '@heroicons/react'],
          // Admin pages chunk (lazy loaded)
          'admin': [
            './src/pages/admin/Dashboard.jsx',
            './src/pages/admin/PendingUsers.jsx',
            './src/pages/admin/PendingProfiles.jsx',
            './src/pages/admin/Verifications.jsx',
            './src/pages/admin/AdminReports.jsx',
            './src/pages/admin/Statistics.jsx',
          ],
        },
      },
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 600,
    // Enable source maps for production debugging (optional)
    sourcemap: false,
  },
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@tanstack/react-query',
      'firebase/app',
      'firebase/auth',
    ],
  },
})
