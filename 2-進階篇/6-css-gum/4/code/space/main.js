import {Gen} from 'css-gum'

const Core = Gen.genFuncsCore({
  space: 1,
}).core

console.log(Core.vw(10,100,1).length) // 5
console.log(Core.vw(10,100,0).length) // 4

console.log(Core.vw(10,100).length) // 5
