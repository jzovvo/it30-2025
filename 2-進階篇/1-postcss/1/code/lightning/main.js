import fs from 'fs'
import {transform} from 'lightningcss'

fs.readFile('./normal.css', (err, data) => {
  if (err) {
    console.error(err)
    return
  }

  const {code} = transform({
    filename: './normal.css',
    code: data,
    visitor: {
      Declaration(decl) {
        if (decl.property === 'color') {
          return {
            ...decl,
            value: {
              type: 'rgb',
              r: 210,
              g: 105,
              b: 30,
              alpha: 1,
            },
          }
        }
      },
    },
  })

  console.log(code.toString())
    // @keyframes aaa {
    //   0% {
    //     color: #d2691e;
    //   }

    //   100% {
    //     color: #d2691e;
    //   }
    // }

    // .apple {
    //   color: #d2691e;
    //   font-size: 100px;
    // }
})
