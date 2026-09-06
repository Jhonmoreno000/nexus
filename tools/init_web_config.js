const fs = require('fs');
const path = require('path');

function write(p, data) {
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.writeFileSync(p, data.trim() + '\n', 'utf8');
}

// 1. apps/web/package.json
write('apps/web/package.json', JSON.stringify({
  "name": "@nexus/web",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "lucide-react": "^0.439.0",
    "@monaco-editor/react": "^4.6.0",
    "clsx": "^2.1.1",
    "tailwind-merge": "^2.5.2"
  },
  "devDependencies": {
    "@types/react": "^18.3.5",
    "@types/react-dom": "^18.3.0",
    "@vitejs/plugin-react": "^4.3.1",
    "autoprefixer": "^10.4.20",
    "postcss": "^8.4.45",
    "tailwindcss": "^3.4.11",
    "typescript": "^5.5.4",
    "vite": "^5.4.3"
  }
}, null, 2));

// 2. apps/web/vite.config.ts
write('apps/web/vite.config.ts', `
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true
      }
    }
  }
});
`);

// 3. apps/web/tsconfig.json
write('apps/web/tsconfig.json', JSON.stringify({
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": false,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": false,
    "noUnusedParameters": false,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"]
}, null, 2));

// 4. apps/web/tsconfig.node.json
write('apps/web/tsconfig.node.json', JSON.stringify({
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}, null, 2));

// 5. apps/web/tailwind.config.js
write('apps/web/tailwind.config.js', `
/** @type {import('tailwindcss').Config} */
export default {
  content: [
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
`);

// 6. apps/web/postcss.config.js
write('apps/web/postcss.config.js', `
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
`);

// 7. apps/web/index.html
write('apps/web/index.html', `<!doctype html>
<html lang="en" class="dark">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2306b6d4' stroke-width='2.5'><path d='M4 4v16L20 4v16'/></svg>" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>NEXUS — Database Engineering Simulator</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  </head>
  <body class="bg-[#070b14] text-slate-100 font-['Plus_Jakarta_Sans',sans-serif] antialiased overflow-hidden select-none">
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
`);

console.log('apps/web configuration files created successfully.');
