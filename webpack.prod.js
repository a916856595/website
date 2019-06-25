var path = require('path');
var VueLoaderPlugin = require('vue-loader/lib/plugin');
var Webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var WebpackMerge = require('webpack-merge');
var webpackBaseConfig = require('./webpack.dev.js');
var UglifyJsPlugin = require('uglifyjs-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

webpackBaseConfig.plugins = [];
// webpackBaseConfig.module.rules[1] = {
//   test: /\.less$/,
//   use: ExtractTextPlugin.extract({  //将less抽取到公共css文件中
//     use: ['css-loader', 'less-loader', {
//       loader: 'sass-resources-loader',
//       options: {
//         resources: [
//             path.resolve(__dirname, './src/styles/common/common.less'), //定义全局变量的文件路径 
//         ]
//       }
//     }],
//     fallback: 'vue-style-loader'
//   })
// }

module.exports = WebpackMerge(webpackBaseConfig, {
  output: {
    path: path.join(__dirname, 'dist'),
    filename: '[name].[hash].js'
  },
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
          uglifyOptions: {
              compress: false
          }
      })
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'title',
      template: 'index.html',
      favicon: path.resolve('favicon.ico')
    }),
    new VueLoaderPlugin(),
    new ExtractTextPlugin("main.css")
  ]
});