/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        background: 'var(--background)',
        light_background: 'var(--light-background)',
        secondary: 'var(--color-dark)',
        accent: 'var(--color-accent)'
      },
      fontFamily: {
        brand: ["BDOGrotesk", "sans-serif"],
      },
    },
  },
  plugins: [],
};
