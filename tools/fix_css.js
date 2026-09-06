const fs = require('fs');

fs.writeFileSync('apps/web/vite.config.ts', `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss(),
        autoprefixer()
      ]
    }
  },
  server: {
    port: 3000,
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
});
`, 'utf8');

fs.writeFileSync('tailwind.config.js', `/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./apps/web/index.html",
    "./apps/web/src/**/*.{js,ts,jsx,tsx}",
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        nexus: {
          bg: '#0B1120',
          card: '#0F172A',
          hover: '#1E293B',
          border: '#1E293B',
          cyan: '#06B6D4',
          cyanLight: '#22D3EE',
          cyanDark: '#0891B2',
          emerald: '#10B981',
          slateText: '#94A3B8',
          accent: '#38BDF8'
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace']
      }
    },
  },
  plugins: [],
};
`, 'utf8');

fs.writeFileSync('postcss.config.js', `export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`, 'utf8');

console.log('Configs updated.');
