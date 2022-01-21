module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        fadedongji: 'fadeIn 4s linear',
        slideIn: 'inRight 1.5s ease-out',
        slideOut: 'outLeft 1.5s ease-in',
      },
      fontFamily: {
        dongji: ['Be Vietnam Pro'],
        kelly: ['Montserrat'],
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: 0 },
          '25%': { opacity: 25 },
          '50%': { opacity: 50 },
          '75%': { opacity: 75 }, 
          '100%': { opacity: 100 },
        },
        inRight: {
          '0%': { 'margin-left': '50%', 'opacity': 0, },
          '100%': { 'margin-left': '0%', 'opacity': 1, },
        },
        outLeft: {
          '0%': { 'margin-left': '0%', 'opacity': 1, },
          '100%': { 'margin-left': '-50%', 'opacity': 0, 'visibility': 'hidden', }
        }
      },
    },
  },
  plugins: [],
}
