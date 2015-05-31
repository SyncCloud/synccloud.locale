'use strict';

// disable `no-unused-vars` rule
/* eslint no-unused-vars: 0 */
import React from 'react';
import {Route, DefaultRoute, NotFoundRoute} from 'react-router';
import App from './components/app';
import Login from './components/login';
import ProjectPage from './components/project-page';

export default (
  <Route name="app" path="/" handler={App}>
    <Route name="login" handler={Login} />
    <Route name="project" path='project/:id' handler={ProjectPage} />
    <DefaultRoute handler={ProjectPage} />
    <NotFoundRoute handler={require('./pages/not-found')} />
  </Route>
);
