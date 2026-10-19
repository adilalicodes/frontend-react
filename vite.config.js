import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // Backend CORS allows http://localhost:5173 by default, so fail instead of silently picking another port.
  server: { port: 5173, strictPort: true },
});
