import basicAuth from 'basic-auth';
import debug from 'debug';

const log = debug('synccloud:locale:auth');

export default function *(next) {
  this.user = basicAuth(this);
  if (this.user) {
    log('authenticated as %s', this.user.name);
    yield* next;
  } else {
    log('not authenticated');
    this.throw('not_auth', 401);
  }
}
