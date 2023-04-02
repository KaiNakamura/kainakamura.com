/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    fontFamily: {
      sans: ['"Open Sans"', "sans-serif"],
    },
    colors: {
      gray: {
        DEFAULT: "#2A2C2D",
        dark: "#232526",
      },
      white: "#EEEEEE",
      red: "#C93954",
      orange: "#F5841B",
      yellow: "#F2E298",
      green: "#3ACF38",
      blue: "#379DC2",
      transparent: "transparent",
    },
    // fontSize: {
    //   xs: "0.75rem",
    //   sm: "0.875rem",
    //   base: "1rem",
    //   xl: "1.25rem",
    //   "2xl": "2rem",
    //   "3xl": "1.875rem",
    //   "4xl": "2.25rem",
    //   "5xl": "3rem",
    //   "6xl": "3.75rem",
    //   "7xl": "4.5rem",
    //   "8xl": "6rem",
    //   "9xl": "8rem",
    // },
    extend: {},
  },
  plugins: [],
};
