/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.jsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        Cgreen: '#143227',
        Corange: '#DA7320',
        Cdarkgray: '#171717',
        Clightgray: '#1C1C1D',
        Cnavyblue: '#101820',
      },
    },
  },
  plugins: [],
};
