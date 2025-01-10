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
      },
    },
  },
  plugins: [],
};
