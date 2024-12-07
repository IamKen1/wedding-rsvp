/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-poppins)', 'sans-serif'],
        script: ['var(--font-dancing-script)', 'cursive'],
      },
      colors: {
        primary: '#f59e0b',
        secondary: '#fff7e6',
        accent: '#4a5568',
      },
    },
  },
  plugins: [],
};
