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
        sage: {
          50: '#F8FAF8',
          100: '#E8F1EA',
          200: '#D1E2D5',
          300: '#B3CDB8',
          400: '#8FB398',
          500: '#6B996F',
          600: '#4D7550',
          700: '#365438',
          800: '#233623',
          900: '#121B12',
        },
        forest: {
          light: '#7DA87F',
          DEFAULT: '#2C5530',
          dark: '#1A331E',
        },
        cream: {
          light: '#FFFDF8',
          DEFAULT: '#FFF9F0',
          dark: '#F5EDE0',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-fade': 'linear-gradient(180deg, transparent, rgba(0,0,0,0.1))',
      }
    },
  },
  plugins: [],
};
