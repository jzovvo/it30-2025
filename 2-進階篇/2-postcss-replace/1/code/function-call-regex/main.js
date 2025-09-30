const functionCallRegex = /(\w+)\(([^()]*)\)/g
const str = 'add(1,2) sub(3,add(4,5)) add()'

console.log(functionCallRegex.exec(str)) // ['add(1,2)', 'add', '1,2', index: 0]
console.log(functionCallRegex.exec(str)) // ['add(4,5)', 'add', '4,5', index: 15]
console.log(functionCallRegex.exec(str)) // ['add()', 'add', '', index: 25]
console.log(functionCallRegex.exec(str)) // null
