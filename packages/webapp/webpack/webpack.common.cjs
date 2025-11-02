const path = require('path');
const webpack = require('webpack');
const CircularDependencyPlugin = require('circular-dependency-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');

const outputDir = path.resolve(__dirname, '../../../build/webapp');

module.exports = {
  entry: './src/main/index.tsx',
  experiments: { outputModule: true },
  target: 'browserslist',
  output: {
    path: outputDir,
    filename: '[name].js',
    module: true,
    environment: {
      module: true,
      arrowFunction: true,
      const: true,
      destructuring: true,
      dynamicImport: true,
      forOf: true,
      optionalChaining: true,
      templateLiteral: true
  }
  },
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.tsx'],
    fullySpecified: false,
    mainFields: ['browser', 'module', 'main']
  },
  performance: {
    hints: false,
  },
  module: {
    rules: [
      {
        test: /\.m?js$/,
        type: 'javascript/auto',
        resolve: {
          fullySpecified: false,
        },
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
      {
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      },
    ],
  },
  optimization: {
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        defaultVendors: {
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
      scriptLoading: 'module'
    }),
    new CopyPlugin({
      patterns: [
        {
          from: 'assets',
          to: outputDir,
        },
      ],
    }),
    new webpack.DefinePlugin({
      'process.env.APPLICATION_SERVER_VERSION': JSON.stringify(process.env.APPLICATION_SERVER_VERSION || true),
      'process.env.DEPLOYMENT_URL': JSON.stringify(process.env.DEPLOYMENT_URL || 'http://localhost:8080'),
      'process.env.POSTHOG_HOST': JSON.stringify(process.env.POSTHOG_HOST || null),
      'process.env.POSTHOG_KEY': JSON.stringify(process.env.POSTHOG_KEY || null),
    }),
  ],
};
