import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import {join} from 'path'

export default {
  entry: join(import.meta.dirname, './src/index.js'),
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader'],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
}
