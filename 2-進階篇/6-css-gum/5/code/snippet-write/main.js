import {Snippet} from 'css-gum'
import {dirname, join} from 'path'
import {fileURLToPath} from 'url'

const __dirname = import.meta.dirname ?? dirname(fileURLToPath(import.meta.url)) ?? ''
const snippetOutput = [
  join(__dirname, '.vscode/css-gum.code-snippets'),
]

const snippetConfig = {
  ...Snippet.genVSCodeSnippetDraftWidth({pointsSize: 2, scope: ['javascript']}),
  ...Snippet.genVSCodeSnippetCore({scope: ['javascript']}),
}

Snippet.writeSnippetsToFiles(snippetConfig, snippetOutput)
