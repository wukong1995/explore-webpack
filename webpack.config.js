const path = require('path')
const webpack = require('webpack')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require("copy-webpack-plugin")
const MyPlugin = require('./my_plugin')

module.exports = {
  // mode: 'development',
  mode: 'production',
  entry: {
    index: './src/index.js',
    // detail: './src/detail.js',
  },
  output: {
    filename: '[name].[contenthash].js',
    path: path.resolve(__dirname, 'dist')
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader']
      },
    ]
  },
  plugins: [
    // new webpack.HashedModuleIdsPlugin(),
    // new MiniCssExtractPlugin({
    //   filename: '[name].[contenthash:8].css',
    //   chunkFilename: '[name].[contenthash:8].chunk.css'
    // })
    new MyPlugin(),
    new CopyWebpackPlugin( [
        path.resolve(__dirname, "source")
      ],
    )
  ],
}