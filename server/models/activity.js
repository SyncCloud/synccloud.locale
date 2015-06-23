'use strict';
import mongoose from 'mongoose';
import debug from 'debug';

const log = debug('synccloud:locale:model:item');

let ActivitySchema = new mongoose.Schema({
  createdBy: Object,
  createdAt: Date,
  project: String,
  action: String,
  data: {},
  translations: {}
});

ActivitySchema.pre('save', function (next) {
  this.createdAt = new Date();
  log('save %o', this);
  next();
});

ActivitySchema.statics.byProject = function *(projectId) {
  yield this.find({
      project: projectId
    })
    .sort('-createdAt')
    .exec();
};

export default mongoose.model('activity', ActivitySchema);
