const myPlugin = function ({txt = ':)'} = {}) {
  return {
    postcssPlugin: 'my-plugin',
    Comment: (comment) => comment.text = txt,
  }
}

myPlugin.postcss = true

export default {
  css: {
    postcss: {
      plugins: [
        myPlugin,
      ],
    },
  },
}
