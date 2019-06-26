const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
let webpackBaseConfig = require('./webpack.dev.js');
const Webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WebpackMerge = require('webpack-merge');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

webpackBaseConfig.plugins = [];
webpackBaseConfig.module.rules[1] = {
  test: /\.less$/,
  use: ExtractTextPlugin.extract({  //将less抽取到公共css文件中
    use: ['css-loader', 'less-loader', {
      loader: 'style-resources-loader',
      options: {
        patterns: path.resolve(__dirname, './src/styles/common/*.less')
      }
    }],
    fallback: 'vue-style-loader'
  })
}

module.exports = WebpackMerge(webpackBaseConfig, {
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[hash].js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'title',
      template: 'index.html',
      favicon: path.resolve('favicon.ico')
    }),
    new VueLoaderPlugin(),
    new ExtractTextPlugin("main.css"),
    new OptimizeCssAssetsPlugin(), //压缩css
  ]
});