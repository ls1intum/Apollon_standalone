var path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/main/server.ts',
  target: 'node',
  mode: 'production',
  devtool: 'inline-source-map',
  node: {
    __dirname: true,
  },
  output: {
    path: path.resolve(__dirname, '../../../build/server/'),
    filename: 'bundle.js',
  },
  resolve: {
    extensions: ['.ts', '.js'], //resolve all the modules other than index.ts
  },
  module: {
    rules: [
      {
        use: 'ts-loader',
        test: /\.ts?$/,
      },
      {
        use: 'node-loader',
        test: /\.node$/,
      },
    ],
  },
  externals: [nodeExternals({ allowlist: ['canvas'] })],
};
