'use strict';

/* jscs:disable requireCamelCaseOrUpperCaseIdentifiers */
/* eslint camelcase: 0 */

require('babel-core/register');

var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

var writeStats = require('./utils/write-stats');

// clean `.tmp` && `dist`
require('./utils/clean-dist')();

module.exports = {
  devtool: 'source-map',
  entry: {
    app: './app/index.js'
  },
  output: {
    path: path.join(__dirname, '../dist'),
    filename: '[name]-[chunkhash].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: '/assets/'
  },
  module: {
    //preLoaders: [
    //  {
    //    test: /\.js$|.jsx$/,
    //    exclude: /node_modules/,
    //    loaders: ['eslint', 'jscs']
    //  }
    //],
    loaders: [
      {
        test: /\.json$/,
        loader: 'json'
      },
      { test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "url-loader?limit=10000&minetype=application/font-woff" },
      { test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/, loader: "file-loader" },
      {
        test: /\.(jpe?g|png|gif)$/,
        loader: 'url?limit=10000&name=[sha512:hash:base64:7].[ext]!image?optimizationLevel=7&progressive&interlaced'
      },
      {
        // the optional 'runtime' transformer tells babel to require the runtime
        // instead of inlining it.
        test: /\.js$|.jsx$/,
        exclude: /node_modules/,
        loader: 'babel?optional[]=runtime&stage=1'
      },
      {
        test: /\.less/,
        loader: ExtractTextPlugin.extract('style', 'css!autoprefixer?browsers=last 2 version!less')
      }
    ]
  },
  plugins: [

    // extract css
    new ExtractTextPlugin('[name]-[chunkhash].css'),

    // set env
    new webpack.DefinePlugin({
      __BROWSER: JSON.stringify(true),
      __DEBUG: JSON.stringify(false)
    }),
    new webpack.ProvidePlugin({
      '_': 'lodash',
      'moment': 'moment'
    }),
    // optimizations
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false,
        screw_ie8: true,
        sequences: true,
        dead_code: true,
        drop_debugger: true,
        comparisons: true,
        conditionals: true,
        evaluate: true,
        booleans: true,
        loops: true,
        unused: true,
        hoist_funs: true,
        if_return: true,
        join_vars: true,
        cascade: true,
        drop_console: true
      },
      output: {
        comments: false
      }
    }),

    // write webpack stats
    function () { this.plugin('done', writeStats); }

  ],
  resolve: {
    extensions: ['', '.js', '.json', '.jsx'],
    modulesDirectories: ['node_modules', 'app']
  }
};
