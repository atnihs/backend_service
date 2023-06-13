const express = require('express')
const router = express.Router()

const {
    createTranslationValidator,
    createMultiTranslationValidator,
    getTranslationValidator,
    updateTranslationValidator,
    deleteTranslationValidator,
} = require('../validators/translationValidator')
const {
    createTranslation,
    createMultiTranslation,
    getTranslation,
    getAllTranslation,
    updateTranslation,
    deleteTranslation,
} = require('../controllers/translationController')

router.route('/').get(getAllTranslation).post(createTranslationValidator, createTranslation)

router.route('/:code').get(getTranslationValidator, getTranslation)
router.route('/:id').put(updateTranslationValidator, updateTranslation).delete(deleteTranslationValidator, deleteTranslation)
router.route('/add-multi').post(createMultiTranslationValidator, createMultiTranslation)

module.exports = router
