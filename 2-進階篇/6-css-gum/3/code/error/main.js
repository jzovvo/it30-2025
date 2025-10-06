import {Core, Util} from 'css-gum'

console.log(Core.percent('aa', 1000)) // ''
  // [css-gum error] percent(aa,1000,0)
  // child expected number, received aa (type: string)

console.log(Core.percent(1000, 'aa', 2)) // ''
  // [css-gum error] percent(1000,aa,2)
  // parent expected number, received aa (type: string)
  // [css-gum error] percent(1000,aa,2)
  // space expected 1 | 0, received 2 (type: number)

console.log(Util.percent('aa')(10)) // NaN
