const express = require('express')
const router = express.Router()

const {
    createUserValidator,
    createAssetsValidator,
    updateUserValidator,
    deleteUserValidator,
    deleteAssetValidator,
} = require('../validators/userValidator')
const {
    createUser,
    createAssets,
    updateUser,
    deleteUser,
    deleteAsset,
    getListUser,
    getListUserNotify,
} = require('../controllers/userController')

router.route('/can-notify').get(getListUserNotify)
router.route('/').get(getListUser).post(createUserValidator, createUser)
router
    .route('/:deviceId')
    .put(updateUserValidator, updateUser)
    .delete(deleteUserValidator, deleteUser)

router.route('/:deviceId/assets').post(createAssetsValidator, createAssets)
router.route('/:deviceId/asset').delete(deleteAssetValidator, deleteAsset)

module.exports = router
