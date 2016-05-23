var webpack = require('webpack');
var WebpackDevServer = require('webpack-dev-server');
var config = require('./webpack.config');

let listenInterface;

if (process.env.NODE_ENV == 'production') {
  listenInterface = '0.0.0.0';
} else {
  listenInterface = 'localhost';
}

new WebpackDevServer(webpack(config), {
  contentBase: 'public',
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true
}).listen(3000, listenInterface, function (err, result) {
  if (err) {
    return console.log(err);
  }

  console.log('Listening at http://localhost:3000/');
});
