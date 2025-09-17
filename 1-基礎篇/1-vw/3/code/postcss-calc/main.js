import postcssCalc from 'postcss-calc'
import postcss from 'postcss'

const cssString = `
  body {
    font-size: calc(1px + 1px + 50%);
  }
`

postcss()
  .use(postcssCalc())
  .process(cssString, {from: ''})
  .then((result) => {
    console.log(result.css)
  })
