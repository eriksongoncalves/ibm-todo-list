/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.tsx', './src/**/*.{ts,tsx}'],
  theme: {
    fontFamily: {
      robotoRegular: ['Roboto_400Regular'],
      robotoBold: ['Roboto_700Bold']
    },
    fontSize: {
      base: 16,
      xs: 12,
      sm: 14,
      lg: 18,
      xl: 20,
      '2xl': 24
    },
    colors: {
      transparent: 'transparent',
      white: '#ffffff',
      black: '#000000',
      gray: {
        100: '#e1e1e6',
        200: '#c4c4cc',
        300: '#7c7c8a',
        400: '#323238',
        500: '#29292e',
        600: '#202024',
        700: '#121214'
      },
      green: {
        500: '#00b37e',
        700: '#00875f'
      },
      red: {
        600: '#F75A68'
      }
    },
    extend: {}
  },
  plugins: []
}
