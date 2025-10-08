import {Snippet} from 'css-gum'

console.log(Snippet.genVSCodeSnippetCore())
  // {
  //   em: { prefix: 'em', body: 'em($1,$2)$0', scope: 'html,sass,stylus,css,scss,less' },
  //   lh: { prefix: 'lh', body: 'lh($1,$2)$0', scope: 'html,sass,stylus,css,scss,less' },
  //   ...
  // }

console.log(Snippet.genVSCodeSnippetCore({scope: ['c', 'd'], nameEm: 'hello', snippetPrefixEm: 'hi'}))
  // {
  //   hello: { prefix: 'hi', body: 'hello($1,$2)$0', scope: 'c,d' },
  //   lh: { prefix: 'lh', body: 'lh($1,$2)$0', scope: 'c,d' },
  //   ...
  // }

console.log(Snippet.genVSCodeSnippetDraftWidth({pointsSize:3, firstIndex: 10}))
  // {
  //   vw10: { prefix: 'vw10', body: 'vw10($1)$0', scope: 'html,sass,stylus,css,scss,less' },
  //   vw11: { prefix: 'vw11', body: 'vw11($1)$0', scope: 'html,sass,stylus,css,scss,less' },
  //   vw12: { prefix: 'vw12', body: 'vw12($1)$0', scope: 'html,sass,stylus,css,scss,less' },
  //   vwc10: { prefix: 'vwc10', body: 'vwc10($1)$0', scope: 'html,sass,stylus,css,scss,less' },
  //   ...
  // }
