var path = require('path');
const CopyPlugin = require('copy-webpack-plugin');

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
    ],
  },
  externals: {
    canvas: 'commonjs ./canvas/canvas',
    'utf-8-validate': 'utf-8-validate',
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: '../../node_modules/canvas/build/Release/',
          to: 'canvas',
        },
      ],
    }),
  ],
};
