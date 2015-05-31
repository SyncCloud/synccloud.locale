'use strict';

import mongoose from 'mongoose';
import debug from 'debug';
import ActivityModel from './activity';
import co from 'co';
import config from '../config';

const log = debug('synccloud:locale:model:item');
const ItemSchema = new mongoose.Schema({
  key: {
    type: String,
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
});

ItemSchema.pre('save', function (next) {
  this.modifiedAt = new Date();
  if (!this.translations) {
    this.translations = {
      [this.keyLocale]: {
        value: this.key,
        modifiedAt: this.modifiedAt,
        modifiedBy: this.modifiedBy
      }
    }
  }
  log('save %o', this);
  const lastTranslations = this.versions[-1] || {};
  co.wrap(function *() {
    if (!_.isEqual(this.translations, lastTranslations)) {
      for (var locale in this.translations) {
        let activities = [];
        const oldValue = lastTranslations[locale];
        const newValue = this.translations[locale];
        if (newValue !== oldValue) {
          activities.push(new ActivityModel({
            createdBy: this.modifiedBy,
            project: this.project,
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
            return a.save();
          });
      }
      this.versions.push(_.pick(this, 'modifiedAt', 'modifiedBy', 'translations'));
    }
  }).call(this).then(function () {
    next();
  }, function (err) {
    next(err)
  });
});

ItemSchema.methods.updateTranslations = function*(user, translations) {
  const now = new Date();
  log('update translations for %s %j', this.key, translations);
  var tr = {};
  //копируем все в новый объект с новыми значениями ключей, иначе монго не сохраняет это поле
  for (let locale of config.locales) {
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
};

ItemSchema.statics.getProjects = function *() {
  return yield this.find({}, 'project').then(_).call('pluck', 'project').call('uniq').call('value');
};

ItemSchema.methods.toJSON = function () {
  return _.extend(_.assign({id: this._id}, _.pick(this, 'translations', 'keyLocale')));
};

const ItemModel = mongoose.model('item', ItemSchema);

export default ItemModel;
