const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      green: "#1f271b",
      black: "#222831",
      navy: "#2D4059",
      orange: "#FF5722",
      yellow: "#f4d35e",
      white: '#fff',
    },
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
