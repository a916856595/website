var path = require('path');
var VueLoaderPlugin = require('vue-loader/lib/plugin');
var HtmlWebpackPlugin = require('html-webpack-plugin');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var config = {
  devtool: 'cheap-module-source-map',
  entry: {
    main: path.join(__dirname, 'main.js')
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'main.js'
  },
  module: {
    rules: [{
      test: /\.css$/,
      use: ExtractTextPlugin.extract({
        use: 'css-loader',
        fallback: 'style-loader'
      })
    },{
      test: /\.less$/,
      use: ['style-loader', 'css-loader', 'less-loader']  //这里为了能热更新less不抽取到公共css
    }, {
      test: /\.vue$/,
      loader: 'vue-loader',
      options: {   //此选项将.vue中的css提取到style标签中
        extractCSS: true,
        loaders: {
          css: ExtractTextPlugin.extract({
            use: 'css-loader',
            fallback: 'vue-style-loader',
            publicPath: '../'
          })
        }
      }
    }, {
      test: /\.js$/,
      loader: 'babel-loader',
      exclude: /node_modules/
    }, {
      test: /\.(gif|jpg|png)\??.*$/,
      loader: 'url-loader?limit=1024'
    }, {
      test: /\.(woff|woff2|svg|eot|ttf)\??.*$/,
      loader: 'file-loader'
    }]
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      template : path.join(__dirname, "index.html"),
      filename : 'index.html',
      favicon: 'favicon.ico'
    }),
    new ExtractTextPlugin("main.css")
  ]
};

module.exports = config;