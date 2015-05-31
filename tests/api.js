import chakram from 'chakram';
import config from '../server/config'
const expect = chakram.expect;

describe('api', function() {
  var koa, mongo;
  const buildUrl = function (path) {
    return `http://han:solo@localhost:${config.port}/${path}`;
  };

  before(function *() {
    const app = yield require('../server');
    koa = app.http;
    mongo = app.mongo;
    mongo.db.dropDatabase();
  });

  describe('auth', function () {
    const buildNotAuthUrl = function (path) {
      return `http://localhost:${config.port}/${path}`;
    };

    it('should require authentiation', function *() {
      const responses = [
        yield chakram.post(buildNotAuthUrl('api/items/synccloud')),
        yield chakram.get(buildNotAuthUrl('api/items/synccloud')),
        yield chakram.put(buildNotAuthUrl('api/items/123'))
      ];
      responses.forEach(function (resp) {
        expect(resp).to.have.status(401);
      })
    });
  });

  describe('items', function() {
    let i18nDictionary = {
      en: {
        'Star Wars': {},
        'Luk I\'m your father': {}
      },
      ru: {
        'Где-то в далекой галактике': {}
      }
    };

    it('should push items', function *() {
      const response = yield chakram.post(`http://han:solo@localhost:${config.port}/api/items/synccloud`, i18nDictionary);
      expect(response).to.have.status(200);
      expect(response).to.have.json(function (json) {
        expect(json).to.have.all.keys('added');
        expect(json.added).to.have.length(3);
      })
    });

    it('should push items to another project', function *() {
      const response = yield chakram.post(`http://han:solo@localhost:${config.port}/api/items/matrix`, {en: {'Matrix has you': {}}});
      expect(response).to.have.status(200);
      expect(response).to.have.json(function (json) {
        expect(json).to.have.all.keys('added');
        expect(json.added).to.have.length(1);
      })
    });

    it('should return all pushed items', function *() {
      const response = yield chakram.get(`http://han:solo@localhost:${config.port}/api/items/synccloud`);
      expect(response).to.have.status(200);
      expect(response).to.have.json(function (json) {
        console.log(json);
        expect(json).to.have.length(3);
        json.forEach(function (item) {
          expect(item).to.have.any.keys('id');
        });
        expect(json[0]).to.have.property('translations.en', _.keys(i18nDictionary.en)[0]);
        expect(json[1]).to.have.property('translations.en', _.keys(i18nDictionary.en)[1]);
        expect(json[2]).to.have.property('translations.ru', _.keys(i18nDictionary.ru)[0]);
      })
    });


    it('should merge already pushed keys', function *() {
      const response = yield chakram.post(`http://han:solo@localhost:${config.port}/api/items/synccloud`, {
        en: {
          'Star Wars': {}
        },
        ru: {
          'Да прибудет с тобой сила': {}
        }
      });
      expect(response).to.have.status(200);
      expect(response).to.have.json(function (json) {
        expect(json.added).to.have.length(1);
        expect(json.added[0]).to.equals('Да прибудет с тобой сила');
      });
    });

    describe('update item', function() {
      let items;

      before(function *() {
        const {body} = yield chakram.get(`http://han:solo@localhost:${config.port}/api/items/synccloud`);
        items = body;
      });

      it('should fail update not-existing item', function *() {
        const response = yield chakram.put(`http://han:solo@localhost:${config.port}/api/items/134124`, {
          en: 'Star Wars'
        });
        expect(response).to.have.status(404);
      });

      it('should update item translations', function *() {
        const response = yield chakram.put(`http://han:solo@localhost:${config.port}/api/items/${items[0].id}`, {
          en: 'Star Wars',
          ru: 'Звездные войны'
        });
        expect(response).to.have.status(200);
        console.log(response);
        expect(response).to.have.json(function (json) {
          expect(json.translations.ru.value).to.equal('Звездные войны')
        });
      });

    });

  });

});
