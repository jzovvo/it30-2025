import {Core} from 'css-gum'

console.log(Core.vw(100, 1000))  // 10vw
console.log(Core.vwe(100, 1000)) // calc((100vw - 1000px) * 0.5 + 100px)
console.log(Core.vwe(100, 1000, 1)) // calc((100vw - 1000px) * 1 + 100px)
console.log(Core.vwc(100, 1000)) // min(100px, 10vw)
console.log(Core.vwc(-100, 1000)) // max(-100px, -10vw)

console.log(Core.percent(100, 1000)) // 10%
console.log(Core.em(35, 20)) // 1.75em
console.log(Core.lh(35, 20)) // 1.75
