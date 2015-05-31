'use strict';

import koa from 'koa';
import mount from 'koa-mount';
import config from './config/index';
import co from 'co';

const app = koa();
const env = process.env.NODE_ENV || 'development';

app.use(require('./middlewares/error-handler'));
if (env == 'development') {
  app.use(require('koa-logger')())
}

app.use(mount('/api', require('./koa-api')));
app.use(mount(require('./koa-ui')));

app.on('error', function(err){
  log.error('server error', err);
});

app.keys = config.keys;

app.listen(config.port);
console.log(`Application started on port ${config.port}`);
if (process.send) {
  process.send('online');
}

export default app;
