'use strict';

import fs from 'fs';
import path from 'path';

export default function (app) {
  const routesDir = path.join(__dirname, 'routes');
  let router = require('koa-router')();

  fs.readdirSync(routesDir).forEach(function (fileName) {
    if (~fileName.indexOf("js")) {
      const routerDecl = require(path.join(routesDir, fileName));
      let routerName = fileName.split('.')[0];

      if (routerName == 'index') {
        routerName = '';
      }

      for (var mountPoint in routerDecl) {
        let parts = mountPoint.split(/\s+/),
          verb = (mountPoint.match(/^(post|get|put|delete)\s+/i) || [])[1] || 'get',
          urlPath = parts.slice(-1)[0],
          url = ('/' + routerName + (urlPath ? '/' + urlPath : '')).replace(/\/+/g, '/'),
          middlewares = routerDecl[mountPoint];

        if (_.isFunction(middlewares)) {
          middlewares = [middlewares];
        }

        router[verb.toLowerCase()].apply(router, [url].concat(middlewares));
      }
    }
  });

  app.use(router.routes());
}
