/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.jsx', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
