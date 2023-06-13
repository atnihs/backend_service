const express = require('express')
const router = express.Router()

const { getTransferValidator } = require('../validators/transferValidator')
const { getTransfer } = require('../controllers/transferController')

router.route('/transaction').get(getTransferValidator, getTransfer)
router.route('/scan').get(getTransferValidator, getTransfer)

module.exports = router