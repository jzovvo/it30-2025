# 魔法訓練場：vw 咒文的初次施放

在「等比縮放的詠唱咒語：設計稿上的值 / 設計稿寬度 * 100vw」與「將咒語刻印在網頁上：CSS calc()」兩篇中，我們推導出了一個重要的公式，希望大家都能理解了，不理解至少也都背起來了！

在開始前，我們先複習一次公式：

> `calc( 設計稿上的值 / 設計稿寬度 * 100vw )`

這篇我將分享如何將設計稿上的數值寫進網站中。

## 公式應用

有了這個公式之後，其實只要將設計稿的數值填入公式中，等比縮放設計稿到網頁中其實就實現了。

### 電腦版練習

![](./assets/teach-desk.png)

這邊有一張 `1440px` 的設計稿，我們直接觀察歌詞的部分：

- `width: 690px` 也就是 `width: calc(690 / 1440 * 100vw);`。
- `font-size: 28px` 也就是 `font-size: calc(28 / 1440 * 100vw);`。
- 視窗上下間距為 `padding: 50px` 也就是 `padding: calc(50 / 1440 * 100vw);`。

**程式碼**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    /* 簡單的 css reset */
    * {
      margin: 0;
      padding: 0;
      border: 0;
      box-sizing: border-box;
    }

    body {
      padding: calc(50 / 1440 * 100vw) 0;
    }

    .txt {
      font-size: calc(28 / 1440 * 100vw);
    }

    .box {
      width: calc(690 / 1440 * 100vw);
      margin: auto;
      background: orange; /* 為了方便觀察 */
    }

    #info {
      width: max-content;
      margin: auto;
    }
    </style>
</head>
<body>
  <div class="txt box">一堆字</div>

  <!-- 下面這些方便觀察而已 -->
  <div id="info"></div>
  <script>
    const domInfo = document.querySelector('#info')
    const domBox = document.querySelector('.box')

    const updateInfo = () => {
      const style = getComputedStyle(domBox)
      const fontSize = style.fontSize
      const boxWidth = style.width
      const bodyPadding = getComputedStyle(document.body).padding

      domInfo.innerHTML = `
        <p>body padding: ${bodyPadding}</p>
        <p>box font-size: ${fontSize}</p>
        <p>box width: ${boxWidth}</p>
      `
    }

    window.addEventListener('resize', updateInfo)
    updateInfo()
  </script>
</body>
</html>
```

**結果**

![](./assets/teach-desk.gif)

- 視窗寬度為 `1440px` 的時候，所有數值都跟預期的相同。
- 視窗寬度放大或縮小時，整體的數值也都跟著等比例放大或縮小，完全達到我們想要的效果！

### 手機版練習

![](./assets/teach-mob.png)

接著這邊有一張 `375px` 的設計稿，我們一樣直接觀察歌詞的部分：

- `width: 335px` 也就是 `width: calc(335 / 375 * 100vw);`。
- `font-size: 14px` 也就是 `font-size: calc(14 / 375 * 100vw);`。
- 視窗上下間距為 `padding: 30px` 也就是 `padding: calc(30 / 375 * 100vw);`。

我平常習慣在視窗為 `767px` 以下的時候換設計稿，所以就有了以下的修改：

**程式碼修改**

```html
<style>
  /** 完整版在最下面 */
  @media (width < 768px) {
    body {
      padding: calc(30 / 375 * 100vw) 0;
    }

    .txt {
      font-size: calc(14 / 375 * 100vw);
    }

    .box {
      width: calc(335 / 375 * 100vw);
    }
  }
</style>
```

**結果**

![](./assets/teach-mob.gif)

- 視窗寬度在 `767px` 以下時，所有數值都變成手機版的設定了。
- 所有數值都有跟著視窗寬度等比例縮放。
- 視窗寬度為 `375px` 的時候，所有數值也都跟預期的一模一樣。

以上就是如何將公式運用到設計稿中，其實就是將 css 的屬性值都改成公式，並將設計稿的數值填入公式即可，希望大家都能理解～我真心覺得這個做法讓切版變得很簡單😃。

下篇我們將迎來這個系列第一次的實戰：將第一天的設計稿等比縮放實踐～敬請期待！

## 參考連結

- [等比縮放的詠唱咒語: 設計稿上的值 / 設計稿寬度 * 100vw](../2/index.md)
- [將咒語刻印在網頁上：CSS calc()](../3/index.md)

## 最終程式碼

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * {
      margin: 0;
      padding: 0;
      border: 0;
      box-sizing: border-box;
    }

    body {
      padding: calc(50 / 1440 * 100vw) 0;
    }

    .txt {
      font-size: calc(28 / 1440 * 100vw);
    }

    .box {
      width: calc(690 / 1440 * 100vw);
      margin: auto;
      background: orange;
    }

    #info {
      width: max-content;
      margin: auto;
    }

    @media (width < 768px) {
      body {
        padding: calc(30 / 375 * 100vw) 0;
      }

      .txt {
        font-size: calc(14 / 375 * 100vw);
      }

      .box {
        width: calc(335 / 375 * 100vw);
      }
    }
    </style>
</head>
<body>
  <div class="txt box">一堆字</div>

  <div id="info"></div>
  <script>
    const domInfo = document.querySelector('#info')
    const domBox = document.querySelector('.box')

    const updateInfo = () => {
      const style = getComputedStyle(domBox)
      const fontSize = style.fontSize
      const boxWidth = style.width
      const bodyPadding = getComputedStyle(document.body).padding

      domInfo.innerHTML = `
        <p>body padding: ${bodyPadding}</p>
        <p>box font-size: ${fontSize}</p>
        <p>box width: ${boxWidth}</p>
      `
    }

    window.addEventListener('resize', updateInfo)
    updateInfo()
  </script>
</body>
</html>
```
