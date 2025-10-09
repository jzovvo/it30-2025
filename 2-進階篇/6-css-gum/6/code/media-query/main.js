import {Snippet} from 'css-gum'
import {dirname, join} from 'path'
import {fileURLToPath} from 'url'

const __dirname = import.meta.dirname ?? dirname(fileURLToPath(import.meta.url)) ?? ''

const BREAKPOINTS = [375, 768, 1440]
const SNIPPET_OUTPUTS = [
  join(__dirname, '.vscode/css-gum.code-snippets'),
]

Snippet.writeSnippetsToFiles(
  Snippet.genVSCodeSnippetMediaQuery({points: BREAKPOINTS}),
  SNIPPET_OUTPUTS,
)
