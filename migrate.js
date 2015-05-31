//migrate data from old project
var url = require('url');
var $q = require('bluebird');
var request = $q.promisify(require('request'));
var OLD_PROJECT_URL = 'http://54.77.244.127/';
var PROJECT_NAME = 'SyncCloud.Frontend';
var NEW_PROJECT_URL = 'http://neo:matrix@localhost:3000/';
var co = require('co');
var _ = require('lodash');

co(function *() {
  var [resp, body] = yield request({
    json: true,
    url: url.resolve(OLD_PROJECT_URL, '/jqgrid/items?project='+PROJECT_NAME)
  });

  var dic = {ru: {}};
  var rows = body.rows;
  rows.forEach(function (row) {
    dic.ru[row.ru] = {};
  });

  //get items
  var [resp, body] = yield request({
    url: url.resolve(NEW_PROJECT_URL, '/api/items/'+PROJECT_NAME),
    json: true
  });

  yield $q.all(body).map(function (item) {
    console.log(item);
    var key = item.translations.ru;
    var en = _.find(rows, function (row) {
      return row.ru === key;
    }).en;
    return request({
      method: 'PUT',
      url: url.resolve(NEW_PROJECT_URL, '/api/items/' + item.id),
      json: true,
      body: {
        ru: dic.ru[key],
        en: en
      }
    })
  }, {concurrency: 10})
}).then(function () {
  console.log('DONE');
}).catch(function (err) {
  console.error(err.stack);
});

