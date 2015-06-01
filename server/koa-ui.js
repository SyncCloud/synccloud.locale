'use strict';

import path from 'path';

import koa from 'koa';
import staticCache from 'koa-static-cache';
import mount from 'koa-mount';
import jade from 'koa-jade';
import session from 'koa-generic-session';
import MongoStore from 'koa-generic-session-mongo';
import bodyParser from 'koa-bodyparser';
import config from './config/index';
import passport from './config/passport';
import favicon from 'koa-favicon';

const app = koa();

app.keys = config.keys;

if (__DEBUG) {
  var webpackConfig: Object = require('./../webpack/dev.config');
  app.use(mount('/dist', require('koa-proxy')({ host: `http://localhost:${webpackConfig.server.port}` })));
} else {
  app.use(mount('/assets', staticCache(path.join(__dirname, '../dist'), {maxAge: 86400000, gzip: true})))
}

export default function* () {
  //we need initialize db before mongo store
  const conn = yield require('./db');

  return app
    .use(session({store: new MongoStore({db: conn.db})}))
    .use(bodyParser())
    .use(passport.initialize())
    .use(passport.session())
    .use(favicon(path.join(__dirname, '../app/images/favicon.ico')))
    .use(jade.middleware({
      viewPath: __dirname + '/views',
      debug: false,
      pretty: false,
      compileDebug: false
    }))
    .use(mount('/api', require('./routes/api').routes()))
    .use(require('./routes/ui').routes())
    .use(require('./middlewares/react'));
}
