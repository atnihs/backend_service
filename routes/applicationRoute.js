const express = require('express')
const router = express.Router()

const {
    createAppValidator,
    getAppValidator,
    updateValidator,
    deleteValidator,
} = require('../validators/applicationValidator')
const { createApp, getApp, updateApp, deleteApp } = require('../controllers/applicationController')

router.route('/').post(createAppValidator, createApp)
router.route('/:id').get(getAppValidator, getApp).put(updateValidator, updateApp).delete(deleteValidator, deleteApp)

module.exports = router
