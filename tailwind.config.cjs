/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      screens: {
        xm: "480px",
        xs: "384px",
        "2xs": "320px",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};
