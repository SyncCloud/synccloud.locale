'use strict';

import mongoose from 'mongoose';
import debug from 'debug';

const log = debug('synccloud:locale:model:project');

let ProjectSchema = new mongoose.Schema({
  createdAt: Date,
  createdBy: String,
  name: String,
  locales: Array
});

ProjectSchema.pre('save', function (next) {
  if (this.isNew()) {
    this.createdAt = new Date();
  }
  log('save %o', this);
  next();
});


export default mongoose.model('user', ProjectSchema);
