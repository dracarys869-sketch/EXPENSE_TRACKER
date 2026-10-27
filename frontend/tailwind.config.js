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
        // Keep small supporting text readable on both white and canvas surfaces.
        slate: {
          400: '#667085',
          500: '#5b677a',
        },
        brand: {
          50: '#f0f8f4',
          100: '#dcefe5',
          200: '#bbdfcc',
          300: '#8cc7a8',
          400: '#56a981',
          500: '#318963',
          600: '#217553',
          700: '#1b5d44',
          800: '#194b38',
          900: '#163e30',
          950: '#0b261d',
        },
        accent: {
          400: '#d5e9a4',
          500: '#bed981',
          600: '#8aa951',
        },
        canvas: '#f6f8fa',
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 2px 6px -2px rgb(18 38 29 / 0.04), 0 0 1px rgb(18 38 29 / 0.04)',
        float: '0 16px 48px -16px rgb(18 38 29 / 0.18)',
      },
    },
  },
  plugins: [],
}
