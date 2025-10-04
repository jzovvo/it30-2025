import postcssFunctions from 'postcss-functions'
import {Gen, Snippet} from 'css-gum'
import {join, dirname} from 'path'
import {fileURLToPath} from 'url'

const __dirname = import.meta.dirname ?? dirname(fileURLToPath(import.meta.url)) ?? ''

const draftWidthPoints = [375, 1440]
const mediaQueryPoints = [375, 768, 1440]
const snippetOutputs = [join(__dirname, '.vscode/css-gum.code-snippets')]

const {core, VSCodeSnippet} = Gen.genFuncsDraftWidth({points: draftWidthPoints})
Snippet.writeSnippetsToFiles({
  ...VSCodeSnippet,
  ...Snippet.genVSCodeSnippetMediaQuery({points: mediaQueryPoints}),
}, snippetOutputs)

/** @type {import('postcss-load-config').Config} */
export default {
  plugins: [
    postcssFunctions({
      functions: core,
    }),
  ],
}
