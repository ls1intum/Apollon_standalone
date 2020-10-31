const path = require('path');
const webpack = require('webpack');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const outputDir = path.resolve(__dirname, '../../../build/webapp');

module.exports = {
  entry: './src/main/index.tsx',
  output: {
    path: outputDir,
    filename: '[name].js',
    library: 'apollon',
    libraryTarget: 'umd',
  },
  resolve: {
    extensions: ['.js', '.ts', '.tsx'],
  },
  performance: {
    hints: false,
  },
  module: {
    rules: [
      {
        test: /\.tsx?/,
        enforce: 'pre',
        use: ['tslint-loader', 'stylelint-custom-processor-loader'],
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
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
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
  plugins: [
    new CircularDependencyPlugin({ exclude: /node_modules/ }),
    new HtmlWebpackPlugin({
      template: './src/main/index.html',
      favicon: './assets/images/favicon.ico',
      xhtml: true,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'assets',
          to: outputDir,
        },
      ],
    }),
    new webpack.HashedModuleIdsPlugin(),
    new webpack.DefinePlugin({
      'process.env.APPLICATION_SERVER_VERSION': JSON.stringify(process.env.APPLICATION_SERVER_VERSION || true),
      'process.env.DEPLOYMENT_URL': JSON.stringify(process.env.DEPLOYMENT_URL || 'http://localhost:8888'),
    }),
  ],
};
