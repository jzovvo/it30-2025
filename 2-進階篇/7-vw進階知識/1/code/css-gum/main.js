import {Util, Core, Gen, Snippet} from 'css-gum'

console.log(Util.cssPxToDvw(100)(10)) // 10dvw
console.log(Util.cssPxToSvw(100)(10)) // 10svw
console.log(Util.cssPxToLvw(100)(10)) // 10lvw
console.log(Util.cssPxToVh(100)(10))  // 10vh
console.log(Util.cssPxToDvh(100)(10)) // 10dvh
// ...

console.log(Core.dvh(10,100)) // 10dvh
console.log(Core.dvw(10,100)) // 10dvw
// ...

console.log(Gen.genFuncsDraftWidth({points:[375]}).core)
  // {
  //   vw0: [Function (anonymous)],
  //   dvw0: [Function (anonymous)],
  //   lvw0: [Function (anonymous)],
  //   svw0: [Function (anonymous)],
  //   vwc0: [Function (anonymous)],
  //   dvwc0: [Function (anonymous)],
  //   lvwc0: [Function (anonymous)],
  //   svwc0: [Function (anonymous)],
  //   vwe0: [Function (anonymous)],
  //   dvwe0: [Function (anonymous)],
  //   lvwe0: [Function (anonymous)],
  //   svwe0: [Function (anonymous)]
  // }

console.log(Gen.genFuncsDraftHeight({points:[375]}).core)
  // {
  //   vh0: [Function (anonymous)],
  //   dvh0: [Function (anonymous)],
  //   lvh0: [Function (anonymous)],
  //   svh0: [Function (anonymous)],
  //   vhc0: [Function (anonymous)],
  //   dvhc0: [Function (anonymous)],
  //   lvhc0: [Function (anonymous)],
  //   svhc0: [Function (anonymous)],
  //   vhe0: [Function (anonymous)],
  //   dvhe0: [Function (anonymous)],
  //   lvhe0: [Function (anonymous)],
  //   svhe0: [Function (anonymous)]
  // }

console.log(Snippet.genVSCodeSnippetDraftWidth({pointsSize:1}))
  // {
  //   vw0: {
  //     prefix: 'vw0',
  //     body: 'vw0($1)$0',
  //     scope: 'html,sass,stylus,css,scss,less'
  //   },
  //   dvw0: {/* ... */},
  //   lvw0: {/* ... */},
  //   svw0: {/* ... */},
  //   vwc0: {/* ... */},
  //   dvwc0: {/* ... */},
  //   lvwc0: {/* ... */},
  //   svwc0: {/* ... */},
  //   vwe0: {/* ... */},
  //   dvwe0: {/* ... */},
  //   lvwe0: {/* ... */},
  //   svwe0: {/* ... */}
  // }

console.log(Snippet.genVSCodeSnippetDraftHeight({pointsSize:1}))

  // {
  //   vh0: {
  //     prefix: 'vh0',
  //     body: 'vh0($1)$0',
  //     scope: 'html,sass,stylus,css,scss,less'
  //   },
  //   dvh0: {/* ... */},
  //   lvh0: {/* ... */},
  //   svh0: {/* ... */},
  //   vhc0: {/* ... */},
  //   dvhc0: {/* ... */},
  //   lvhc0: {/* ... */},
  //   svhc0: {/* ... */},
  //   vhe0: {/* ... */},
  //   dvhe0: {/* ... */},
  //   lvhe0: {/* ... */},
  //   svhe0: {/* ... */}
  // }
