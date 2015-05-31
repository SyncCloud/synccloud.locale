import koa from 'koa';
import bodyParser from 'koa-bodyparser';
import basicAuth from './middlewares/basic-auth';
import responseTime from 'koa-response-time';

const api = koa();

api.use(responseTime());
api.use(basicAuth);
api.use(bodyParser());
api.use(require('./routes/api').routes());

export default api;
