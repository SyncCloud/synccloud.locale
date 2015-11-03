"use strict";

global.$request = require('bluebird').promisify(require('request'));
global.$log = require('./$log');
global.__DEBUG = process.env.NODE_ENV == 'development';
global.__BROWSER = false;
