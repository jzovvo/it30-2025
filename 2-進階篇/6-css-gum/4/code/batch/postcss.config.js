import postcssFunctions from 'postcss-functions'
import {Gen} from 'css-gum'

/** @type {import('postcss-load-config').Config} */
export default {
  plugins: [
    postcssFunctions({
      functions: Gen.genFuncsDraftWidth({
        points: [375, 1440],
        space: 1,
        firstIndex: 1,
        nameVw: 'pxToVw',
        nameVwc: 'pxToVwClamp',
        nameVwe: 'pxToVwExtend',
      }).core,
    }),
  ],
}
