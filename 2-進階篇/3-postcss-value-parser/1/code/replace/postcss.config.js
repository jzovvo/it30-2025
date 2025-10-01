import valueParser from 'postcss-value-parser'

const transformNode = (node, functions) => {
  if (node.type !== 'function' || !functions[node.value]) {
    return node
  }

  const func = functions[node.value]
  const args = extractArgs(node.nodes, functions)
  const invocation = func.apply(func, args)

  node.type = 'word'
  node.value = invocation

  return node
}

const extractArgs = (nodes, functions) => {
  nodes = nodes.map(node => transformNode(node, functions))

  const args = []
  const last = nodes.reduce((prev, node) => {
    if (node.type === 'div' && node.value === ',') {
      args.push(prev)

      return ''
    }

    return prev + valueParser.stringify(node)
  }, '')

  if (last) {
    args.push(last)
  }

  return args
}

const myPlugin = function (functions = {}) {
  return {
    postcssPlugin: 'my-plugin',
    Declaration: (decl) => {
      const parsed = valueParser(decl.value)

      parsed.walk((node) => {
        transformNode(node, functions)
      })

      decl.value = parsed.toString()
    },
  }
}

myPlugin.postcss = true

/** @type {import('postcss-load-config').Config} */
export default {
  plugins: [
    myPlugin({
      add: (a, b) => parseFloat(a) + parseFloat(b),
      multiply: (a, b) => parseFloat(a) * parseFloat(b),
    }),
  ],
}
