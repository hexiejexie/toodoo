const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  jit: true,
  theme: {
    extend: {
      fontFamily: {
        sans: ['Avenir', ...defaultTheme.fontFamily.sans]
      }
    },
    colors: {
      primary: '#2949EE',
      secondary: '#091A48',
      accent: '#FF7214',
      ...defaultTheme.colors
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
