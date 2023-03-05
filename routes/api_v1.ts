import Router from 'koa-router'

import TestAllCTRL from '../bin/controller/api/test_all';

const router = new Router();

router.prefix('/api/v1/');
router.get('/test/all/:siteName?',TestAllCTRL.test)

export default router
