/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#070b18',
          900: '#0b1120',
          800: '#111827',
          700: '#1a2236',
        },
        aiGreen: '#22e6a3',
        aiPurple: '#8b5cf6',
        aiBlue: '#3b82f6',
      },
      backgroundImage: {
        'app-gradient': 'radial-gradient(circle at 0% 0%, rgba(139,92,246,0.15), transparent 40%), radial-gradient(circle at 100% 0%, rgba(34,230,163,0.12), transparent 40%), linear-gradient(180deg, #070b18 0%, #0b1120 100%)',
        'card-gradient': 'linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))',
      },
      boxShadow: {
        glow: '0 0 40px rgba(34,230,163,0.15)',
      },
    },
  },
  plugins: [],
}
