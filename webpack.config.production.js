var path = require('path');
var webpack = require('webpack');
var WebpackTmuxStatus = require('webpack-tmux-status');

module.exports = {
  entry: [
    './app/index'
  ],
  resolve: {
    root: [
      __dirname,
    ],
    extensions: [
      '',
      '.js',
      '.jsx',
    ]
  },
  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/public/'
  },
  plugins: [
    new webpack.DefinePlugin({
      ELASTICSEARCH_BASE: 'http://admin.caciviclab.org/elasticsearch',
    }),
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: ['babel'],
      include: path.join(__dirname, 'app')
    }]
  }
};
