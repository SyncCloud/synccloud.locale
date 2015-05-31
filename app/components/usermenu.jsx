'use strict';

import React from 'react';
import UserStore from 'stores/user';

import cx from 'react/lib/cx';

if (process.env.BROWSER) {
  require('styles/usermenu.less');
}

export default React.createClass({

  getInitialState () {
    return {user: UserStore.getState().user};
  },

  render() {
    console.log(this.state);
    return (
      <div className={cx('usermenu', this.props.className)}>
        <a className='usermenu__logout' href="/logout">Logout</a>
        <img className='usermenu__avatar' src={this.state.user.avatarUrl} />
      </div>
    )
  }
});
