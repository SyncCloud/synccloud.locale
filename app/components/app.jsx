'use strict';

import React from 'react';
import {RouteHandler, Navigation} from 'react-router';
import UserStore from 'stores/user';
import ProjectStore from 'stores/project';
import ListenerMixin from 'alt/mixins/ListenerMixin';

const getState = () => {
  return {user: UserStore.getState().user};
};

export default React.createClass({
  mixins: [ListenerMixin, Navigation],

  componentDidMount() {
    if (!this.state.user.isLoggedIn) {
      this.transitionTo('/login');
    }
    this.listenTo(UserStore, this._onUserChange);
  },

  _onUserChange() {
    this.setState(getState());
    if (this.state.user.isLoggedIn) {
      this.transitionTo('/');
    }
  },

  getInitialState() {
    return getState();
  },

  render() {
    return (
      <RouteHandler />
    );
  }
});
