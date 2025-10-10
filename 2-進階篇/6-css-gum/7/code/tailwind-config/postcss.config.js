import tailwindcss from '@tailwindcss/postcss'
import {Config} from 'css-gum'
import {dirname, join} from 'path'
import {fileURLToPath} from 'url'

const __dirname = import.meta.dirname ?? dirname(fileURLToPath(import.meta.url)) ?? ''

const BREAKPOINTS = [375, 768, 1440]
const TAILWIND_CONFIG_OUTPUTS = [
  join(__dirname, 'css/_breakpoint.css'),
]

const tailwindBreakpointConfig = Config.genTailwindBreakpointConfig({points: BREAKPOINTS})
console.log(tailwindBreakpointConfig)
  // @theme {
  //   --breakpoint-p0: 375px;
  //   --breakpoint-p1: 768px;
  //   --breakpoint-p2: 1440px;
  // }

Config.writeConfigToFiles(tailwindBreakpointConfig,TAILWIND_CONFIG_OUTPUTS)

/** @type {import('postcss-load-config').Config} */
export default {
  plugins: [
    tailwindcss(),
  ],
}
