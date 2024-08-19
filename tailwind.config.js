/** @type {import('tailwindcss').Config} */
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
        '3': '3 3 0%',
        '8': '8 8 0%'
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
          '100%' :{
           ' -webkit-transform': 'translateX(0)',
            'transform': 'translateX(0)',
            'opacity': '1'
          }
        }
        },
        'slide-in-right': {
          '0%': {
           ' -webkit-transform': 'translateX(1000px)',
            'transform': 'translateX(1000px)',
            'opacity': '0'
          },
          '100%' :{
           ' -webkit-transform': 'translateX(0)',
            'transform': 'translateX(0)',
            'opacity': '1'
          }
        }
      },
      animation: {
        'slide-top': 'slide-top 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
        'slide-top-sm': 'slide-top-sm 0.2s linear both',
        'slide-in-left': 'slide-in-left 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
        'slide-in-right': 'slide-in-right 0.5s cubic-bezier(0.250, 0.460, 0.450, 0.940) both',
      }
  },
  plugins: [],
}