import Router from 'koa-router'

const router = new Router();
const SavePageController = require('../bin/controller/api/save_page')

router.prefix('/api/v1/');

router.get('/save_page/:type/:ssn/:oid?',SavePageController.save)

export default router
