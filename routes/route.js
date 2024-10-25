const router = require('express').Router();
const { healthcheck } = require('../controllers/healthcheckController.js')
const { storesWrapper } = require('../controllers/storesController.js')
const { updateLikes } = require('../controllers/likeController.js')
const { updateDislikes } = require('../controllers/dislikeController.js')

/** HTTP Reqeust */
router.get('/healthcheck', healthcheck)
router.get('/product/stores', storesWrapper)
router.patch('/product/like', updateLikes)
router.patch('/product/dislike', updateDislikes)


module.exports = router