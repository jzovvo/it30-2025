const myPlugin = function ({txt = ':)'} = {}) {
  return {
    postcssPlugin: 'my-plugin',
    Comment: (comment) => comment.text = txt,
  }
}

myPlugin.postcss = true

/** @type {import('postcss-load-config').Config} */
export default {
  plugins: [
    myPlugin,
  ],
}
