import Waterline from 'waterline';
import fs from 'fs';
import path from 'path';
import {promisify} from 'bluebird';
import {invoke} from 'lodash';
import mongoose from 'mongoose';

const readdir = promisify(fs.readdir);
const log = $log('synccloud:locale:config:db');

async function initWaterline({connections, adapters}) {
  log(`initing waterline with ${{connections, adapters}}`);
  const w = new Waterline();
  w.models = {};
  const collections = await initCollections(path.join(__dirname, 'models'));

  for(let col of collections) {
    w.models[col.tableName] = col;
    w.loadCollection(col);
  }

  w.initialize({connections, adapters});
}

async function initCollections(dir) {
  return await $q.all(await readdir(dir)).map((fileName) => {
    const schemaName = path.basename(fileName, path.extname(fileName));
    const schema = require(path.join(dir, fileName));
    schema.adapter = 'sails-mongo';
    schema.tableName = schemaName;
    schema.connection = 'localeDb';
    return Waterline.Collection.extend(schema);
  });
}

export default async function initDatabase({mongo}) {
  const connectionString = `mongodb://${mongo.host}:${mongo.port}/${mongo.db}`;

  global.Waterline = await initWaterline({
    adapters: {
      'sails-mongo': require('sails-mongo')
    },
    connections: {
      localeDb: {
        adapter: 'sails-mongo',
        url: connectionString
      }
    }
  });

  log(`initing database connection ${connectionString}`);
  return await new Promise((resolve, reject) => {
    mongoose.connect(connectionString);
    mongoose.connection
      .on("error", function (err) {
        log(`failed to connect to MongoDB using ${connectionString}`);
        reject(err);
      })
      .on('connected', function () {
        log(`connected to MongoDB using ${connectionString}`);
        resolve(mongoose.connection);
      });
  });
}
