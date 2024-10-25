const router = require('express').Router();
const { healthcheck } = require('../controllers/healthcheckController.js')
const { storesWrapper } = require('../controllers/storesController.js')
const { updateLikes } = require('../controllers/likeController.js')

/** HTTP Reqeust */
router.get('/healthcheck', healthcheck)
router.get('/product/stores', storesWrapper)
router.patch('/product/updatelike', updateLikes)


module.exports = router