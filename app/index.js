//see https://github.com/babel/babel-loader#custom-polyfills-eg-promise-library
require('babel-runtime/core-js/promise').default = require('bluebird');

require('../common/globals');

// Start application
require('./main');

