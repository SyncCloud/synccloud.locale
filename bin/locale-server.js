// Tell `require` calls to look into `/app` also
// it will avoid `../../../../../` require strings
process.env.NODE_PATH = 'app';
require('module').Module._initPaths();

require('../common/globals');
require('./globals');

require('babel-core/register');

var cluster = require('cluster');

if (cluster.isMaster) {
  require('../server/master');
} else {
  require('../server/worker');
}
