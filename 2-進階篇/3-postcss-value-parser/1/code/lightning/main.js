import {transform} from 'lightningcss'

const res = transform({
  minify: true,
  code: Buffer.from(`
    .foo {
      padding: add(sub(1, 2),3);
    }
  `),
  visitor: {
    Function: {
      add(funcs) {
        console.log('[ 攔截 add() ]')
        console.dir(funcs, {depth: null})
        return {raw: '0_0'}
      },
      sub(funcs) {
        console.log('[ 攔截 sub() ]')
        console.dir(funcs, {depth: null})
        return {raw: '=_='}
      },
    },
  },
})

console.log(res.code.toString())

// [ 攔截 add() ]
// {
//   name: 'add',
//   arguments: [
//     {
//       type: 'function',
//       value: {
//         name: 'sub',
//         arguments: [
//           { type: 'token', value: { type: 'number', value: 1 } },
//           { type: 'token', value: { type: 'comma' } },
//           { type: 'token', value: { type: 'number', value: 2 } }
//         ]
//       }
//     },
//     { type: 'token', value: { type: 'comma' } },
//     { type: 'token', value: { type: 'number', value: 3 } }
//   ]
// }

// .foo{padding:0_0}
