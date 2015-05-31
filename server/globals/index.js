"use strict";

global._ = require('lodash');
global.$q = require('./$q');
global.$request = $q.promisify(require('request'));
global.__DEBUG = process.env.NODE_ENV == 'development';
global.moment = require('moment');
