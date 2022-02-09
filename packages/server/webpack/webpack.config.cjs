var path = require('path');
const CopyPlugin = require('copy-webpack-plugin');
const ResolveTypeScriptPlugin = require("resolve-typescript-plugin");


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
    plugins: [new ResolveTypeScriptPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
      },
    ],
  },
  externals: {
    canvas: 'commonjs ./canvas/canvas',
    bufferutil: 'bufferutil',
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
