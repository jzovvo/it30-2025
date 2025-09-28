# 無需學習的天賦，Vite 與生俱來的 PostCSS 魔法

以前 `webpack` 運行邏輯是在啟動時將所有文件編譯一遍，導致 `webpack` 在專案規模大時，啟動時間都超爆久。加上當時原生 `ESM` 慢慢成熟，`vite` 就此誕生，主打開發環境按需編譯（當瀏覽器遇到 import 時，vite 才編譯給他）。還有超多聰明的處理方式，例如預打包第三方依賴等，導致超爆快的極佳開發體驗而快速竄紅至今。

## vite 零設置開發

這篇不是要探討 `vite` 如何的快，畢竟我感覺現在的 `webpack` 也沒有很慢。而是想提另個主題：`vite` 零設置開發體驗，他將常見的開發情境所需的前置作業都預先處理了。

```shell
% tree -I node_modules
.
├── css
│   ├── bg.css
│   ├── color.css
│   ├── font-size100.css
│   ├── font-weight.sass
│   └── text-center.module.css
├── index.html
├── main.ts
├── package-lock.json
├── package.json
├── postcss.config.js
└── vite-env.d.ts
```

這裡有一堆 css 與 ts，以及一個 postcss 設定檔，**重點是沒有任何 vite 設定檔**。下面的程式碼都是一堆完全不重要的相互 import 文件，讓我們看看**在沒有任何 `vite` 設定檔的情況下，是否能正常運作**：

**package.json**

```json
{
  "type": "module",
  "devDependencies": {
    "sass": "^1.92.1",
    "vite": "^7.1.4"
  }
}
```

**index.html**

```html
<link rel="stylesheet" href="./css/bg.css">
<link rel="stylesheet" href="./css/font-weight.sass">
<script type="module" src="./main.ts"></script>
<p>hi :)</p>
```

**css**

```css
@import './color.css';

/* css/bg.css */
p {
  background-image: url(https://en.wikipedia.org/static/images/icons/wikipedia.png);
  background-size: auto 100%;
}
```
```css
/* css/color.css */
p {
  color: chocolate;
}
```
```css
/* css/font-size100.css */
p {
  font-size: 100px;
}
```
```scss
/* css/font-weight.sass */
p
  font-weight: 900
```
```css
/* text-center.module.css */
.textCenter {
  text-align: center;
}
```

**ts**

```ts
import './css/font-size100.css'
import style from './css/text-center.module.css'

// main.ts
const p = document.querySelector('p')
if (p) {
  p.className = style.textCenter
}
```
```ts
// vite-env.d.ts
declare module '*.module.css' {
  const classes: {[key: string]: string}
  export default classes
}

declare module '*.css'
```

- `.d.ts` 是 ts 的類型定義檔案。
  - 例如我寫的這個：告訴 `ts` 編譯器說我認識 `*.module.css`，他是個普通物件，所以 `ts` 才允許我 `import style from './css/text-center.module.css'`，並允許我 `style.textCenter`。

**postcss.config.js**

將所有註解都改成 `:)`。

```js
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
```

**見證奇蹟的時刻**

```shell
% npx vite build --minify false
# ...
dist/index.html                 0.16 kB │ gzip: 0.14 kB
dist/assets/index-bXZWRSpm.css  0.29 kB │ gzip: 0.19 kB
dist/assets/index-BSAbNoeq.js   1.35 kB │ gzip: 0.57 kB

% cat dist/assets/index-bXZWRSpm.css
/* :) */
p {
  color: chocolate;
}
/* :) */
p {
  background-image: url(https://en.wikipedia.org/static/images/icons/wikipedia.png);
  background-size: auto 100%;
}
/* :) */
p {
  font-weight: 900;
}/* :) */
p {
  font-size: 100px;
}
/* :) */
._textCenter_1e8zx_2 {
  text-align: center;
}

% npx vite preview
```

![](./assets/vite.png)

在沒有 `vite` 設定檔的情況下：

- 打包一切順利！
- 所有註解都變成 `:)`（證明 `postcss` 是有運作的）。
- 頁面與預期的完全相同。

`Vite` 預設啟用了一系列的官方插件：

- 看到 `.ts` 檔案？使用 `esbuild` 進行轉譯。
- 看到 `.sass` 或 `.less`？尋找是否已安裝 `sass` 或 `less` 編譯器，並調用它們。
- 看到 `postcss.config.js`？使用 `postcss-load-config` 載入並應用。
- ...

還記得我們在「讓 webpack 老大哥，學會使用 postcss 魔法熔爐」中，光是將編譯內容寫入指定的 css，並在 html 使用 `<link>` 引入該 css，就至少設定了三個 `loader` 嗎？（`css-loader`、`mini-css-extract-plugin`、`html-webpack-plugin`）

當然不是說 `webpack` 比較不好，只是如果臨時想測試東西，`vite` 可能方便些，因為 **`vite` 對很多格式或工具的對接處理都是內建的，包括 `postcss`。**

## 在 vite 中使用 postcss

由此可知，在 `vite` 中使用 `postcss` 幾乎不需額外的操作，只需將 `postcss` 設定完成即可，而 `vite` 中有兩個設定 `postcss` 的方式：

### postcss 設定檔

就是上面的範例，Vite 內部集成了 `postcss-load-config`，會去探詢項目根目錄是否有 `postcss` 設定檔名。

### vite 設定檔

`vite` 設定檔有個 `css.postcss` 選項，可直接將 `postcss` 設定寫在這裡，但有幾個要注意的點：

- 設置 `css.postcss` 選項後，就不會自動查找 `postcss` 設定檔，避免多個設定檔並存而導致混亂。
- `postcss` 的 `plugins` 設定有 `{}` 與 `[]` 兩種寫法，但 `vite` 設定檔中的 `css.postcss.plugins` 只能是 `[]`。
- `css.postcss` 可以設置 `string`，用來指定 `postcss` 設定檔的位置，如果你的 `postcss` 設定檔不在項目根目錄，可以在這裡指定。

**vite.config.js**

```js
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
```

將所有註解改成 `:)`。

**index.html**

```html
<link rel="stylesheet" href="./normal.css">
```

**normal.css**

```css
/* hi */
```

**package.json**

```json
{
  "type": "module",
  "devDependencies": {
    "vite": "^7.1.7"
  }
}
```

**postcss.config.js**

```js
export default {}

console.log('postcss.config.js')
```

這只是想證明，設置 `css.postcss` 後，`postcss` 的設定檔不會被執行。

**結果**

```shell
% npx vite build --minify false
vite v7.1.7 building for production...
✓ 2 modules transformed.
dist/index.html                 0.07 kB │ gzip: 0.09 kB
dist/assets/index-BevIDbve.css  0.01 kB │ gzip: 0.03 kB
✓ built in 34ms

% cat ./dist/assets/index-BevIDbve.css
/* :) */
```

- `postcss.config.js` 沒有輸出，證明 `postcss.config.js` 文件沒有被執行。
- `css` 註解變成 `:)`，證明 `postcss` 有效果。

以上就是如何在 `vite` 中使用 `postcss`～

我們已經學會如何在主流的兩個打包工具中使用 `postcss` 了。不過我其實還沒介紹 `postcss` 中最重要的 `plugins` 設定如何使用，只有稍微提及他能接受兩種寫法 `[]` 與 `{}`，下篇我們將完成 `postcss` 使用上的最後一塊重要拼圖～我們下篇見囉。

## 補充說明

### vite 處理 sass / less 等工具

vite 只幫你處理對接工具，並不內建工具本身，如果要使用 `sass` 或 `less` 等，要自己將編譯器載下來 `npm install -D sass less`。

### postcss-load-config

在「讓 webpack 老大哥，學會使用 postcss 魔法熔爐」 中，我們以類型提示的角度來看這個套件，但它主要的功能是標準化 `postcss` 設定檔，並且能自動載入設定檔。

## 參考連結

- [讓 webpack 老大哥，學會使用 postcss 魔法熔爐](../2/index.md)
