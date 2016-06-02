var path = require('path');
var webpack = require('webpack');
var WebpackTmuxStatus = require('webpack-tmux-status');

module.exports = {
  devtool: 'eval',
  entry: [
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
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
    new webpack.HotModuleReplacementPlugin(),
    new WebpackTmuxStatus(),
    new webpack.DefinePlugin({
      ELASTICSEARCH_BASE: '"http://0.0.0.0:9200"',
    }),
  ],
  module: {
    loaders: [{
      test: /\.jsx?$/,
      loaders: ['react-hot', 'babel'],
      include: path.join(__dirname, 'app')
    }]
  }
};
