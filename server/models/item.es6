import ActivityModel from './activity';
import co from 'co';
import Waterline from 'waterline';

const log = $log('synccloud:locale:model:item');

export default {
  tableName: 'item',
  schema: true,
  attributes: {
    key: {
      type: 'string',
      required: true,
      index: true,
    },
    keyLocale: String,
    unused: Boolean,
    modifiedBy: Object,
    modifiedAt: Date,
    versions: {
      type: Array,
      defaults: []
    },
    project: String,
    translations: Object,
    toJSON() {
      return _.extend(_.assign({id: this._id}, _.pick(this.toObject(), 'translations', 'keyLocale')));
    },
    *updateTranslations({user, translations, locales}) {
      const now = new Date();
      log('update translations for %s %j', this.key, translations);
      var tr = {};
      //копируем все в новый объект с новыми значениями ключей, иначе монго не сохраняет это поле
      for (let locale of locales) {
        if (locale === this.keyLocale) {
          tr[locale] = _.clone(this.translations[locale]);
        }
        else if (translations[locale]) {
          tr[locale] = {
            value: translations[locale],
            modifiedAt: now,
            modifiedBy: user
          };
          if (this.modifiedAt !== now) {
            this.modifiedAt = now;
          }
        } else {
          tr[locale] = _.clone(this.translations[locale]);
        }
      }
      this.translations = tr;
      return yield this.save();
    }
  },

  beforeCreate(values, next) {
    values.modifiedAt = new Date();
    if (!values.translations) {
      values.translations = {
        [values.keyLocale]: {
          value: values.key,
          modifiedAt: values.modifiedAt,
          modifiedBy: values.modifiedBy
        }
      }
    }
    log('save %o', values);
    const lastTranslations = values.versions[-1] || {};
    co.wrap(function *() {
      if (!_.isEqual(values.translations, lastTranslations)) {
        for (var locale in values.translations) {
          let activities = [];
          const oldValue = lastTranslations[locale];
          const newValue = values.translations[locale];
          if (newValue !== oldValue) {
            activities.push(new ActivityModel({
              createdBy: values.modifiedBy,
              project: values.project,
              action: 'modified_key',
              data: {
                locale: locale,
                newValue: newValue,
                oldValue: oldValue
              }
            }));
          }
          yield $q.all(activities)
            .map((a) => {
              return a.save().then(null, (err)=> {
                log('failed to save %j', a.toJSON(), err);
              });
            });
        }
        values.versions.push(_.pick(values, 'modifiedAt', 'modifiedBy', 'translations'));
      }
    }).call(this).then(function () {
      next();
    }, function (err) {
      next(err)
    });
  },
  *getProjects() {
    return yield this.find({}, 'project').then(_).call('pluck', 'project').call('uniq').call('value');
  }
};
