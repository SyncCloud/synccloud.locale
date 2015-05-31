"use strict";

global.$request = require('bluebird').promisify(require('request'));
global.__DEBUG = process.env.NODE_ENV == 'development';
global.__BROWSER = false;
