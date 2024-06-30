/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./app/*.{js,jsx,ts,tsx}", "./components/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#0E0E0E",
        button:"#2E2E2E",
        border:"#4a4a4a",
        valred: "#ff4656",
        danger: "#e3342f",
      },
    },
  },
  plugins: [],
};
