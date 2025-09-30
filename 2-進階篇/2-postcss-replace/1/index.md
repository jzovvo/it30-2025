# 點石成金的秘術：正規表示式替換大法

充分理解 `postcss` 使用方法後，我們就能開始嘗試解決最初的目標：「在 css 屬性值寫函式呼叫，並將函式運算後，用結果替換函式呼叫的字串」。

我們先梳理一下應該做些什麼：

1. 寫計算函式。
2. 利用 `postcss` 的 `Declaration` 拿到 css 屬性值。
3. 將長得像函式呼叫的字串挑出來。
4. 將函式名挑出來，並攔截需要計算後替換的函式。
5. 將函式參數挑出來。
6. 將參數傳入函式中執行，獲取結果。
7. 將結果替換掉被我們攔截的函式呼叫字串。
8. 查找**同一個屬性值**還有沒有其他長得像函式呼叫的字串（回到 `3.`）。
9. 將結果還給 `postcss` 處理。
   - 他發現有值被修改時，會拿修改後的值，再次執行 `Declaration`（回到 `2.`）。
     - 這是 `postcss` 的特性，可參考「煉金工房的核心設施」的介紹。
     - 此時原本不符合我們匹配條件的函式呼叫字串，經過上一輪的替換後，可能就符合條件而被我們挑出來了。
   - 最終所有符合條件的函式呼叫字串都會被執行後的結果替換。

## 無法避免的正規表示式

從梳理的流程中可知，我們需要從屬性值中挑出符合特定規則的字符，無可避免的必須使用正規表示式，但篇幅無法完整介紹正規表示式，我們只能換個方式：直接將正規表示式寫出來，儘量解釋其中每個部分的作用，如果看不懂也沒關係，只需知道**這個正規表示式可以將「長得像函式呼叫的字串」與「函式參數」挑出來**就行了！

```js
const functionCallRegex = /(\w+)\(([^()]*)\)/g
const str = 'add(1,2) sub(3,add(4,5)) add()'

console.log(functionCallRegex.exec(str)) // ['add(1,2)', 'add', '1,2', index: 0]
console.log(functionCallRegex.exec(str)) // ['add(4,5)', 'add', '4,5', index: 15]
console.log(functionCallRegex.exec(str)) // ['add()', 'add', '', index: 25]
console.log(functionCallRegex.exec(str)) // null
```

正規表示式是用一堆具有特殊意義的字符去描述一套字符規則，用字符規則去匹配字串中是否有符合規則的部分。

在 `js` 中，`/xxx/` 為正規表示式的意思，而我以 **`/(\w+)\(([^()]*)\)/g`** 來描述函式呼叫的字符規則，並使用 `exec` 方法來匹配 `'add(1,2) sub(3,add(4,5)) add()'`。以下我儘量解釋規則的每個部分含義：

**`(\w+)`**

- `\w`：
  - 一組英數字的縮寫，包含 `a-z`、`A-Z`、`0-9`、`_`。
  - 當匹配的字符是這串英數字的其中一個時，就符合規則。
- `+`：
  - 正規表示式中有匹配個數的概念，而 `+` 表示**匹配 1 個字符以上**。
    - `/\w/.exec('ab~c')` 的匹配結果是 `['a']`：沒有任何個數的符號，所以只匹配 1 個字符 `a`。
    - `/\w+/.exec('ab~c')` 的匹配結果是 `['ab']`：`+` 表示匹配 1 個字符以上，在 `~` 之前的字符都符合 `\w` 規則，所以匹配結果為 `ab`。
- `()`：
  - 有分組的意思：當匹配成功後，會將該組字符提取出來。
  - 在範例中，`exec` 輸出結果的 `add` 就是因為 `(\w+)` 分組而將 `add(1,2)`、`add(4,5)`、`add()` 前面的英數字提取出來所致。
- 整體來說 `(\w+)` 就是**用來提取函式名稱**，函式名需要：
  - 英數字，所以使用 `\w` 規則。
  - 至少有 1 個字符，所以使用 `+`。

**`\(([^()]*)\)`**

- `\(` 與 `\)`：
  - 由於 `(` 與 `)` 在正規表示式中有特殊意義，但函式呼叫需要匹配到 `()`，所以就需要跳脫字符。
    - 所謂跳脫字符就是在特殊意義的字符前面加一個 `\`，告訴編譯器這個字符是單純的字符，沒有特殊意義。
    - 例如在 `""` 中使用 `"`，也會需要跳脫字符（`console.log("\"")`）。
  - 所以 `\(` 與 `\)` 的意思是：
    - 當遇到 `(` 時，會匹配 `\(` 規則。
    - 當遇到 `)` 時，會匹配 `\)` 規則。
  - 整體來說就是**表示函式呼叫**。
- `([^()]*)`：
  - `[^()]`：
    - `[]` 是列舉的意思，例如 `\w` 就等於 `[a-zA-Z0-9_]`。
    - 所以 `[()]` 的意思是：我**需要**匹配 `(` 或 `)` 字符。
    - `[]` 前面加 `^` 表示**不需要**的意思，所以 `[^()]` 是匹配除了 `()` 以外的字符。
  - `*`：
    - 表示**匹配 0 個字符以上**，當沒有字符匹配規則時，會返回 `''` 而非匹配失敗。
      - `/\w+/.exec('~')` 的結果是 `null`，因為 `+` 至少要匹配 1 個字符，而 `~` 不符合 `\w`。
      - `/\w*/.exec('~')` 的結果是 `['']`，因為 `*` 即使沒有字符匹配也算匹配成功而返回 `''`。
  - 最前面的 `(` 與最後面的 `)`：
    - 分組的意思。
    - 在範例中，`exec` 輸出結果的 `'1,2'`、`'4,5'`、`''` 就是因為這個分組而取得的。
  - 整體來說就是**用來提取函式參數**，沒有參數是正常的，所以使用 `*`。

**`g`**

- `global` 的意思，表示每次匹配成功後，都可**從上次匹配完的地方繼續往下匹配**。
  ```js
  const g = /\w+/g
  const str = 'ab~cd'

  console.log(g.exec(str)) // [ 'ab', index: 0 ]
  console.log(g.exec(str)) // [ 'cd', index: 3 ]
  console.log(g.exec(str)) // null

  const noG = /\w+/

  console.log(noG.exec(str)) // [ 'ab', index: 0 ]
  console.log(noG.exec(str)) // [ 'ab', index: 0 ]
  console.log(noG.exec(str)) // [ 'ab', index: 0 ]
  ```
  - 正規表示式匹配成功時，都會紀錄 `index`：表示這次結果是從第幾個字符開始匹配的。
  - 沒有 `g` 的 `index` 每次都是 `0`，表示重頭匹配。
- 總結來說就是**用來找到字串中的所有函式呼叫**。

**sub**

由於 `sub` 沒有匹配成功，我們以匹配 `sub` 的角度來理解整個匹配過程：

1. 在匹配完 `add(1,2)` 後，下次 `exec` 從後面的空格開始找。
2. 找符合 `\w+` 的字符：找到 `sub` 後，遇到 `(` 而停下。
3. `\(` 匹配到 `sub` 後面的 `(`。
4. 開始找符合 `([^()]*)` 的字符：找到 `3,add` 後，遇到 `(` 而停下。
5. `([^()]*)` 的下一個規則是 `\)`，但是遇到的是 `(`，所以整個匹配失敗。
6. 開始找下一個符合 `\w+` 的字符。
7. ...

這其實是刻意設計的，為的是讓函式執行從內而外逐個執行後替換，例如：
1. `sub(3,add(4,5))` 的 `add(4,5)` 替換成 `9` 後。
2. `postcss` 會拿 `sub(3,9)` 再來執行 `Declaration`，此時 `sub` 也能被匹配成功而執行後替換。


以上就是整個 `/(\w+)\(([^()]*)\)/g` 的解釋，正規表示式對於像我這種似懂非懂的人來說都很難了，所以我實在也不知道怎麼讓完全沒接觸過的人看懂 😦。如果你完全看不懂也真的沒關係，你只要知道一個結論：

> `/(\w+)\(([^()]*)\)/g` 可以找到字串中所有**最內層**的函式呼叫，並拿到函式名與函式參數。

## 開工！

**package.json**

```json
{
  "type": "module",
  "devDependencies": {
    "postcss-load-config": "^6.0.1",
    "vite": "^7.1.4"
  }
}
```

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

有點複雜的函式呼叫，我們的目標是把 `add` 跟 `multiply` 給執行後替換！

**postcss.config.js**

```js
const myPlugin = function (functions = {}) {
  const functionCallRegex = /(\w+)\(([^()]*)\)/g

  return {
    postcssPlugin: 'my-plugin',
    Declaration: (decl) => {
      let newValue = decl.value
      let match

      console.log(`[ 處理 ${decl.prop}: ${decl.value} ]`)

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
```

1. 準備兩個計算函式：`add` 與 `multiply`。
2. 利用 `postcss` 的 `Declaration` 拿到 css 屬性值。
3. 透過 `/(\w+)\(([^()]*)\)/g.exec` 將長得像函式呼叫的字串挑出來。
4. 透過 `(\w+)` 將函式名挑出來，並攔截 `add` 或 `multiply`。
5. 透過 `([^()]*)` 將函式參數挑出來。
6. 將參數傳入函式中執行，獲取結果。
7. 將結果替換掉被我們攔截的函式呼叫字串。
   - `newValue = newValue.replace(fullMatch, result)`
8. 利用 `while` 持續對**同一個屬性值** `exec`，查找並替換所有**最內層的函式呼叫字串**（回到 `3.`）。
9. 將結果還給 `postcss` 處理，下一輪 `Declaration` 再更新替換後的 css 屬性值（回到 `2.`）。
   - `decl.value = newValue`
   - 直到所有符合條件的函式呼叫字串都被執行後替換而結束。

**結果**

```shell
% npx vite build --minify false
[ 處理 width: calc(add(multiply(3, 3), 2)px + 3px) ]
替換 multiply(3, 3) 為 9!
[ 處理 padding: calc(multiply(add(multiply(1, 2), multiply(3, 4)), 5)px + 3px) multiply(3, 3)px ]
替換 multiply(1, 2) 為 2!
替換 multiply(3, 4) 為 12!
替換 multiply(3, 3) 為 9!
[ 處理 width: calc(add(9, 2)px + 3px) ]
替換 add(9, 2) 為 11!
[ 處理 padding: calc(multiply(add(2, 12), 5)px + 3px) 9px ]
替換 add(2, 12) 為 14!
[ 處理 width: calc(11px + 3px) ]
我沒有要攔截 calc 函式!
[ 處理 padding: calc(multiply(14, 5)px + 3px) 9px ]
替換 multiply(14, 5) 為 70!
[ 處理 padding: calc(70px + 3px) 9px ]
我沒有要攔截 calc 函式!

# ...
dist/assets/index-CkZrhj5N.css  0.07 kB │ gzip: 0.07 kB

% cat ./dist/assets/index-CkZrhj5N.css
p {
  width: calc(11px + 3px);
  padding: calc(70px + 3px) 9px;
}
```

我們直接觀察 `width` 的處理過程：

1. `Declaration` 拿到 `calc(add(multiply(3, 3), 2)px + 3px)`
   - `multiply(3, 3)` 匹配成功。
   - 替換為 `9`（3 * 3 = 9）。
2. `Declaration` 再次執行，拿到 `calc(add(9, 2)px + 3px)`
   - `1.` 將 `multiply(3, 3)` 替換成 `9` 了，所以 `add(9, 2)` 就能匹配成功。
   - 替換為 `11`（9 + 2 = 11）。
3. `Declaration` 再次執行，拿到 `calc(11px + 3px)`。
   - `calc` 匹配成功，但我們沒有攔截 `calc`。
   - 沒有其他字串匹配成功，`width` 更新完成。

以上就是整個處理過程！希望大家能理解我到底在幹嘛～如果無法理解也沒關係，這篇只是想讓大家清楚整個替換過程，要完美寫出沒有破綻的正規表示式是相當困難的，例如 `/(\w+)\(([^()]*)\)/g` 遇到 `add("(")` 就匹配失敗。我在實際工作中都用別人寫好的工具，所以接下來將陸續分享好用的工具給大家，明天見囉～

## 參考連結

- [煉金工房的核心設施：認識魔法熔爐 PostCSS](../1-postcss/postcss-1/index.md)
