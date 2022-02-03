const defaultTheme = require('tailwindcss/defaultTheme')
const { colors } = require('./src/components/token/colors')
const { fontWeight } = require('./src/components/token/FontWeight')

module.exports = {
  mode: 'jit',
  purge: [
    './src/domains/**/*.{js,ts,jsx,tsx}',
    './src/pages/**/*.{js,ts,jsx,tsx}',
    './src/components/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        inter: ["'Inter'", ...defaultTheme.fontFamily.sans],
        mono: [
          "'Roboto Mono'",
          "'source-code-pro'",
          ...defaultTheme.fontFamily.mono,
        ],
      },
      colors,
      fontWeight,
    },
  },
  variants: {
    extend: {},
  },
}
