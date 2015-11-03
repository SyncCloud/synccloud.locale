'use strict';

import koa from 'koa';
import mount from 'koa-mount';
import co from 'co';

const app = koa();
const env = process.env.NODE_ENV || 'development';
const log = $log('synccloud:locale:http');

export default async function initKoa({conn, config}) {
  log(`initing koa server`);
  app.use(require('./middlewares/error-handler'));

  if (env == 'development') {
    app.use(require('koa-logger')())
  }

  app.use(mount('/api', await require('./koa-api')({config})));
  app.use(mount(await require('./koa-ui')({config, conn})));

  app.keys = config.keys;

  return app;
};
