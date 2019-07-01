const path = require('path');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

var config = {
  mode: 'development',
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
      use: ['vue-style-loader', 'css-loader', 'less-loader', {
        loader: 'style-resources-loader',
        options: {
          patterns: path.resolve(__dirname, './src/styles/common/config.less')
        }
      }]
    }, {
      test: /\.scss$/,
      use: ['vue-style-loader', 'css-loader', 'sass-loader', {
        loader: 'style-resources-loader',
        options: {
          patterns: path.resolve(__dirname, './src/styles/common/config.scss')
        }
      }]
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
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    // 这里配置引用文件路径的别名
    alias: {
        '@components': path.resolve(__dirname, 'src/components')
    }
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