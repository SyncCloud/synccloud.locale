import React from 'react';
import Router from 'react-router';
import routes from 'routes';
import fs from 'fs';
import path from 'path';
import alt from 'utils/alt';
import iso from 'iso';
import ItemModel from '../models/item';
import debug from 'debug';

export default function *react() {
  const handler = yield $q((resolve) => {
    Router.run(routes, this.request.url, (handler) => {
      resolve(handler);
    });
  });
  const projects = yield ItemModel.getProjects();
  let itemsByProject = {};
  let localesByProject = {};

  for (let pr of projects) {
    itemsByProject[pr] = yield  ItemModel.find({project: pr}).then(_).call('invoke', 'toJSON').call('value');
    localesByProject[pr] = ['en', 'ru'];
  }

  console.log('%j', itemsByProject);

  alt.bootstrap(JSON.stringify({
    ProjectStore: {itemsByProject, localesByProject},
    UserStore: {user: _.assign({isLoggedIn: this.isAuthenticated()}, this.req.user)}
  }));

  const html = iso.render(React.renderToString(React.createElement(handler)), alt.takeSnapshot());
  alt.flush();

  let assets;
  if (__DEBUG) {
    assets = JSON.parse(fs.readFileSync(path.join(__dirname, '../webpack-stats.json')))
  } else {
    assets = require('../webpack-stats.json');
  }

  debug('dev')('return html content');
  this.render('main', {html, assets});
}
