import co from 'co';
import $url from 'url';

const API_URL = 'https://synccloud.com/';
const AUTH_COOKIE = '.ASPXAUTH';

export default {
  login: co.wrap(function* (login, password) {
    const [{statusCode, headers}, body] = yield $request({
      method: 'POST',
      json: true,
      url: $url.resolve(API_URL, '/login'),
      body: {
        loginOrEmail: login,
        password
      }
    });
    if (statusCode == 200) {
      if (!body.errorCode && body.result == 'ok') {
        const token = headers['set-cookie'].join(' ').match(new RegExp(`${AUTH_COOKIE}=(\\w+)`))[1];
        return yield this.echo(token);
      }
    }
  }),
  echo: co.wrap(function* (token) {
    const [{statusCode}, body] = yield $request({
      url: $url.resolve(API_URL, '/echo'),
      headers: {
        Cookie: `${AUTH_COOKIE}=${token}`
      },
      json: true
    });

    if (statusCode == 200 && body.result == 'ok') {
      return body.data;
    }
  })
}
