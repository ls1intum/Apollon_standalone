const path = require('path');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const nodeExternals = require('webpack-node-externals')

const outputDir = path.resolve(__dirname, '../../../build/server');

module.exports = {
  entry: './src/main/server.ts',
  target: 'node',
  node: {
    __dirname: false,
    __filename: false,
  },
  externals: [nodeExternals()],
  output: {
    path: outputDir,
    filename: '[name].js',
  },
  resolve: {
    // default `modules` value is `["node_modules"]`
    // we change it to resolve `underscore-lodash-wrapper`
    modules: [__dirname, 'node_modules'],
    extensions: [".ts", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?/,
        enforce: 'pre',
        use: ['tslint-loader'],
      },
      {
        test: /\.tsx?/,
        exclude: /\/node_modules\//,
        use: [
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              experimentalWatchApi: true,
              compilerOptions: {
                declaration: false,
              },
            },
          },
        ],
      },
    ],
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
  },
  plugins: [new CircularDependencyPlugin({ exclude: /node_modules/ })],
};
