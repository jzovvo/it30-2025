import {Gen} from 'css-gum'

const {core} = Gen.genFuncsCore({
  nameVw: 'aaa',
  nameVwe: '',
})

console.log(core.vw)  // undefined
console.log(core.aaa) // [Function: aaa]
console.log(core.aaa(10, 100)) // '10vw'

console.log(core.vwe) // undefined

console.log(core.vwc) // [Function: vwc]
console.log(core.vwc(10,100)) // 'min(10px, 10vw)'
