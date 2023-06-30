/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-green': '#138045',
        'primary-blue': '#4361EE',
      },
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        OP: ['Open Sans', 'sans-serif']
      }
    },
  },
  plugins: [],
}
