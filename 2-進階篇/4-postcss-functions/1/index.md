# 現成的魔法奇物：postcss-functions

一開始我們在「點石成金的秘術」中，直接寫**正規表示式**去解析 css 屬性值，以獲取函式呼叫字串，並用函式執行後的結果替換該字串。

後來覺得正規太難了，所以我們在「煉金術的精密儀器」利用 `postcss-value-parser` 將 css 屬性值解析成 **AST** 來操作，雖然不再擔心自己正規寫不好了，但函式執行並替換這件事情還是有些瑣碎。

而這篇將分享我現在工作時所用的工具：`postcss-functions`，他就是將我們原本在做的事情全部完成：

1. 獲取 css 屬性值中的函式呼叫字串。
2. 攔截需要計算後替換的函式。
3. 將參數傳入函式中執行，獲取結果。
4. 將函式返回結果替換掉被我們攔截的函式呼叫字串。

也就是說，我們只需傳給他聲明的計算函式即可～他有一個 `option` 參數，裡面就只有一個 `functions` 選項可以寫。

## 使用範例

情境都跟「點石成金的秘術」相同。

**package.json**

```json
{
  "type": "module",
  "devDependencies": {
    "postcss-functions": "^4.0.2",
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

**postcss.config.js**

```js
import postcssFunctions from 'postcss-functions'

/** @type {import('postcss-load-config').Config} */
export default {
  plugins: [
    postcssFunctions({
      functions: {
        add: (a, b) => parseFloat(a) + parseFloat(b),
        multiply: (a, b) => parseFloat(a) * parseFloat(b),
      },
    }),
  ],
}
```

沒錯，只需將聲明的計算函式傳入 `functions` 中，`postcss-functions` 就會幫我們完成我們之前做的所有事情了～

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

打包的結果跟預期的一致，是不是很簡單啊～

## 基礎篇公式替換

還記得我們最初學 `postcss` 的目標嗎？當時希望將三大公式用函式呼叫替代：

- 等比縮放：
  - 公式：`calc(設計稿上的值 / 設計稿寬度 * 100vw)`。
  - 函式呼叫： `pxToVw(設計稿上的值, 設計稿寬度)`。
- 有限的等比縮放：
  - 公式：
    - `min(設計稿上的值px, calc(設計稿上的值 / 設計稿寬度 * 100vw))`。
    - `max(設計稿上的值px, calc(設計稿上的值 / 設計稿寬度 * 100vw))`。
  - 函式呼叫： `pxToVwClamp(設計稿上的值, 設計稿寬度)`。
- 延伸固定：
  - 公式：`calc((100vw - 設計稿寬度) / 2 + (設計稿上的值))`。
  - 函式呼叫： `pxToVwExtend(設計稿上的值, 設計稿寬度)`。

此刻，我們只需將函式給實現即可，開始吧！

**index.html**

```html
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<link rel="stylesheet" href="./normal.css">
<div class="pxToVw">pxToVw</div>
<div class="pxToVwMin">pxToVwMin</div>
<div class="pxToVwMax">pxToVwMax</div>
<div class="pxToVwExtend">pxToVwExtend</div>
```

**normal.css**

```css
* {
  margin: 0;
  padding: 0;
}

.pxToVw {
  margin-left: pxToVw(50, 375);
}

.pxToVwMin {
  margin-left: pxToVwClamp(50, 375);
}

.pxToVwMax {
  margin-left: pxToVwClamp(-50, 375);
}

.pxToVwExtend {
  margin-left: pxToVwExtend(50, 375);
}
```

所有等比縮放公式都改用函式呼叫。

**postcss.config.js**

```js
import postcssFunctions from 'postcss-functions'

// [等比縮放]
// . calc(設計稿上的值 / 設計稿寬度 * 100vw)
const pxToVw = (value, designDraft) => {
  value = parseFloat(value)
  designDraft = parseFloat(designDraft)
  return `${value / designDraft * 100}vw`
}

// [有限的等比縮放]
// . value > 0: min(設計稿上的值px, calc(設計稿上的值 / 設計稿寬度 * 100vw))
// . value < 0: max(設計稿上的值px, calc(設計稿上的值 / 設計稿寬度 * 100vw))
// . value = 0: 0
const pxToVwClamp = (value, designDraft) => {
  value = parseFloat(value)
  designDraft = parseFloat(designDraft)

  if (value === 0) {
    return 0
  }

  return value > 0 ? `min(${value}px, ${pxToVw(value, designDraft)})` : `max(${value}px, ${pxToVw(value, designDraft)})`
}

// [延伸固定]
// . calc((100vw - 設計稿寬度) / 2 + (設計稿上的值))
const pxToVwExtend = (value, designDraft) => {
  value = parseFloat(value)
  designDraft = parseFloat(designDraft)

  return `calc((100vw - ${designDraft}px) / 2 + (${value}px))`
}


/** @type {import('postcss-load-config').Config} */
export default {
  plugins: [
    postcssFunctions({
      functions: {
        pxToVw,
        pxToVwClamp,
        pxToVwExtend,
      },
    }),
  ],
}
```

不論哪個公式所對應的計算函式，應該都接收兩個參數：**設計稿上的值**與**設計稿寬度**，並把公式放到返回值中，將傳入的參數套進公式中就搞定了！

**結果**

```shell
% npx vite build --minify false

dist/assets/index-DZlluprw.css  0.28 kB │ gzip: 0.15 kB

% cat ./dist/assets/index-DZlluprw.css
* {
  margin: 0;
  padding: 0;
}

.pxToVw {
  margin-left: 13.333333333333334vw;
}

.pxToVwMin {
  margin-left: min(50px, 13.333333333333334vw);
}

.pxToVwMax {
  margin-left: max(-50px, -13.333333333333334vw);
}

.pxToVwExtend {
  margin-left: calc((100vw - 375px) / 2 + (50px));
}

% npx vite preview
```

![](./assets/vw-function.gif)

當視窗小於 375 時：
- `pxToVw`、`pxToVwMin`、`pxToVwMax` 距離視窗左邊是維持相同比例的縮放。
- `pxToVwExtend` 永遠釘在原地。

當視窗大於 375 時：
- `pxToVw` 距離視窗左邊越來越遠。
- `pxToVwMin`、`pxToVwMax` 距離視窗左邊的尺寸是一樣的（數值停止增減）。
- `pxToVwExtend` 還是釘在原地。

## 小結

我們從「等比縮放公式由來」，到「函式呼叫替換公式」，這一切的分享在此刻都串起來了！

並且我們從三個層面分享「函式呼叫替換公式」完整的思路，從**正規表示式**到**AST**，到這篇的直接給 **functions** ，保證了在不依賴 `postcss` 的開發環境中，你還是能用其他工具成功應用這一套工作流。

下一篇，我們就要來將「實戰3：無痕的延伸固定之術」更新，讓我們遠離超爆長公式吧！

## 參考連結

- [魔法訓練場：vw 咒文的初次施放](../../../1-基礎篇/1-vw/4/index.md)
- [為縮放魔法設置疆界：有限的等比縮放](../../../1-基礎篇/2-minmax/2/index.md)
- [實戰3：無痕的延伸固定之術](../../../1-基礎篇/3-extension/index.md)
- [點石成金的秘術：正規表示式替換大法](../../2-postcss-replace/1/index.md)
- [煉金術的精密儀器： postcss-value-parser](../../3-postcss-value-parser/1/index.md)
- [postcss-functions](https://www.npmjs.com/package/postcss-functions)
- [postcss-value-parser](https://www.npmjs.com/package/postcss-value-parser)
