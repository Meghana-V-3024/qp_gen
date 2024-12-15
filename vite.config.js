import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/generate-paper': 'http://localhost:5000', // Forward API calls to backend
    },
  },
});