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
          50: '#f4f1e8',
          100: '#ebe7dc',
          200: '#ddd8ca',
          300: '#c9c1ae',
          400: '#8e9b84',
          500: '#466245',
          600: '#466245',
          700: '#20321e',
          800: '#1c2c1b',
          900: '#172317',
          950: '#101a11',
        }
      }
    },
  },
  plugins: [],
}
