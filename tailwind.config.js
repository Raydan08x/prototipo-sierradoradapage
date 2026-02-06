/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        dorsa: ['Dorsa', 'sans-serif'],
        barlow: ['Barlow', 'sans-serif'],
        'barlow-condensed': ['Barlow Condensed', 'sans-serif'],
        espoir: ['Espoir', 'serif'],
        myriad: ['Myriad Pro', 'sans-serif'],
      },
      colors: {
        brand: {
          gold: '#B3A269',
          black: '#222223',
          light: '#E5E1E6',
          forest: '#034638',
          burgundy: '#5C1D45',
          gray: '#757878',
        },
      },
      letterSpacing: {
        tighter: '-0.05em',
        tight: '-0.025em',
        normal: '0',
        wide: '0.025em',
        wider: '0.05em',
        widest: '0.1em',
      },
    },
  },
  plugins: [],
};