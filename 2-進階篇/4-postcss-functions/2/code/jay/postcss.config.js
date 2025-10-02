import postcssFunctions from 'postcss-functions'

// [等比縮放]
const pxToVw = (value, designDraft) => {
  value = parseFloat(value)
  designDraft = parseFloat(designDraft)
  return `${value / designDraft * 100}vw`
}

// [有限的等比縮放]
const pxToVwClamp = (value, designDraft) => {
  value = parseFloat(value)
  designDraft = parseFloat(designDraft)

  if (value === 0) {
    return 0
  }

  return value > 0 ? `min(${value}px, ${pxToVw(value, designDraft)})` : `max(${value}px, ${pxToVw(value, designDraft)})`
}

// [延伸固定]
const pxToVwExtend = (value, designDraft) => {
  value = parseFloat(value)
  designDraft = parseFloat(designDraft)

  return `calc((100vw - ${designDraft}px) / 2 + (${value}px))`
}

const DESIGN_DRAFT1 = 375
const DESIGN_DRAFT2 = 1440

/** @type {import('postcss-load-config').Config} */
export default {
  plugins: [
    postcssFunctions({
      functions: {
        pxToVw1: (value) => pxToVw(value, DESIGN_DRAFT1),
        pxToVwClamp1: (value) => pxToVwClamp(value, DESIGN_DRAFT1),
        pxToVwExtend1: (value) => pxToVwExtend(value, DESIGN_DRAFT1),
        pxToVw2: (value) => pxToVw(value, DESIGN_DRAFT2),
        pxToVwClamp2: (value) => pxToVwClamp(value, DESIGN_DRAFT2),
        pxToVwExtend2: (value) => pxToVwExtend(value, DESIGN_DRAFT2),
      },
    }),
  ],
}
