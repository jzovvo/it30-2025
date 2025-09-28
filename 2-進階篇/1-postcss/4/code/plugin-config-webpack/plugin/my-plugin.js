const plugin = (opt = {hi: ':)'}) => {
  return {
    postcssPlugin: 'my-plugin',
    Comment: comment => comment.text = opt[comment.text] ?? comment.text,
  }
}

plugin.postcss = true

export default plugin
