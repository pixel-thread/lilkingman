/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset'), require('./nativecn-preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
