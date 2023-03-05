import Router from 'koa-router'

const router = new Router();

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2! For Autotest'
  })
})

// router.get('/result/')

export default router
