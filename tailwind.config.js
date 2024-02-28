/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "lavender": '#CBB6E5',
        "lavender-light": '#F0EAF8',
        "purple": '#761BE4',
        "blue": '#6A19CD',
        "dark-blue": '#000853',
        "red": '#ED4545',
        "grey": '#898DA9',
        "lightgrey": '#FEECEC',
        "pale-purple": '#F0EAF8',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      spacing: {
        '18': '18px',
        '22': '22px',
        '23': '23px',
        '25': '25px',
        '29': '29px',
        '34': '34px',
        '120': '120px',
      },
      maxWidth: {
        '76': '76px',
        '326': '326px',
        '390': '390px',
        '420': '420px',
        '474': '474px',
      }
    },
  },
  plugins: [],
}