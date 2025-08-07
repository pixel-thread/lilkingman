/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset'), require('./nativecn-preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
