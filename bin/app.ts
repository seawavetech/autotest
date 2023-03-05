import Koa from 'koa';
import views from 'koa-views';
import json from 'koa-json';
import onError from 'koa-onerror';
import bodyparser from 'koa-bodyparser';
import logger from 'koa-logger';

import index from '../routes/index';
import api_v1 from '../routes/api_v1';

const app = new Koa()
// error handler
onError(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

app.use(views(__dirname + '/views'))

// logger
app.use(async (ctx, next) => {
  let start = new Date().getTime();
  await next()
  let ms = new Date().getTime()- start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// routes
app.use(index.routes())
app.use(api_v1.routes())

// error-handling
app.on('error', (err:any, ctx:any) => {
  console.error('server error', err, ctx)
});

export default app;
