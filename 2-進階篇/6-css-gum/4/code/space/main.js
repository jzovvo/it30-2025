import {Gen} from 'css-gum'

const {core} = Gen.genFuncsCore({
  space: 1,
})

console.log(core.vw(10,100,1).length) // 5
console.log(core.vw(10,100,0).length) // 4

console.log(core.vw(10,100).length) // 5
