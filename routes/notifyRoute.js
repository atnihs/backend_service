const express = require('express')
const router = express.Router()

const {
    createNotifyValidator,
    getListNotifyValidator,
    getNotifyValidator,
} = require('../validators/notifyValidator')
const {
    createNotify,
    getListNotify,
    getNotify,
} = require('../controllers/notifyController')

router.route('/').post(createNotifyValidator, createNotify)
router.route('/transaction').post(createNotify)
router.route('/list').get(getListNotifyValidator, getListNotify)
router.route('/:notify_id').get(getNotifyValidator, getNotify)

module.exports = router
