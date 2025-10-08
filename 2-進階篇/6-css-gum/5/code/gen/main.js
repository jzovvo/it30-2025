import {join} from 'path'
import {Gen, Snippet} from 'css-gum'

const designDraft = [375, 1440]
const snippetOutput = [
  join(import.meta.dirname, '.vscode/css-gum.code-snippets'),
]

const nameVw = 'pxToVw'
const snippetPrefixVw = 'vw'

const funcsDraftWidth = Gen.genFuncsDraftWidth({points: designDraft, nameVw, snippetPrefixVw, scope: ['javascript']})

// const snippetConfig = {
//   ...Snippet.genVSCodeSnippetDraftWidth({pointsSize: designDraft.length, nameVw, snippetPrefixVw, scope: ['javascript']}),
// }

Snippet.writeSnippetsToFiles(funcsDraftWidth.VSCodeSnippet, snippetOutput)
