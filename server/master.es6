const cluster = require('cluster');
const log = $log('synccloud:conf:master');

const WORKER_STARTUP_TIMEOUT = 10000;

(async function initMaster(){
  try {
    const conf = await require('./config');

    log('start cluster with %s workers', conf.concurrency);
    for (var i = 0; i < conf.concurrency; i++) {
      fork();
    }

    cluster.on('disconnect', onExit);

    // don't try to terminate multiple times
    let terminating = false;
    process.on('SIGTERM', terminate);
    process.on('SIGINT', terminate);

    function fork() {
      var worker = cluster.fork({CONFIG: JSON.stringify(conf)});
      log('Starting worker with pid ', worker.process.pid);
      const readyTimeout = setTimeout(() => {
        log(`failed to start worker ${worker.process.pid} within ${WORKER_STARTUP_TIMEOUT}ms, killing...`);
        worker.kill();
      }, WORKER_STARTUP_TIMEOUT);
      worker.process.on('message', (msg) => {
        if (msg == 'ready') {
          log(`receive ready from worker ${worker.process.pid}`);
          clearTimeout(readyTimeout);
        }
      });
      return worker;
    }

    function onExit (worker, code, signal) {
      var suffix = (code && ' with code ' + code) || (signal && ' with signal ' + signal);
      log.err('Worker #' + worker.process.pid + ' exited' + (suffix || '') + '. Reviving...');
      log.out('starting new worker in 3s...');
      setTimeout(function () {
        fork();
      }, 3000);
    }

    function terminate() {
      console.log(arguments);
      if (terminating)
        return;

      terminating = true;

      // don't restart workers
      cluster.removeListener('disconnect', onExit);

      // kill all workers
      Object.keys(cluster.workers).forEach(function (id) {
        log('sending kill signal to worker %s', id);
        cluster.workers[id].kill('SIGTERM');
      });

      var interval = setInterval(function() {
        const count = _.keys(cluster.workers).length;
        if (!count) {
          clearInterval(interval);
          process.exit(0);
        }
      }, 1000);
    }
  } catch(err) {
    log.trace('Fatal error: ', err);
    process.exit(-1);
  }
})();
