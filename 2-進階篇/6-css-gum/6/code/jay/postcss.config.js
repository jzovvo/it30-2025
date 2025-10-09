import postcssFunctions from 'postcss-functions'
import {Gen, Snippet} from 'css-gum'
import {dirname, join} from 'path'
import {fileURLToPath} from 'url'

const __dirname = import.meta.dirname ?? dirname(fileURLToPath(import.meta.url)) ?? ''

const DESIGN_DRAFTS = [375, 1440]
const SNIPPET_OUTPUTS = [
  join(__dirname, '.vscode/css-gum.code-snippets'),
]

const {core, VSCodeSnippet} = Gen.genFuncsDraftWidth({
  points: DESIGN_DRAFTS,
  space: 1,
  firstIndex: 1,
  nameVw: 'pxToVw',
  nameVwc: 'pxToVwClamp',
  nameVwe: 'pxToVwExtend',
})

Snippet.writeSnippetsToFiles({
  ...VSCodeSnippet,
}, SNIPPET_OUTPUTS)

/** @type {import('postcss-load-config').Config} */
export default {
  plugins: [
    postcssFunctions({
      functions: core,
    }),
  ],
}
