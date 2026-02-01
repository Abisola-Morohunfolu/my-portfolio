/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        background: 'var(--background)',
        light_background: 'var(--light-background)',
        secondary: 'var(--color-dark)',
        accent: 'var(--color-accent)',
        lime: 'var(--color-lime)',
        orange: 'var(--color-orange)',
        'dark-surface': 'var(--color-dark-surface)',
        'dark-border': 'var(--color-dark-border)',
      },
      fontFamily: {
        brand: ['BDOGrotesk', 'sans-serif'],
      },
      fontSize: {
        hero: ['clamp(2.8rem, 10vw, 9rem)', { lineHeight: '0.85' }],
        section: ['clamp(2.5rem, 6vw, 5rem)', { lineHeight: '1.1' }],
      },
      keyframes: {
        'gradient-shift': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px rgba(197, 255, 65, 0.3)' },
          '50%': { boxShadow: '0 0 40px rgba(197, 255, 65, 0.6)' },
        },
      },
      animation: {
        gradient: 'gradient-shift 3s ease infinite',
        float: 'float 3s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
      },
      backgroundImage: {
        'gradient-primary': 'var(--gradient-primary)',
        'gradient-cta': 'var(--gradient-cta)',
      },
    },
  },
  plugins: [],
};
