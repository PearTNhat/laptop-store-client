/** @type {import('tailwindcss').Config} */
import daisyui from 'daisyui'
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      maxWidth: {
        main: '1220px'
      },
      bg: {
        main: '#ee3131'
      },
      colors: {
        main: '#ee3131',
        second: '#505050',
        bl: '#151515' // black
      },
      fontFamily: {
        main: ['Poppins', 'sans-serif']
      },
      flex: {
        '1': '1 1 0%',
        '2': '2 2 0%',
        '3': '3 3 0%',
        '4': '4 4 0%',
        '5': '5 5 0%',
        '6': '6 6 0%',
        '7': '7 7 0%',
        '8': '8 8 0%',
        '9': '9 9 0%',
        '10': '10 10 0%',

      },
      keyframes: {
        'slide-top': {
          "0%": {
            " -webkit-transform": 'translateY(0)',
            '  transform': 'translateY(0)',
            'opacity': '0'
          },
          '100%': {
            ' -webkit-transform': ' translateY(-45px)',
            'transform': 'translateY(-45px)',
            'opacity': '1'
          }
        },
        'slide-top-sm': {
          "0%": {
            " -webkit-transform": 'translateY(-50%)',
            '  transform': 'translateY(-50%)',
            'opacity': '0'
          },
          '100%': {
            'top': '0',
            'opacity': '1'
          }
        },
        'slide-in-left': {
          '0%': {
            ' -webkit-transform': 'translateX(-1000px)',
            'transform': 'translateX(-1000px)',
            'opacity': '0'
          },
          '100%': {
            ' -webkit-transform': 'translateX(0)',
            'transform': 'translateX(0)',
            'opacity': '1'
          }
        },
        'slide-in-right': {
          '0%': {
            ' -webkit-transform': 'translateX(1000px)',
            'transform': 'translateX(1000px)',
            'opacity': '0'
          },
          '100%': {
            ' -webkit-transform': 'translateX(0)',
            'transform': 'translateX(0)',
            'opacity': '1'
          }
        },
        'slide-show': {
          "0%": {
            'opacity': '0'
          },
          '100%': {
            'opacity': '1'
          }
        },
        'scale-up-ver-top': { // drop down
          '0%': {
            transform: 'scaleY(0)',
            'transform-origin': '100% 0%'
          
          },
          '100%': {
            transform: 'scaleY(1)',
            'transform-origin': '100% 0%'
         
          }
        }
      },
    },
    animation: {
      'slide-top': 'slide-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
      'slide-top-sm': 'slide-top-sm 0.2s linear both',
      'slide-in-left': 'slide-in-left 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
      'slide-in-right': 'slide-in-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
      'slide-show': 'slide-show 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
      'drop-down-animation': 'scale-up-ver-top 0.4s cubic-bezier(0.390, 0.575, 0.565, 1.000) both'
    }
  },
  daisyui: {
    themes: ['light'], // false: only light + dark | true: all themes | array: specific themes like this ["light", "dark", "cupcake"]
    base: true, // applies background color and foreground color for root element by default
    styled: true, // include daisyUI colors and design decisions for all components
    utils: true, // adds responsive and modifier utility classes
    prefix: "d-", // prefix for daisyUI classnames (components, modifiers and responsive class names. Not colors)
    logs: false, // Shows info about daisyUI version and used config in the console when building your CSS
    themeRoot: ":root", // The element that receives theme color CSS variables
  },
  plugins: [daisyui],
}