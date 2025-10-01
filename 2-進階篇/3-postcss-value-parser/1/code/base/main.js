import valueParser from 'postcss-value-parser'

const cssValue = 'add(sub(1, 2),3) 100px'
const parsed = valueParser(cssValue)

parsed.walk(node => {
  console.log(`[ ${valueParser.stringify(node)} 解析出來的 AST node ]`)
  console.dir(node, {depth: null})
  if (node.type === 'function' && node.value === 'add') {
    node.type = 'word'
    node.value = '2px'
  }
})

console.log(parsed.toString())
