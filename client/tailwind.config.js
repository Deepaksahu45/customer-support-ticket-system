// Aegis — Tailwind CSS configuration
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        aegis: {
          green: '#22c55e',
          dark: '#0f172a',
          surface: '#1e293b',
          border: '#334155',
          text: '#f1f5f9',
          muted: '#94a3b8',
        },
      },
      fontFamily: {
        brand: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'aegis-glow':
          'radial-gradient(circle at 70% 30%, rgba(34,197,94,0.15), transparent 50%), radial-gradient(circle at 20% 80%, rgba(34,197,94,0.08), transparent 40%)',
        'aegis-glow-strong':
          'radial-gradient(circle at 70% 30%, rgba(34,197,94,0.25), transparent 50%), radial-gradient(circle at 20% 80%, rgba(34,197,94,0.15), transparent 40%)',
      },
      animation: {
        'pulse-green': 'pulseGreen 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        pulseGreen: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(34,197,94,0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(34,197,94,0)' },
        },
        fadeIn: {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
