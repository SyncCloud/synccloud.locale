import koa from 'koa';
import bodyParser from 'koa-bodyparser';
import basicAuth from './middlewares/basic-auth';
import responseTime from 'koa-response-time';

export default async function initApi({config}) {
  return koa()
    .use(responseTime())
    .use(basicAuth)
    .use(bodyParser())
    .use(require('./routes/api')({config}));
}
