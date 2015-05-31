'use strict';

// Tell `require` calls to look into `/app` also
// it will avoid `../../../../../` require strings
process.env.NODE_PATH = 'app';
require('module').Module._initPaths();

// Install `babel` hook for ES6
require('babel/register')({
  stage: 1
});

require('./globals');

module.exports = $q.props({
  http: require('./koa'),
  mongo: require('./db')
});
