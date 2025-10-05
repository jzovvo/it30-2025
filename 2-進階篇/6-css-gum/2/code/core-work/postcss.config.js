import postcssFunctions from 'postcss-functions'
import {Core} from 'css-gum'

/** @type {import('postcss-load-config').Config} */
export default {
  plugins: [
    postcssFunctions({
      functions: Core,
    }),
  ],
}
