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
    myPlugin({color: 'chocolate'}),
  ],
}
