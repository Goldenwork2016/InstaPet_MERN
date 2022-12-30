/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#343646',
        primaryDark: '#242636',
        secondary: '#B87FD9',
        dark: '#1E1E2C',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        dmSans: ['DM Sans', 'sans-serif'],
        dmMono: ['DM Mono', 'monospace'],
      },
    },
  },
  plugins: [],
};
