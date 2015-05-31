'use strict';
import config from './config';
import mongoose from 'mongoose';
import path from 'path';
import fs from 'fs';
import debug from 'debug';

const log = debug('synccloud:locale:config:db');

mongoose.Model.findById = function (id, ...args) {
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return $q.resolve(null); //prevent CastError
  } else {
    return this.findOne({_id: id});
  }
};

export default $q(function (resolve, reject) {
  mongoose.connect(config.mongo);
  mongoose.connection
    .on("error", function (err) {
      log('failed to connect to MongoDB using %s', config.mongo);
      reject(err);
    })
    .on('connected', function () {
      log('connected to MongoDB using %s', config.mongo);
      resolve(mongoose.connection);
    });
});
