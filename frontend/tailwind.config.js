/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  theme: {
   extend: {
  colors: {
    gold: {
      DEFAULT: "#C8A951",   // Dorado elegante, tono oro real
      light: "#E6C365",     // Dorado claro para brillos
      dark: "#8B7500",      // Dorado profundo para bordes o sombras
    },
    dark: {
      DEFAULT: "#0B0B0B",
      light: "#1A1A1A",
      medium: "#2B2B2B",
      gray: "#3B3B3B",
    },
  },
  boxShadow: {
    glow: "0 0 15px rgba(200, 169, 81, 0.4)", // dorado suave
    inner: "inset 0 0 10px rgba(200, 169, 81, 0.15)",
  },
  backgroundImage: {
    "gold-gradient": "linear-gradient(145deg, #8B7500, #C8A951, #E6C365)",
    "dark-gradient": "linear-gradient(160deg, #000000, #0C0C0C, #1A1A1A)",

      },
      boxShadow: {
        glow: "0 0 15px rgba(255, 215, 0, 0.5)",
        inner: "inset 0 0 10px rgba(255, 215, 0, 0.2)",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(145deg, #B8860B, #FFD700, #FFEA70)",
        "dark-gradient": "linear-gradient(160deg, #000000, #111111, #1A1A1A)",
      },
    },
  },
  plugins: [],
};
