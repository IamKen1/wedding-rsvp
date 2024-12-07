/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-cormorant)', 'serif'],
        script: ['var(--font-great-vibes)', 'cursive'],
      },
      colors: {
        primary: '#2F4F4F',
        secondary: '#F0F7F4',
        sage: {
          100: '#F5FFF8',
          200: '#E0F5E6',
          300: '#B8E6C4',
          400: '#87C897',
          500: '#569E68',
          600: '#2F4F4F',
        },
        accent: '#1D5E3E',
        mint: '#E8F7EE',
        cream: '#FFFAF0',
        forest: {
          light: '#7DA87F',
          DEFAULT: '#1D5E3E',
          dark: '#0F2E1F',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
};
