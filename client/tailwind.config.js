const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    colors: {
      green: "#1f271b",
      black: '#000',
      gray: "rgb(32, 34, 37)",
      navy: "#2D4059",
      blue: "#5370F4",
      orange: "#FF5722",
      yellow: "#FFD700",
      white: '#fff',
      snowWhite: '#f6f6f6',
      btnGradient: 'linear-gradient(110deg, #f93d66, #ffc600);'
    },
    extend: {
      fontFamily: {
        sans: ["Inter var", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};
