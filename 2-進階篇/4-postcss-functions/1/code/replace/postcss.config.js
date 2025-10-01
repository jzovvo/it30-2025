import postcssFunctions from 'postcss-functions'

/** @type {import('postcss-load-config').Config} */
export default {
  plugins: [
    postcssFunctions({
      functions: {
        add: (a, b) => parseFloat(a) + parseFloat(b),
        multiply: (a, b) => parseFloat(a) * parseFloat(b),
      },
    }),
  ],
}
