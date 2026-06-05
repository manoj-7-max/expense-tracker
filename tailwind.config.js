/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      colors: {
        navy: {
          950: '#050B14', // Deep black background
          900: '#0B1220', // Dark navy cards
          800: '#151C2C', // Slightly lighter for hover
          700: '#1F2937',
        },
        neon: {
          cyan: '#00F5FF', // Neon cyan
          mint: '#00FFCC',
          blue: '#0070F3',
          purple: '#8A2BE2',
          pink: '#FF007F',
          red: '#FF3366',
        }
      },
      boxShadow: {
        soft: '0 12px 40px rgba(0, 245, 255, 0.05)',
        glow: '0 0 15px rgba(0, 245, 255, 0.4)',
        'glow-sm': '0 0 5px rgba(0, 245, 255, 0.3)',
      },
    },
  },
  plugins: [],
};
