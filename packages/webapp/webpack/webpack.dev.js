const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  output: {
    pathinfo: false,
  },
  optimization: {
    removeAvailableModules: false,
    removeEmptyChunks: false,
  },
  devServer: {
    static: path.join(__dirname, '../../build/webapp'),
    host: '0.0.0.0',
    port: 8888,
    proxy: [
      {
        context: ['/'],
        target: 'http://localhost:8080',
      },
    ],
  },

  plugins: [
    new ForkTsCheckerWebpackPlugin({
      // eslint: true,
    }),
  ],
});
