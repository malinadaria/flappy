// webpack.config.js
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const nodeExternals = require("webpack-node-externals");
module.exports = {
  target: 'node',
  externals: [nodeExternals()],
  entry: './index.js',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.node$/,
        loader: "node-loader",
      },
      {
        test: /\.css$/i,
        use: ["css-loader"],
      },
      {
        test: /\.(png|jpg|svg|gif|mp3)$/,
        use: 'file-loader',
      },
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