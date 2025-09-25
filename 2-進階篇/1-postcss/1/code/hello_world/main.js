import fs from 'fs'
import postcss from 'postcss'

/**
 * @type {import('postcss').PluginCreator}
 */
const plugin = function () {
  return {
    // plugin 名字，隨便取。
    postcssPlugin: ' :) ',
    Comment: (comment) => {
      console.log('[ Comment ]')
      console.log(comment.text)

      comment.text = ':)'
    },
    Declaration: (decl) => {
      console.log('[ Declaration ]')
      console.log(`${decl.prop}: ${decl.value}`)

      if (decl.prop === 'color') {
        decl.value = 'chocolate'
      }
    },
  }
}

plugin.postcss = true

fs.readFile('./normal.css', (_, data) => {

  postcss([plugin])
    .process(data, {from:'./normal.css'})
    .then((result) => {
      console.log('[ Final ]')
      console.log(result.css)
    })
})
