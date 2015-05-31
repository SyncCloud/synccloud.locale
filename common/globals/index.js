(function (global) {
  global.$q = require('./$q');
  global.moment = require('moment');
  global._ = require('lodash');
  //see https://github.com/babel/babel-loader#custom-polyfills-eg-promise-library
  //Promise variable in transpiled files will refer to bluebird promise
  require('babel-runtime/core-js/promise').default = require('bluebird');
})(
  // Among the various tricks for obtaining a reference to the global
  // object, this seems to be the most reliable technique that does not
  // use indirect eval (which violates Content Security Policy).
  typeof global === "object" ? global :
  typeof window === "object" ? window :
  typeof self === "object" ? self : this
);
