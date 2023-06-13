const express = require('express')
const router = express.Router()

const { getCurrencyValidator } = require('../validators/currencyValidator')
const { getCurrency, getFiats } = require('../controllers/currencyController')

router.route('/fiats').get(getFiats)
router.route('/:slug').get(getCurrencyValidator, getCurrency)


module.exports = router
