/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        script: ['Dancing Script', 'cursive'],
      },
      colors: {
        primary: '#f59e0b', // Elegant gold
        secondary: '#fff7e6', // Cream
        accent: '#4a5568', // Grayish blue
      },
    },
  },
  plugins: [],
};
