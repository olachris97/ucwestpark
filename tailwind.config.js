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
        "paper-stub": "#F5F1E8",
        "paper-line": "#E5E0D7",

        ink: "#111111",
        "ink-soft": "#5F5A52",

        marquee: "#111111",
        "marquee-deep": "#080808",

        gold: "#F5B754",
        "gold-dark": "#D99A24",
      },

      fontFamily: {
        display: ["Montserrat Alternates", "sans-serif"],
        body: ["Lato", "sans-serif"],
      },
    },
  },

  plugins: [],
}