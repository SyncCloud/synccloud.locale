'use strict';

import koa from 'koa';
import mount from 'koa-mount';
import config from './config/index';
import co from 'co';
import debug from 'debug';

const app = koa();
const env = process.env.NODE_ENV || 'development';
const log = debug('synccloud:locale:http');

export default function *() {
  app.use(require('./middlewares/error-handler'));

  if (env == 'development') {
    app.use(require('koa-logger')())
  }

  app.use(mount('/api', yield require('./koa-api')));
  app.use(mount(yield require('./koa-ui')));

  app.on('error', function(err) {
    console.error(err.stack);
  });

  app.keys = config.keys;

  app.listen(config.port);
  log(`Application started on port ${config.port}`);
  if (process.send) {
    process.send('online');
  }

  return app;
};
