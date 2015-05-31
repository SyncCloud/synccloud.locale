import alt from 'utils/alt';
import UserActions from 'actions/user';

class UserStore {
  constructor() {
    this.bindActions(UserActions);
  }

  _user(userData) {
    _.assign(this.user, userData);
    this.emitChange();
  }

  onDoLogin() {
    //this._user({isPending: true});
  }

  onLoginSuccess(user) {
    this._user(_.assign({isLoggedIn: true, isPending: false}, user));
  }

  onLoginFail() {
    this._user({isLoggedIn: false, isPending: false});
  }
}

export default alt.createStore(UserStore, 'UserStore');
