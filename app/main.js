'use strict';

import iso from 'iso';
import React from 'react';
import Router from 'react-router';
import alt from 'utils/alt';
import ProjectActions from 'actions/project';

const routes = require('routes');

if (__DEBUG) {
  require('debug').enable('*');
}

iso.bootstrap((initialState, __, container) => {
  alt.bootstrap(initialState);
  Router.run(
    routes,
    Router.HistoryLocation,
    (Handler, state) => {
      if (state.path.match(/\/project/)) {
        ProjectActions.changeProject(state.params.id);
      }
      React.render(React.createElement(Handler, {}), container);
    }
  );
});
