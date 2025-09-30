const g = /\w+/g
const str = 'ab~cd'

console.log(g.exec(str)) // [ 'ab', index: 0 ]
console.log(g.exec(str)) // [ 'cd', index: 3 ]
console.log(g.exec(str)) // null

const noG = /\w+/

console.log(noG.exec(str)) // [ 'ab', index: 0 ]
console.log(noG.exec(str)) // [ 'ab', index: 0 ]
console.log(noG.exec(str)) // [ 'ab', index: 0 ]
