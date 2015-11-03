import http from 'http';
import cluster from 'cluster';

const conf = JSON.parse(process.env.CONFIG);
const log = $log('synccloud:conf:worker');
// time for worker need to gracefully shutdown
const SHUTDOWN_TIMEOUT = __DEBUG ? 0 : 4000;

(async function initWorker() {
  const db = await require('./db')(conf);
  const koa = await require('./koa')({config: conf, conn: db});

  const server = http.createServer();
  const handler = koa.callback();

  // custom koa settings
  // defaults to http://nodejs.org/api/http.html#http_server_maxheaderscount
  server.maxHeadersCount = koa.maxHeadersCount || 1000;
  server.timeout = koa.timeout || 120000;

  server
    .on('request', handler)
    .on('checkContinue', (req, res) => {
      req.checkContinue = true;
      handler(req, res)
    });

  try {
    server.listen(conf.port, (err) => {
      if (err) throw err;
      log.out(`worker ${cluster.worker.id} listening at port ${conf.port} with config:\n${JSON.stringify(conf, null, 4)}`);
      if (process.send) {
        process.send('ready');
      }
    });
  } catch (err) {
    log.trace('Failed to start worker: ', err);
    close(1);
  }

  // don't try to close the server multiple times
  let closing = false;

  process
    .on('SIGTERM', function () {
      close(0);
    })
    .on('SIGINT', function () {
      close(0);
    })
    .on('uncaughtException', function (err) {
      log.trace('uncaught exception: ', err);
      close(1);
    })
    .on('exit', function () {
      log('exiting worker %s', cluster.worker.id);
    });

  function close(code) {
    if (closing)
      return;

    log('closing worker %s', cluster.worker.id);
    closing = true;

    var killtimer = setTimeout(function () {
      process.exit(code)
    }, SHUTDOWN_TIMEOUT);

    // http://nodejs.org/api/timers.html#timers_unref
    killtimer.unref();
    server.close();
    //cluster.worker.disconnect();
  }

})();
