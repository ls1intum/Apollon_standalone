var path = require('path');

module.exports = {
  entry: './src/main/server.ts',
  target: "node",
  devtool: 'inline-source-map',
  output: {
    path: path.resolve(__dirname, '../../../build/server/src/main/test'),
    filename: 'bundle.js'
  },
  resolve: {
    extensions: ['.ts', '.js'] //resolve all the modules other than index.ts
  },
  module: {
    rules: [
      {
        use: 'ts-loader',
        test: /\.ts?$/
      }
    ]
  },
}
