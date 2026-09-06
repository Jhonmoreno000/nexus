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
