import postcssFunctions from 'postcss-functions'
import tailwindcss from '@tailwindcss/postcss'
import {Gen, Snippet, Config} from 'css-gum'
import {dirname, join} from 'path'
import {fileURLToPath} from 'url'

const __dirname = import.meta.dirname ?? dirname(fileURLToPath(import.meta.url)) ?? ''

const DESIGN_DRAFTS = [375, 1440]
const BREAKPOINTS = [375, 768, 1440]
const SNIPPET_OUTPUTS = [
  join(__dirname, '.vscode/css-gum.code-snippets'),
]

const TAILWIND_CONFIG_OUTPUTS = [
  join(__dirname, 'css/_breakpoint.css'),
]

const {core, VSCodeSnippet} = Gen.genFuncsDraftWidth({
  points: DESIGN_DRAFTS,
  space: 1,
})

Snippet.writeSnippetsToFiles({
  ...VSCodeSnippet,
  ...Snippet.genVSCodeSnippetMediaQuery({points: BREAKPOINTS}),
  ...Snippet.genVSCodeSnippetPicture({
    points: BREAKPOINTS.slice(1, BREAKPOINTS.length),
    pointOffset: -1,
  }),
}, SNIPPET_OUTPUTS)

Config.writeConfigToFiles(
  Config.genTailwindBreakpointConfig({points: BREAKPOINTS}),
  TAILWIND_CONFIG_OUTPUTS,
)

/** @type {import('postcss-load-config').Config} */
export default {
  plugins: [
    postcssFunctions({
      functions: {
        ...core,
      },
    }),
    tailwindcss(),
  ],
}
