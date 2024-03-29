/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    fontFamily: {
      sans: ['"Open Sans"', 'sans-serif'],
    },
    colors: {
      gray: {
        light: '#7D8082',
        DEFAULT: '#2A2C2D',
        dark: '#232526',
      },
      white: {
        light: '#F5F5F5',
        DEFAULT: '#EEEEEE',
        dark: '#E6E6E6',
      },
      red: '#C93954',
      orange: '#F5841B',
      yellow: '#F2E298',
      green: {
        DEFAULT: '#3ACF38',
        dark: '#32C530',
      },
      blue: '#379DC2',
      transparent: 'transparent',
    },
    extend: {
      aspectRatio: {
        '5/4': '5 / 4',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};
