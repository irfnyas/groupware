module.exports = {
  theme: {
    darkSelector: '.dark-mode',
    extend: {
      colors: {
        'brand-green-lighter': '#8FC749',
        'brand-green-light': '#76B74B',
        'brand-green': '#5AAA4E',
        'brand-green-dark': '#399F4F',
        'brand-green-darker': '#049550',
        'brand-green-darkest': '#008C50',
        'brand-blue-lighter': '#01BEF2',
        'brand-blue-light': '#00B0E9',
        'brand-blue': '#00A5E1',
        'brand-blue-dark': '#009BDA',
        'brand-blue-darker': '#0090D3',
        'brand-blue-darkest': '#0087CB',
        'brand-yellow-lighter': '#FFF212',
        'brand-yellow-light': '#FFF212',
        'brand-yellow': '#FFE11E',
        'brand-yellow-dark': '#FFD126',
        'brand-yellow-darker': '#FFD126',
        'brand-yellow-darkest': '#FEC32B'
      }
    }
  },
  variants: {
    backgroundColor: ['dark', 'dark-hover', 'dark-group-hover', 'dark-even', 'dark-odd', 'hover', 'responsive'],
    borderColor: ['dark', 'dark-focus', 'dark-focus-within', 'hover', 'responsive'],
    textColor: ['dark', 'dark-hover', 'dark-active', 'hover', 'responsive']
  },
  plugins: [
    require('tailwindcss-dark-mode')()
  ],
  purge: {
    content: ['./public/**/*.html', './src/**/*.vue'],
    options: {
      whitelistPatterns: [
        /-(leave|enter|appear)(|-(to|from|active))$/,
        /^(?!(|.*?:)cursor-move).+-move$/,
        /^router-link(|-exact)-active$/
      ]
    }
  }
}
