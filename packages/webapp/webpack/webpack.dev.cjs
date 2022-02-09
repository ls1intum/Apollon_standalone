const path = require('path');
const { merge } = require('webpack-merge');
const common = require('./webpack.common.cjs');

const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
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
    proxy: {
      '/': 'http://localhost:8080',
    },
  },

  plugins: [
    new ForkTsCheckerWebpackPlugin({
      // eslint: true,
    }),
    new ForkTsCheckerNotifierWebpackPlugin({ title: 'Apollon Standalone', excludeWarnings: false }),
  ],
});
