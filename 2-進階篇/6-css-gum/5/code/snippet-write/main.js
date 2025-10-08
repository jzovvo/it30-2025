import {Snippet} from 'css-gum'
import {join} from 'path'

const snippetOutput = [
  join(import.meta.dirname, '.vscode/css-gum.code-snippets'),
]

const snippetConfig = {
  ...Snippet.genVSCodeSnippetDraftWidth({pointsSize: 2, scope: ['javascript']}),
  ...Snippet.genVSCodeSnippetCore({scope: ['javascript']}),
}

Snippet.writeSnippetsToFiles(snippetConfig, snippetOutput)
