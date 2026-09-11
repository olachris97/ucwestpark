/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],

  theme: {
    extend: {
      colors: {
        paper: "#FFFFFF",
        "paper-stub": "#F3F7FC",
        "paper-line": "#D9E3F0",

        ink: "#10233F",
        "ink-soft": "#52657D",

        marquee: "#1B5EB7",
        "marquee-deep": "#0B2B57",

        gold: "#EAB648",
        "gold-dark": "#B98416",
      },

      fontFamily: {
        display: ["Montserrat Alternates", "sans-serif"],
        body: ["Lato", "sans-serif"],
      },
    },
  },

  plugins: [],
}