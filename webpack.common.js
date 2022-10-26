const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.join(__dirname, '/dist'),
    filename: '[name]-[chunkhash].bundle.js',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: ['babel-loader'],
      },
      {
        test: /\.png$/i,
        use: 'file-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js'],
    modules: [
      path.resolve('./src'),
      path.resolve('./node_modules'),
    ],
  },
  performance: {
    hints: false
  },
  plugins: [
    new HtmlWebpackPlugin({ template: './public/index.html' }),
  ],
};
