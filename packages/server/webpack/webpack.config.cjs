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
    filename: 'bundle.cjs',
  },
  resolve: {
    extensions: ['.ts', '.js'], //resolve all the modules other than index.ts
    fullySpecified: false, // allow extensionless ESM imports from dependencies
  },
  module: {
    rules: [
      {
        // Force CommonJS parsing for Apollon ES5 output despite package type=module.
        test: /node_modules[\\/]+@ls1intum[\\/]+apollon[\\/]+lib[\\/]es5[\\/].*\.js$/,
        type: 'javascript/auto',
      },
      {
        test: /\.m?js$/,
        resolve: {
          fullySpecified: false,
        },
      },
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
  externals: {
    canvas: 'commonjs ./canvas/canvas',
    'utf-8-validate': 'utf-8-validate',
  },
  ignoreWarnings: [
    {
      message: /Critical dependency: the request of a dependency is an expression/,
    },
  ],
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../node_modules/canvas/build/Release'),
          to: 'canvas',
          noErrorOnMissing: true,
        },
        {
          from: path.resolve(__dirname, '../node_modules/jsdom/lib/jsdom/browser'),
          to: 'node_modules/jsdom/lib/jsdom/browser',
          noErrorOnMissing: true,
        },
      ],
    }),
  ],
};
