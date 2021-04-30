module.exports = {
  purge: [
    './app/components/*.tsx',

    './app/components/**/*.tsx',

    './app/components/**/**/*.tsx',

    './src/*.tsx',
    './src/**/*.tsx',

    './public/index.html'
  ],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      prim: '#FFFDF7',
      sec: '#70AE6E',
      ter: '#F46197',
      white: '#ffffff',
      black: '#2D2D2D',

      tex: {
        prim: '#2D2D2D',
        sec: '#000000'
      },

      link: {
        off: '#ffffff',
        on: '#31AFD4'
      },
      transparent: 'transparent',
      red: '#70161E',
      blue: '#1C3144',
      gray: {
        hero: '#030306',
        dark: '#141414',
        DEFAULT: '#16151a',
        light: '#1c1b21'
      }
    },
    fontFamily: {
      sans: ['Lato', 'sans-serif'],
      serif: ['Montserrat', 'serif'],
      bubbly: ['Open+Sans', 'sans-serif']
    },
    extend: {
      width: {
        240: '40rem'
      },
      minWidth: {
        but: '15rem'
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
