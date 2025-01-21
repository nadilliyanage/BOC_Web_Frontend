/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary_1: "#ffffff",
        primary_2: "#E9E9E9",
        secondary: "#FDC60D",
        dark_1: "#181818",
        dark_2: "#282828",
        dark_3: "#404040",
      },
    },
  },
  plugins: [],
};
