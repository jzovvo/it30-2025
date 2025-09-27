import fs from 'fs'
import postcss from 'postcss'

// postcss plugin
/**
 * @type {import('postcss').PluginCreator}
 */
const plugin = function () {
  return {
    postcssPlugin: ' :) ',
    Comment: (comment) => {
      comment.text = ':)'
    },
    Declaration: (decl) => {
      if (decl.prop === 'color') {
        decl.value = 'chocolate'
      }
    },
  }
}

plugin.postcss = true

const RESOURCE_PATH = './normal.css'

// ---- 模擬 postcss-loader ----
function postcssLoader(source, callback) {
  postcss([plugin])
    .process(source, {from: RESOURCE_PATH})
    .then((result) => {
      callback(null, result.css)
    })
}


// ---- 模擬 webpack 與 loader 的交互行為 ----
fs.readFile(RESOURCE_PATH, (_, data) => {
  const cssString = data.toString()

  // 1. 把讀到的數據傳給 loader
  postcssLoader(cssString, (err, css) => {
    if (err) {throw err}

    // 2. 將 loader 傳出來的數據傳給下一個 loader，
    // 3. 直到最後會拿到一個 js script 來執行
    console.log('[ Final Output ]')
    console.log(css)
  })
})
