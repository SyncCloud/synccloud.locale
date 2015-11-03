import chakram from 'chakram';
import {fork} from 'child_process';
import path from 'path';

const expect = chakram.expect;

describe('api', function() {
  let server, config, mongo;

  before(async function() {
    config = await require('../server/config');
    mongo = await require('../server/db')(config);
    server = fork(path.join(__dirname, '../bin/locale-server'));
    await new Promise((resolve, reject) => {
      let isRejected;
      let timeout = setTimeout(()=>{
        if (isRejected) return;
        isRejected = true;
        reject(new Error(`failed start server by timeout 5000ms`));
      }, 5000);

      server.on('message', (msg) => {
        if (msg == 'ready') {
          clearTimeout(timeout);
          resolve();
        }
      });

      server
        .on('exit', (code) => {
          if (isRejected) return;
          clearTimeout(timeout);
          isRejected = true;
          reject(new Error(`failed start server due: process exited with code ${code}`));
        })
        .on('unhandledRejection', (err) => {
          if (isRejected) return;
          clearTimeout(timeout);
          isRejected = true;
          reject(new Error(`failed start server due: process exited with error ${err}`));
        })
        .on('uncaughtException', (err) => {
          if (isRejected) return;
          clearTimeout(timeout);
          isRejected = true;
          reject(new Error(`failed start server due: process exited with error ${err}`));
        });
    });
    mongo.db.dropDatabase();
  });

  after(async function() {
    server.kill();
  });

  describe('auth', function () {
    const buildNotAuthUrl = function (path) {
      return `http://localhost:${config.port}/${path}`;
    };

    it('should require authentiation', async function () {
      const responses = [
        await chakram.post(buildNotAuthUrl('api/items/synccloud')),
        await chakram.get(buildNotAuthUrl('api/items/synccloud')),
        await chakram.put(buildNotAuthUrl('api/items/123'))
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

    it('should push items', async function () {
      const response = await chakram.post(`http://han:solo@localhost:${config.port}/api/items/synccloud`, i18nDictionary);
      expect(response).to.have.status(200);
      expect(response).to.have.json(function (json) {
        expect(json).to.have.all.keys('added');
        expect(json.added).to.have.length(3);
      })
    });

    it('should push items to another project', async function() {
      const response = await chakram.post(`http://han:solo@localhost:${config.port}/api/items/matrix`, {en: {'Matrix has you': {}}});
      expect(response).to.have.status(200);
      expect(response).to.have.json(function (json) {
        expect(json).to.have.all.keys('added');
        expect(json.added).to.have.length(1);
      })
    });

    it('should return all pushed items', async function() {
      const response = await chakram.get(`http://han:solo@localhost:${config.port}/api/items/synccloud`);
      expect(response).to.have.status(200);
      expect(response).to.have.json(function (json) {
        expect(json).to.have.length(3);
        json.forEach(function (item) {
          expect(item).to.have.any.keys('id');
        });
        expect(json[0]).to.have.deep.property('translations.en', _.keys(i18nDictionary.en)[1]);
        expect(json[1]).to.have.deep.property('translations.en', _.keys(i18nDictionary.en)[0]);
        expect(json[2]).to.have.deep.property('translations.ru', _.keys(i18nDictionary.ru)[0]);
      })
    });


    it('should merge already pushed keys', async function() {
      const response = await chakram.post(`http://han:solo@localhost:${config.port}/api/items/synccloud`, {
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

      before(async function () {
        const {body} = await chakram.get(`http://han:solo@localhost:${config.port}/api/items/synccloud`);
        items = body;
      });

      it('should fail update not-existing item', async function() {
        const response = await chakram.put(`http://han:solo@localhost:${config.port}/api/items/134124`, {
          en: 'Star Wars'
        });
        expect(response).to.have.status(404);
      });

      it('should update item translations', async function() {
        const response = await chakram.put(`http://han:solo@localhost:${config.port}/api/items/${items[0].id}`, {
          en: 'Star Wars',
          ru: 'Звездные войны'
        });
        expect(response).to.have.status(200);
        expect(response).to.have.json(async function(json) {
          expect(json.translations.ru.value).to.equal('Звездные войны')
        });
      });

    });

  });

});
