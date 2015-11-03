import ItemModel from '../models/item';
import ActivityModel from '../models/activity';

const log = $log('synccloud:locale:http:api');

export default async function initApiRoutes({config}) {
  const router = require('koa-router')();

  return router
    .post('/items/:project', fillProject)
    .get('/items/:project', getItemsByProject)
    .put('/items/:id', updateItem)
    .routes();

  /**
   * Fill database with keys
   */
  function *fillProject() {
    const data = this.request.body;
    const projectId = this.params.project;
    let items = [];

    log('request %s %s body:%o', this.request.method, this.request.url, data);

    for (let locale of _.keys(data)) {
      if (!_.contains(config.locales, locale)) {
        this.throw('unsupported_locale', 400);
      }
      if (!_.isObject(data[locale])) {
        this.throw('bad_locale_format', 400);
      }
      const dbKeys = yield ItemModel.find({
        project: projectId,
        keyLocale: locale
      }, 'key').then(_).call('pluck', 'key').call('value');
      log('found keys with locale %s: %o', locale, dbKeys);
      const fillKeys = _.keys(data[locale]);
      const newKeys = _.difference(fillKeys, dbKeys);
      newKeys.forEach((key) => {
        items.push(new ItemModel({
          key: key,
          keyLocale: locale,
          project: projectId,
          modifiedBy: this.user || this.req.user,
          meta: data[locale][key]
        }));
      });

      let addedKeys = yield $q.all(items).map((item) => {
        return item.save()
          .then((item) => {
            return item.key
          });
      });

      this.body = {
        added: addedKeys
      };
    }
  }

  function *getItemsByProject() {
    this.body = yield ItemModel.find({project: this.params.project}, 'translations key keyLocale')
      .then((items) => {
        return items.map((item) => {
          const tr = item.translations;
          for (let key of Object.keys(tr)) {
            tr[key] = tr[key] && tr[key].value;
          }
          return {id: item._id, key: item.key, keyLocale: item.keyLocale, translations: tr};
        })
      });
  }

  function *updateItem() {
    let item = yield ItemModel.findById(this.params.id);
    if (!item) {
      this.throw('not_exists', 404);
    }

    log('updating %s with %o', item.key, this.request.body);
    item = yield item.updateTranslations(this.user, _.pick(this.request.body, config.locales));
    this.body = item.toJSON();
  }
}
