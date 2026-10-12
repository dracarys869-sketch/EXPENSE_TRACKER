/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#effaf0',
          100: '#d9f2dc',
          200: '#b8e5bd',
          300: '#8edb9b',
          400: '#5fbd72',
          500: '#0b5d2a',
          600: '#08751d',
          700: '#075f18',
          800: '#064a16',
          900: '#043b12',
          950: '#02260b',
        },
        accent: {
          400: '#ffe766',
          500: '#f4d000',
          600: '#d9b900',
        }
      }
    },
  },
  plugins: [],
}
