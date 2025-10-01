# 煉金術的精密儀器： postcss-value-parser

在「點石成金的秘術」中，我們用正規表示式實現了「將 css 屬性值的函式呼叫字串用計算結果替換」的目標，但深入去研磨正規表示式的匹配範圍是相當花心力的，因此這篇要介紹一個工具：`postcss-value-parser`，主要功能是將 css 的屬性值解析成可操作的大 json ( AST )，如此就能解決我看不懂正規表示式還要裝懂的困境了～

**程式碼**

```js
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
```

- `valueParser`: 解析 `css` 屬性值，返回 AST。
  - `parsed.walk`:
    - 遍歷每個 `node`。
    - 可以直接改 `node` 內容。
    - 函式呼叫替換為數值的做法：
      - 將 `node` 的類型改成 `word`。
      - 將 `node` 的值改成你要替換的字串。
      - 例如範例中將 `add()` 換成 `2px`。
  - `parsed.toString`: 將整個 AST 轉回 `css` 屬性值。
- `valueParser.stringify`: 將指定的 `node` 轉回 `string`。

**結果**

```shell
% node ./main.js
[ add(sub(1, 2),3) 解析出來的 AST node ]
{
  type: 'function',
  sourceIndex: 0,
  value: 'add',
  before: '',
  after: '',
  sourceEndIndex: 16,
  nodes: [
    {
      type: 'function',
      sourceIndex: 4,
      value: 'sub',
      before: '',
      after: '',
      sourceEndIndex: 13,
      nodes: [
        { type: 'word', sourceIndex: 8, sourceEndIndex: 9, value: '1' },
        {
          type: 'div',
          sourceIndex: 9,
          sourceEndIndex: 11,
          value: ',',
          before: '',
          after: ' '
        },
        {
          type: 'word',
          sourceIndex: 11,
          sourceEndIndex: 12,
          value: '2'
        }
      ]
    },
    {
      type: 'div',
      sourceIndex: 13,
      sourceEndIndex: 14,
      value: ',',
      before: '',
      after: ''
    },
    { type: 'word', sourceIndex: 14, sourceEndIndex: 15, value: '3' }
  ]
}

[   解析出來的 AST node ]
{ type: 'space', sourceIndex: 16, sourceEndIndex: 17, value: ' ' }

[ 100px 解析出來的 AST node ]
{ type: 'word', sourceIndex: 17, sourceEndIndex: 22, value: '100px' }

2px 100px
```

- `valueParser` 將 `add(sub(1, 2),3) 100px` 拆成三個 node：`add(sub(1, 2),3)`、` `、`100px`。
- `function` 類型的參數部分會被拆解後放到 `nodes` 中，包括參數與逗號。
  - 參數可能是另個函式呼叫的拆解。
  - 逗號的類型是 `div`。
  - 有了這個，就不用自己寫正規表示式了。
- 將 `add(sub(1, 2),3)` 換成 `2px` 的效果成功了。

## 開工！

我們先梳理一下應該做些什麼：

1. 寫計算函式。
2. 利用 `postcss` 的 `Declaration` 拿到 css 屬性值。
3. 找到 `type: 'function'` 的 node。
4. 攔截需要計算後替換的函式（`value`）。
5. 將函式參數挑出來。
   - 看看類型是不是 `function`（回到 `3.`），**最內層的函式呼叫**需先執行後替換，才能處理外層函式呼叫。
6. 將參數傳入函式中執行，獲取結果。
7. 將結果替換掉被我們攔截的函式呼叫字串。
   - `type` 改成 `word`。
   - `value` 改成運算結果。
8. 將最終 AST 轉回 css 屬性值，並還給 `postcss`。

**index.html**

```html
<link rel="stylesheet" href="./normal.css">
```

**normal.css**

```css
p {
  width: calc(add(multiply(3, 3), 2)px + 3px);
  padding: calc(multiply(add(multiply(1, 2), multiply(3, 4)), 5)px + 3px) multiply(3, 3)px;
}
```

跟「點石成金的秘術」相同的模擬情境！

**package.json**

```json
{
  "type": "module",
  "devDependencies": {
    "postcss-load-config": "^6.0.1",
    "postcss-value-parser": "^4.2.0",
    "vite": "^7.1.4"
  }
}
```

**postcss.config.js**

```js
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
```

1. 準備兩個計算函式：`add` 與 `multiply`。
2. 利用 `postcss` 的 `Declaration` 拿到 css 屬性值。
3. 找到 `type: 'function'` 的 node。
   - `if (node.type !== 'function') {return node}`。
4. 攔截需要計算後替換的函式（`value`）。
   - `if (!functions[node.value]) {return node}`。
5. 用 `extractArgs` 方法，將函式參數挑出來。
   1. 將每個參數都回到 `3.` 跑一遍，**避免參數中有函式呼叫還沒先處理**。
   2. 獲取所有參數
      1. 將所有 `,` 前的字符都拼接起來。
         - `prev + valueParser.stringify(node)`。
      2. 攔截到 `,` 時，就等於一個完整的參數被拼接完畢，此時將參數存起來。
         - `args.push(prev)`。
      3. 最後一個 `,` 後面的字符拼湊為最後一個參數，也將它存起來。
         - `args.push(last)`。
6. 將參數傳入函式中執行，獲取結果。
7. 將結果替換掉被我們攔截的函式呼叫字串。
   - `type` 改成 `word`。
   - `value` 改成運算結果。
8. 將最終 AST 轉回 css 屬性值，並還給 `postcss`。

**結果**

```shell
% npx vite build --minify false

dist/assets/index-CkZrhj5N.css  0.07 kB │ gzip: 0.07 kB

% cat ./dist/assets/index-CkZrhj5N.css
p {
  width: calc(11px + 3px);
  padding: calc(70px + 3px) 9px;
}
```

完美搞定！以上就是用 `postcss-value-parser` 來避免自己寫正規表示式的作法參考～

雖然 `postcss-value-parser` 讓我不用寫正規表示式了，但有沒有可能有個工具能直接指定我們想要攔截的函式名，就能幫我們處理這一切？下篇將分享我工作上實際使用的工具，下篇見囉～

## 補充說明

### Lightning.css

在「煉金工房的核心設施」中，我們補充介紹了 `Lightning.css`，而 `Lightning.css` 本身就內建類似 `postcss-value-parser` 的功能，他可以直接攔截某個函式呼叫：

```js
import {transform} from 'lightningcss'

const res = transform({
  minify: true,
  code: Buffer.from(`
    .foo {
      padding: add(sub(1, 2),3);
    }
  `),
  visitor: {
    Function: {
      add(funcs) {
        console.log('[ 攔截 add() ]')
        console.dir(funcs, {depth: null})
        return {raw: '0_0'}
      },
      sub(funcs) {
        console.log('[ 攔截 sub() ]')
        console.dir(funcs, {depth: null})
        return {raw: '=_='}
      },
    },
  },
})

console.log(res.code.toString())

// [ 攔截 add() ]
// {
//   name: 'add',
//   arguments: [
//     {
//       type: 'function',
//       value: {
//         name: 'sub',
//         arguments: [
//           { type: 'token', value: { type: 'number', value: 1 } },
//           { type: 'token', value: { type: 'comma' } },
//           { type: 'token', value: { type: 'number', value: 2 } }
//         ]
//       }
//     },
//     { type: 'token', value: { type: 'comma' } },
//     { type: 'token', value: { type: 'number', value: 3 } }
//   ]
// }

// .foo{padding:0_0}
```

從 console 可以看出與 `postcss-value-parser` 的結構相當類似～分享給你。

## 參考

- [煉金工房的核心設施：認識魔法熔爐 PostCSS](../1-postcss/postcss-1/index.md)
- [點石成金的秘術：正規表示式替換大法](../../2-postcss-replace/1/index.md)
- [postcss-value-parser](https://www.npmjs.com/package/postcss-value-parser)
- [lightningcss - transforms](https://lightningcss.dev/transforms.html)
