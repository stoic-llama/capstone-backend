const router = require('express').Router();
const { healthcheck } = require('../controllers/healthcheckController.js')
const { storesWrapper } = require('../controllers/storesController.js')


/** HTTP Reqeust */
router.get('/healthcheck', healthcheck)
router.get('/product/stores', storesWrapper)


module.exports = router