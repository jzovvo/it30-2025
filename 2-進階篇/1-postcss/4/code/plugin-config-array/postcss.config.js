import myPlugin from './plugin/my-plugin.js'

/** @type {import('postcss-load-config').Config} */
export default {
  plugins: [
    myPlugin,
    myPlugin({hello: ':))'}),
  ],
}
