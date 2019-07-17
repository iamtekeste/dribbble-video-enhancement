'use strict';
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  stats: 'errors-only',
  entry: {
    content: './source/content',
    background: './source/background',
    inject: './source/inject'
  },
  output: {
    path: path.join(__dirname, 'distribution'),
    filename: '[name].js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
    ]
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: '*',
        context: 'source',
        ignore: '*.js'
      },
      {
        from: 'style/*',
        context: 'source'
      }
    ])
  ],
  devtool: 'cheap-module-source-map'
};
