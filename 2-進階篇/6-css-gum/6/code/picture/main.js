import {Snippet} from 'css-gum'
import {dirname, join} from 'path'
import {fileURLToPath} from 'url'

const __dirname = import.meta.dirname ?? dirname(fileURLToPath(import.meta.url)) ?? ''

const BREAKPOINTS = [375, 768, 1440]
const SNIPPET_OUTPUTS = [
  join(__dirname, '.vscode/css-gum.code-snippets'),
]

Snippet.writeSnippetsToFiles(
  Snippet.genVSCodeSnippetPicture({
    points: BREAKPOINTS.slice(1, BREAKPOINTS.length),
    pointOffset: -1,
  }),
  SNIPPET_OUTPUTS,
)
