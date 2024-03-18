/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    `./src/pages/**/*.{js,jsx,ts,tsx}`,
    `./src/components/**/*.{js,jsx,ts,tsx}`,
  ],
  theme: {
    fontFamily: {
      'schoensperger': ['Schoensperger', 'sans-serif'],
    },
    extend: {
      screens: {
        screen: { raw: 'screen' },
        print: { raw: 'print' },
      }
    },
  },
  plugins: [],
}
