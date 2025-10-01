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
