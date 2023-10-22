/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    fontFamily: {
      'poppins': ['"Poppins"', defaultTheme.fontFamily.poppins],
    },
    extend: {
      colors: {
        'gold-text': '#FFC609',
      },
    },
  },
  plugins: [],
}

