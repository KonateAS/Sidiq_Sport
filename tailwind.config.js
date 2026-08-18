/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        neon: '#00FF87',
        'neon-dark': '#00D966',
        apex: '#003D1A',
        surface: '#0F1F12',
        background: '#0A0F0A',
        danger: '#FF3B30',
        gold: '#FFD700',
        muted: '#7A8A7E',
        text: '#F0FFF0',
      },
    },
  },
  plugins: [],
};
