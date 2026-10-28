/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#F7F6F1",
        ink: "#1C1E1B",
        bridge: {
          50: "#EEF4F0",
          100: "#D6E6DB",
          200: "#AECDB8",
          300: "#7FAE8E",
          400: "#4C8865",
          500: "#2E6A48",
          600: "#235438",
          700: "#1B4230",
          800: "#153426",
          900: "#0F271C",
        },
        harvest: {
          50: "#FDF6E7",
          100: "#F9E7BC",
          200: "#F3D188",
          300: "#EBB854",
          400: "#DFA02E",
          500: "#C4841C",
          600: "#9C6614",
          700: "#744C10",
        },
        clay: "#B14B3A",
      },
      fontFamily: {
        display: ["'Fraunces'", "serif"],
        body: ["'Inter'", "sans-serif"],
      },
      borderRadius: {
        sm: "4px",
        DEFAULT: "6px",
        lg: "10px",
      },
    },
  },
  plugins: [],
};
