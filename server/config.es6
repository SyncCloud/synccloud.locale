import path from 'path';
import props from 'deep-property';
import fs from 'fs';
import {merge} from 'lodash';
import assert from 'assert';

const log = $log('synccloud-conf:config');
const DEFAULT_CONFIG_PATH = path.join(__dirname, '../config.json');

export default (async () => {
  let conf = {};

  (await Promise.all([
    fileSource(process.env.SYNCCLOUD_CONFIGURATION_FILE || DEFAULT_CONFIG_PATH),
    envSource()
  ])).forEach((c) => merge(conf, c));

  checkConfig(conf);

  return conf;
})();

function checkConfig(conf) {
   required(
     'mongo.host',
     'auth.backend'
   );

  optional('concurrency', 1);
  optional('port', 3000);
  optional('auth.cookieName', '.ASPXAUTH');
  optional('mongo.port', 27017);
  optional('mongo.db', 'locale');
  optional('locales', ['en']);
  optional('keys', ['fasfdas24SDF623Ggffg234QPFNYE3']);

  function required(...names) {
    for (let name of names)
      assert(props.has(conf, name), 'Missing configuration option `' + name + '`');
  }

  function optional(name, defaultValue) {
    if (!props.has(conf, name)) {
      props.set(conf, name, defaultValue);
    }
  }
}


async function fileSource(filePath) {
  if (!fs.existsSync(filePath)) {
    log(`config file not found in ${filePath}`);
    return {};
  }
  const contents = fs.readFileSync(filePath, 'utf-8');
  log(`read from ${filePath}: `, contents);
  try {
    return JSON.parse(contents);
  } catch (err) {
    throw new Error(`failed parse ${filePath}:\n${contents}`)
  }
}

async function envSource() {
  const env = process.env;
  return {
    concurrency: env.CONCURRENCY,
    port: env.PORT,
    mongo: {
      host: env.MONGO_HOST,
      port: env.MONGO_PORT,
      db: env.MONGO_DB
    },
    auth: {
      backend: env.AUTH_BACKEND,
      cookieName: env.AUTH_COOKIE
    }
  }
}
