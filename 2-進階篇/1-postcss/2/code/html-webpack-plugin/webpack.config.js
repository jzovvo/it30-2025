import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import {join} from 'path'
import HtmlWebpackPlugin from 'html-webpack-plugin'

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
  plugins: [new HtmlWebpackPlugin({template: join(import.meta.dirname, './index.html')}), new MiniCssExtractPlugin()],
}

