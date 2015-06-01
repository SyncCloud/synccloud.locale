'use strict';

// Tell `require` calls to look into `/app` also
// it will avoid `../../../../../` require strings
process.env.NODE_PATH = 'app';
require('module').Module._initPaths();

require('../common/globals');
require('./globals');

// Install `babel` hook for ES6
require('babel/register')({
  stage: 1
});

var co = require('co');

module.exports = $q.props({
  http: co(require('./koa')),
  mongo: co(require('./db'))
});
