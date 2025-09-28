# 煉金術的兩種配方：PostCSS 插件的配置模式

我不段重複 `plugins` 是 `postcss` 最重要的設定，並在「無需學習的天賦，Vite 與生俱來的 PostCSS 魔法」提到：**`plugins` 設定接受兩種寫法：`[]` 與 `{}`**，這篇將分享這兩種寫法的使用方式，為方便觀察效果，我們先寫幾個檔案：

**plugin/my-plugin.js**

```js
const plugin = (opt = {hi: ':)'}) => {
  return {
    postcssPlugin: 'my-plugin',
    Comment: comment => comment.text = opt[comment.text] ?? comment.text,
  }
}

plugin.postcss = true

export default plugin
```

當註解文字是我想攔截的內容時，替換成對應的字串。

**index.html**

```html
<style>
  /* hi */
  /* hello */
  /* world */
</style>
```

即將被我修改的 css 註解。

## `[]`

接收三種參數：

- **插件設定物件**：
  - 格式：`plugins: [{ postcssPlugin: '??' }]`。
- **插件函式**：
  - 格式：`plugins: [postcssPlugin]`。
  - 說明：
    - **插件函式一定要加上 `.postcss = true`**。
    - `postcss` 會在內部執行該函式，以獲取插件設定物件。
- **npm 包名**或**插件絕對路徑**（僅限 webpack）：
  - 格式：`plugins: ['npm 包名', '/xxx/plugin.js']`。
  - 說明：
    - 在 `postcss-load-config` 中明確寫著 `When using an {Array}, make sure to require() each plugin`，也就是不支持 `string[]`。
    - 但在 `postcss-loader` 官方文件中可以找到這種寫法，因為 `postcss-loader` 的設定檔獲取機制是自己寫的，不是用 `postcss-load-config`，當解析到插件為字串時，會嘗試 `require()` 該字串來讀取內容，所以當**傳入 npm 包名時，會去 `node_modules` 查找**。

**postcss.config.js**

```js
import myPlugin from './plugin/my-plugin.js'

/** @type {import('postcss-load-config').Config} */
export default {
  plugins: [
    myPlugin,
    myPlugin({hello: ':))'}),
  ],
}
```

- `plugin`：
  - 插件函式：`postcss` 會自動執行該函式，此時 `opt` 為預設值 `{hi: ':)'}`。
  - 預期結果：當註解為 `hi` 時，改為 `:)`。
- `plugin({hello: ':))'})`：
  - 插件設定物件：執行了插件函式，所以傳入 `plugins` 的是返回的插件設定物件。
  - 預期結果：當註解為 `hello` 時，改為 `:))`。

**結果**

```shell
% npx vite build && cat dist/index.html
# ...
dist/index.html  0.05 kB │ gzip: 0.05 kB

<style>
  /* :) */
  /* :)) */
  /* world */
</style>
```

- `hi` 變成 `:)`。
- `hello` 變成 `:))`。

## {}

- `key`：**npm 包名**或**插件絕對路徑**。
  - 官方文件寫著支持相對於設定檔的相對路徑，但相對路徑其實經常出問題，一律建議寫絕對路徑。
    - `the key can be a Node.js module name, a path to a JavaScript file that is relative to the directory of the PostCSS config file, or an absolute path to a JavaScript file.`
- `value`：傳給插件的參數。
  - 如果設置 `boolean`，表示啟用或不啟用插件的意思，不會將 `boolean` 傳入插件中。

**postcss.config.js**

```js
import {dirname, join} from 'path'
import {fileURLToPath} from 'url'

const __dirname = import.meta.dirname ?? dirname(fileURLToPath(import.meta.url)) ?? ''
const myPluginPath = join(__dirname, './plugin/my-plugin.js')

/** @type {import('postcss-load-config').Config} */
export default {
  plugins: {
    [myPluginPath]: {
      hi: ':)',
      hello: ':))',
    },
  },
}
```

**結果**

```shell
% npx vite build && cat dist/index.html
# ...
dist/index.html  0.05 kB │ gzip: 0.05 kB

<style>
  /* :) */
  /* :)) */
  /* world */
</style>
```

- `hi` 變成 `:)`。
- `hello` 變成 `:))`。

#### webpack `string[]`

為了版面的簡潔，就不額外寫完整的 `webpack` 範例了，有興趣可到「讓 webpack 老大哥，學會使用 postcss 魔法熔爐」中拿該篇的範例來改～

```js
import {dirname, join} from 'path'
import {fileURLToPath} from 'url'

const __dirname = import.meta.dirname ?? dirname(fileURLToPath(import.meta.url)) ?? ''
const myPluginPath = join(__dirname, './plugin/my-plugin.js')

/** @type {import('postcss-load-config').Config} */
export default {
  plugins: [
    myPluginPath,
  ],
}
```

總之，這樣寫在 `webpack + postcss-loader` 是可行的。

## 小結

以上就是 `plugins` 兩種寫法的具體使用方式，**我個人推薦 `[]`，因為 array 的執行順序較為穩定可控**。

我們經歷了一段漫長的 `postcss` 分享後，大概知道 `postcss` 的使用方式了，下篇我們將開始嘗試解決最初的目標：「在 css 屬性值寫函式呼叫，並將函式運算後，用結果替換函式呼叫的字串」，下篇見囉～

## 補充說明

### postcss-loader 處理 `string[]`

上面提到 `postcss-loader` 支持 `string[]` 來動態載入插件，這邊補充相關程式碼片段讓你參考～

```js
function loadPlugin(plugin, options, file) {
  try {
    let loadedPlugin = require(plugin);

    if (loadedPlugin.default) {
      loadedPlugin = loadedPlugin.default;
    }

    if (!options || Object.keys(options).length === 0) {
      return loadedPlugin;
    }

    return loadedPlugin(options);
  } catch (error) {
    throw new Error(
      `Loading PostCSS "${plugin}" plugin failed: ${error.message}\n\n(@${file})`,
    );
  }
}

// ...

if (typeof plugin === "string") {
  return loadPlugin(plugin, options, file);
}
```

當插件為字串時，他會試著 `require()` 來用。

### `{}` 啟用與否

不論在 `postcss-load-config` 或是 `postcss-loader` 中，都會將 `{}` 值為 `false` 的 `key` 給移除，而不是執行該插件後傳入 `false`。

**`postcss-loader` 程式碼片段**

```js
if (Array.isArray(config.plugins)) {
  list = config.plugins.filter(Boolean)
} else {
  list = Object.entries(config.plugins)
    .filter(([, options]) => {
      return options !== false
    })
    .map(([plugin, options]) => {
      return load(plugin, options, file)
    })
  list = await Promise.all(list)
}
```

**`postcss-load-config` 程式碼片段**

```js
const objectPlugins = Object.entries(plugins);

for (const [name, options] of objectPlugins) {
  if (options === false) {
    listOfPlugins.delete(name);
  } else {
    listOfPlugins.set(name, options);
  }
}
```

### `{}` 的執行順序

`{}` 在內部使用 `Object.entries(plugins)` 依序執行（可參考「`{}` 啟用與否」的程式碼片段），雖說大部分情況下都會依既定的排序規則，但非常有可能在某個運行環境不是這樣，~~此時也只能問天問地問 safari 😃~~。

另外補充冷知識：`Object.entries`、`Object.keys`、`Object.value` 的既定排序規則：

1. key 是 `number`：按數值大小排在最前面。
2. key 是 `string`：按寫入順序排在數字後面。
3. key 是 `Symbol`：
   - `Object.entries`、`Object.keys`、`Object.value` 都會排除非字串類型的 key，所以 `Symbol` 不會被列在裡面。
   - 可以用 `Reflect.ownKeys()` 來獲取所有 key，而 `Symbol` 會按寫入順序排在字串後面。

```js
const obj = {
  b: {},
  [Symbol(2)]: {},
  2: {},
  a: {},
  [Symbol(1)]: {},
  c: {},
  1: {},
}

console.log(
  Object.keys(obj),
    // ['1', '2', 'b', 'a', 'c']
  Reflect.ownKeys(obj),
    // ['1', '2', 'b', 'a', 'c', Symbol(2), Symbol(1)]
)
```

## 參考連結

- [讓 webpack 老大哥，學會使用 postcss 魔法熔爐](../2/index.md)
- [無需學習的天賦，Vite 與生俱來的 PostCSS 魔法](../3/index.md)
- [postcss-loader](https://github.com/webpack-contrib/postcss-loader/tree/master)
- [postcss-load-config](https://github.com/postcss/postcss-load-config)
