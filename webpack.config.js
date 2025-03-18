// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const nodeExternals = require("webpack-node-externals");
module.exports = {
  target: 'node',
  externals: [nodeExternals()],
  entry: './index.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.node$/,
        loader: "node-loader",
      },
      {test: /.txt$/, use: 'raw-loader'},
      {test: /\.css$/, use: 'raw-loader'},
      {
        test: /\.(png|jpg|svg|gif|mp3)$/,
        use: ['file-loader'],
      },
      {
        test: /\.wav$/,
        use: [
          {
            loader: 'file-loader',
            options: {
              name: './sound/[name].[ext]',  // путь и имя файла
            }
          }
        ]
      }
    ],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: './index.html',
    }),
  ],

  devServer: {
    static: {
      directory: path.join(__dirname, 'dist'), // Каталог для статики
    },
    open: true, // Автоматически открывать браузер
  },

  mode: 'development', // Режим сборки
  // Additional configuration goes here
};