const express = require('express')
const router = express.Router()
const {
    getConfigValidator,
    createConfigValidator,
    createMultiConfigValidator,
    updateConfigValidator,
    deleteConfigValidator,
} = require('../validators/configValidator')
const {
    createConfig,
    createMultiConfig,
    getConfig,
    getAllConfig,
    updateConfig,
    deleteConfig,
} = require('../controllers/configController')

router.route('/').get(getAllConfig).post(createConfigValidator, createConfig)

router
    .route('/:id')
    .get(getConfigValidator, getConfig)
    .put(updateConfigValidator, updateConfig)
    .delete(deleteConfigValidator, deleteConfig)

router.route('/add-multi').post(createMultiConfigValidator, createMultiConfig)

module.exports = router
