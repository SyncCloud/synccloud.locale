import co from 'co';
import $url from 'url';
import assert from 'assert';

export class AuthenticationBase {
  async login() {
    throw new Error('not implemented');
  }
  async echo() {
    throw new Error('not implemented');
  }
}

export class SynccloudAuthentication extends AuthenticationBase {
  constructor({backend, authCookie}) {
    super();
    assert(backend, '`backend` is missing');
    assert(authCookie, '`authCookie` is missing');
    this.backend = backend;
    this.authCookie = authCookie;
  }

  async login(login, password) {
    assert(login, '`login` is missing');
    assert(password, '`password` is missing');

    const [{statusCode, headers}, body] = await $request({
      method: 'POST',
      json: true,
      url: this._backendPath('login'),
      body: {
        loginOrEmail: login,
        password
      }
    });

    if (statusCode == 200) {
      if (!body.errorCode && body.result == 'ok') {
        const token = headers['set-cookie'].join(' ').match(new RegExp(`${this.authCookie}=(\\w+)`))[1];
        return await this.echo(token);
      }
    } else {
      throw new Error(`Login failed for ${login}:${password}`);
    }
  }
  async echo(token) {
    assert(token, '`token` is missing');
    const [{statusCode}, body] = await $request({
      url: this._backendPath('echo'),
      headers: {
        Cookie: `${this.authCookie}=${token}`
      },
      json: true
    });

    if (statusCode == 200 && body.result == 'ok') {
      return body.data;
    }
  }

  _backendPath(...parts) {
    return $url.resolve.apply($url, [this.backend].concat(parts));
  }
}


