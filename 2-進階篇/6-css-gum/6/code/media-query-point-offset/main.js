import {Snippet} from 'css-gum'

console.log(Snippet.genVSCodeSnippetMediaQuery({points: [375], pointOffset: 1}))
// {
//   cssBracketMinP0: {
//     prefix: 'min-p0',
//     body: [ '@media (width >= 376px) {', '  $1', '}' ],
//     scope: 'css,scss,less'
//   },
//   cssBracketMaxP0: {
//     prefix: 'max-p0',
//     body: [ '@media (width < 376px) {', '  $1', '}' ],
//     scope: 'css,scss,less'
//   },
//   ...
// }
