const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const NODE_ENV = process.env.NODE_ENV || 'development'
const ENTRY = process.env.ENTRY || 'application'
const DEBUG = process.env.DEBUG || false

// Base

const webpackConfig = {
  entry: ['./src/application.ts'],
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'application.js',
    library: 'frictionlessApplication',
    libraryTarget: 'umd',
    clean: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        options: {
          transpileOnly: false,
          onlyCompileBundledFiles: true,
          compilerOptions: {
            declaration: false,
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.yaml$/,
        loader: 'yaml-loader',
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]?[hash]',
        },
      },
    ],
  },
  plugins: [
    new webpack.EnvironmentPlugin({ NODE_ENV, DEBUG }),
    new HtmlWebpackPlugin({
      favicon: 'assets/favicon.png',
      template: 'src/application.html',
    }),
  ],
}

// Development

if (NODE_ENV === 'development') {
  webpackConfig.mode = 'development'
  webpackConfig.devServer = {
    proxy: {
      '/api': {
        target: 'http://localhost:4040',
        pathRewrite: { '^/api': '' },
      },
    },
    static: './dist',
  }
}

// Testing

if (NODE_ENV === 'testing') {
  webpackConfig.mode = 'development'
}

// Production

if (NODE_ENV === 'production') {
  webpackConfig.mode = 'production'
}

// Metadata

if (ENTRY === 'metadata') {
  webpackConfig.entry = ['./src/metadata.ts']
  webpackConfig.output.filename = 'metadata.js'
  webpackConfig.output.library = 'frictionlessMetadata'
  webpackConfig.output.path = path.resolve(__dirname, 'dist/metadata')
  webpackConfig.plugins[1] = new HtmlWebpackPlugin({
    favicon: 'assets/favicon.png',
    template: 'src/metadata.html',
  })
}

module.exports = webpackConfig
