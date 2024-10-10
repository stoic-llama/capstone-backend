const router = require('express').Router();
const { healthcheck } = require('../controllers/healthcheckController.js')
const { storesWrapper } = require('../controllers/storesController.js')
const { upsDowns } = require('../controllers/likeController.js')

/** HTTP Reqeust */
router.get('/healthcheck', healthcheck)
router.get('/product/stores', storesWrapper)
router.patch('/likes', upsDowns)


module.exports = router