import alt from 'utils/alt';

class UserActions {
  doLogin({username, password}) {
    this.dispatch();
    $.post('/login', {username, password})
      .done(this.actions.loginSuccess.bind(this))
      .fail(this.actions.loginFail.bind(this));
  }

  loginSuccess({user}) {
    this.dispatch(user);
  }

  loginFail() {
    this.dispatch();
  }
}

export default alt.createActions(UserActions);
