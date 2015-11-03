import ItemModel from '../models/item';
import ActivityModel from '../models/activity';
import passport from 'koa-passport';

const log = $log('synccloud:locale:http:ui');

export default async function initUIRoutes({config}) {
  const router = require('koa-router')();

  return router
    .post('/login', login)
    .get('/logout', logout)
    .post('/translate/:id', updateItem)
    .routes();

  function *login() {
    const ctx = this;
    yield* passport.authenticate("local", function *(err, user, info) {
      if (err) throw err;
      if (user === false) {
        ctx.status = 401;
        ctx.body = { success: false }
      } else {
        yield ctx.login(user);
        ctx.body = { success: true, user }
      }
    }).call(this);
  }

  function *logout() {
    this.logout();
    this.redirect('/login');
  }

  function *updateItem() {
    let item = yield ItemModel.findById(this.params.id);
    if (!item) {
      this.throw('not_exists', 404);
    }
    log('updating %s with %o', item.key, this.request.body);
    item = yield item.updateTranslations(this.req.user, _.pick(this.request.body, config.locales));
    this.body = item.toJSON();
  }
}
