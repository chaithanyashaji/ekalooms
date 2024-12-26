import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import sitemap from 'vite-plugin-sitemap';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    sitemap({
      hostname: 'https://ekalooms.com', // Your domain name
      // Optional configurations:
      // Exclude specific pages from the sitemap
      // exclude: ['/exclude-page'],
      // Specify routes manually if needed
      // routes: ['/about', '/contact'],
    }),
  ],
  server: {
    port: 5174, // Your development server port
  },
});
