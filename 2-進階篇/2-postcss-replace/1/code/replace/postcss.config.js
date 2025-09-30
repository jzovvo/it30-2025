const myPlugin = function (functions = {}) {
  const functionCallRegex = /(\w+)\(([^()]*)\)/g

  return {
    postcssPlugin: 'my-plugin',
    Declaration: (decl) => {
      let newValue = decl.value
      let match

      console.log(`[ 處理 ${decl.value} 中 ]`)

      while ((match = functionCallRegex.exec(decl.value)) !== null) {
        const [fullMatch, functionName, argsString] = match

        if (!functions[functionName]) {
          console.log(`我沒有要攔截 ${functionName} 函式!`)
          continue
        }

        try {
          const args = argsString.trim() ? argsString.split(',').map(arg => arg.trim()) : []
          const result = functions[functionName](...args)

          newValue = newValue.replace(fullMatch, result)
          console.log(`替換 ${fullMatch} 為 ${result}!`)
        } catch (error) {
          console.error(`Error executing function ${functionName}:`, error)
        }
      }

      if (newValue !== decl.value) {
        decl.value = newValue
      }
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
