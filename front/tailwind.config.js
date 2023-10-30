/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{html,js,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'poppins': ['Poppins']},
      colors:{
        'my-orange':'FF8200'
      }
    },
  },
  plugins: [require("daisyui")],
}

