"use strict";

import nconf from 'nconf';

const env = process.env;
const normalizr = {
  url: function (input) {
    if (!input.match(/^http/)) {
      input = 'http://' + input;
    }

    return input;
  }
};
const unwrapNconf = function (...props) {
  var conf = {};

  props.forEach(function (_name) {
    var parts = _name.split('>'),
      name = parts[0],
      normalizers = parts.slice(1),
      val = nconf.get(name);

    if (normalizers.length) {
      normalizers.forEach(function (fn) {
        val = normalizr[fn].call(normalizr, val);
      });
    }

    conf[name] = val;
  });
  return conf;
};

let mongoUrl = env.MONGO;
if (!mongoUrl) {
  mongoUrl = `mongodb://${env.MONGO_HOST || 'localhost'}:${env.MONGO_PORT || 27017}/${env.MONGO_DB || 'locale'}}`;
}

nconf
  .overrides({
    mongo: mongoUrl,
    port: env.PORT || env.NODE_PORT
  })
  .file({file: 'config.json', search: true})
  .defaults({
    port: 3000,
    mongo: 'mongodb://localhost/locale',
    locales: ['en', 'ru'],
    keys: ['fasfdas24SDF623Ggffg234QPFNYE3']
  });

export default unwrapNconf(
  'mongo',
  'port',
  'locales',
  'keys'
);


