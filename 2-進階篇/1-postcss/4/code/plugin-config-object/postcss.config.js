import {dirname, join} from 'path'
import {fileURLToPath} from 'url'

const __dirname = import.meta.dirname ?? dirname(fileURLToPath(import.meta.url)) ?? ''
const myPluginPath = join(__dirname, './plugin/my-plugin.js')

/** @type {import('postcss-load-config').Config} */
export default {
  plugins: {
    [myPluginPath]: {
      hi: ':)',
      hello: ':))',
    },
  },
}
