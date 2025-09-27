// 自己寫的 plugin，功能跟前面幾篇都差不多。
const myPlugin = function ({txt = ':)', color = 'orange'} = {}) {
  return {
    postcssPlugin: 'my-plugin',
    Comment: (comment) => {
      comment.text = txt
    },
    Declaration: (decl) => {
      if (decl.prop === 'color') {
        decl.value = color
      }
    },
  }
}

myPlugin.postcss = true

/** @type {import('postcss-load-config').Config} */
export default {
  plugins: [
    // 要不要執行都可以，沒執行的話，postcss 會自己執行。
    // myPlugin,
    myPlugin({color: 'chocolate'}),
  ],
}
