const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { dirname } = require('path');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const PurgecssPlugin = require('purgecss-webpack-plugin');
const glob = require('glob');

const PATHS = {
  src: path.join(__dirname, 'src')
}

module.exports = {
  // webpack will take the files from ./src/index
  entry: {
    main: [
      //'./src/css/tailwind.css',
      //'./src/lib/tools',
      './src/index.tsx'
    ]
  },
  // and output it into /dist as bundle.js
  output: {
    path: path.join(__dirname, '/dist'),
    filename: 'index.js',
    libraryTarget: 'umd',
    library: 'ReactTemplate',
    publicPath: path.join(__dirname, '/dist'),
    libraryExport: 'default'
  },
  optimization:{
    splitChunks: {
      /*
      cacheGroups: {
        styles: {
          name: 'styles',
          test: /\.css$/,
          chunks: 'all',
          enforce: true
        }
      },
      */
      chunks: 'all'
    },
  },
  // adding .ts and .tsx to resolve.extensions will help babel look for .ts and .tsx files to transpile
  resolve: {
    extensions: ['.ts', '.tsx', '.js'],
    modules: [
      path.resolve(__dirname, 'node_modules'),
      path.resolve(__dirname, '../node/modules'),
      'node_modules'
    ]
  },
  externals:{
    // Use external version of React
    'react': 'react',
  },
  module: {
    rules: [
      // we use babel-loader to load our jsx and tsx files
    {
      test: /\.(ts|js)x?$/,
      exclude: /node_modules/,
      use: [
        {
          loader: 'babel-loader',
          options:{
            "presets": [
              "@babel/preset-env",
              "@babel/preset-typescript",
              "@babel/preset-react"
            ],
            "plugins": [
              "@babel/proposal-class-properties",
              "@babel/proposal-object-rest-spread"
            ]
          }
        },
        {
          loader:'ts-loader'
        }
      ],
    },
    // css-loader to bundle all the css files into one file and style-loader to add all the styles  inside the style tag of the document
    {
      test: /\.css$/,
      use: [
        'style-loader',
        MiniCssExtractPlugin.loader,
        { loader: 'css-loader', options: { importLoaders: 1 } },
        {
          loader: 'postcss-loader',
          options:{
            config:{
              path: path.join(__dirname,'postcss.config.js')
            }
          }
        }
      ]
      
    },
    {
      test: /\.(png|svg|jpg|jpeg|gif|ico)$/,
      exclude: /node_modules/,
      use: ['file-loader?name=[name].[ext]'] // ?name=[name].[ext] is only necessary to preserve the original file name
    }
  ]
},
/*
devServer: {
  historyApiFallback: true,
  contentBase: path.join(__dirname, 'dist'),
  compress: true,
  port: 9000 
},
*/
plugins: [
  /*
  new HtmlWebpackPlugin({
    template: './public/index.html',
    favicon: './public/favicon.ico'
  }),
  */
  new MiniCssExtractPlugin({
    filename: 'styles.css'

  }),
  new PurgecssPlugin({
      paths: glob.sync(`${PATHS.src}/**/*`,  { nodir: true }),
  }),
 ]
};