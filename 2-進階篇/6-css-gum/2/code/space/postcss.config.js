import {Core} from 'css-gum'

export default {
  plugins: {
    '@tailwindcss/postcss': {
      optimize: {minify: true},
    },
    'postcss-functions': {
      functions: Core,
    },
  },
}
