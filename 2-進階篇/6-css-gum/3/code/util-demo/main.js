import {Util} from 'css-gum'

console.log(Util.percent(1000)(100))    // 10
console.log(Util.cssPercent(1000)(100)) // '10%'

console.log(Util.pxToVw(1000)(100))         // 10
console.log(Util.cssPxToVw(1000)(100))      // '10vw'
console.log(Util.cssPxToVwc(1000)(100))     // 'min(100px, 10vw)'
console.log(Util.cssPxToVwc(1000)(-100))    // 'max(-100px, -10vw)'
console.log(Util.cssPxToVwe(1000)(.5)(100)) // 'calc((100vw - 1000px) * 0.5 + 100px)'

console.log(Util.cssEm(1, 20))  // '0.05em'
console.log(Util.cssLh(30, 20)) // '1.5'
