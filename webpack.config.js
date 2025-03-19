const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.js$/, // Обработка JS файлов
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader', // Использование Babel
        },
      },
      {
        test: /\.css$/, // Обработка CSS файлов
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg|mp3)$/, // Обработка изображений и звуков
        use: {
          loader: 'file-loader',
          options: {
            name: 'assets/[name].[hash].[ext]',
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html', // Шаблон HTML в src
    }),
  ],
  devServer: {
    static: path.join(__dirname, 'dist'), // Заменили contentBase на static
    compress: true,
    port: 9000,
  },
};
