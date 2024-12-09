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
        // Fresh and playful green palette
        sage: {
          50: '#F0F7F4',
          100: '#E1EFE6',
          200: '#C2DFC9',
          300: '#A3CFAC',
          400: '#84BF8E',
          500: '#65AF71',
          600: '#4C8D57',
          700: '#386B41',
          800: '#24482B',
          900: '#102415',
        },
        mint: {
          light: '#B4E5C9',
          DEFAULT: '#7FCFA1',
          dark: '#4BA679',
        },
        leaf: {
          light: '#98D6A9',
          DEFAULT: '#5CB57E',
          dark: '#3D8B5F',
        },
        olive: {
          light: '#C9D6A3',
          DEFAULT: '#A8B878',
          dark: '#7A8A4D',
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
