'use strict';

import React from 'react';
import UserStore from 'stores/user';
import UserActions from 'actions/user';
import ListenerMixin from 'alt/mixins/ListenerMixin';
import {Panel, Input, ButtonInput} from 'react-bootstrap';

if (__BROWSER) {
  require('styles/login.less');
}

const getState = () => {
  return {user: UserStore.getState().user};
};

export default React.createClass({
  mixins: [ListenerMixin],

  componentDidMount() {
    this.listenTo(UserStore, this._onUserChange);
  },
  _onUserChange() {
    this.setState(getState());
  },
  getInitialState() {
    return getState();
  },
  _onSubmit(e) {
    e.preventDefault();
    UserActions.doLogin({
      username: this.refs.username.getValue(),
      password: this.refs.password.getValue()
    });
    return false;
  },
  render() {
    let user = this.state.user;
    if (user.isPending) {
      return (
        <div>Waiting</div>
      )
    } else {
      return (
        <div className='login'>
          <Panel className='login__panel'>
            <form className='login__form' onSubmit={this._onSubmit}>
              <Input type="text" label="username" ref='username'/>
              <Input type="password" label="password" ref='password'/>
              <ButtonInput type='submit' value='Login' />
            </form>
          </Panel>
        </div>
      );
    }
  }
});
