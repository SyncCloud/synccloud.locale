'use strict';
import mongoose from 'mongoose';
import debug from 'debug';

const log = debug('synccloud:locale:model:user');

let UserSchema = new mongoose.Schema({
  createdAt: Date,
  login: {
    unique: true,
    index: true,
    type: String
  },
  token: String,
  name: String,
  avatarUrl: String
});

UserSchema.pre('save', function (next) {
  this.createdAt = new Date();
  log('save %o', this);
  next();
});


export default mongoose.model('user', UserSchema);
