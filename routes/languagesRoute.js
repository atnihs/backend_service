const express = require('express')
const router = express.Router()

const {
    createLanguageValidator,
    getLanguageValidator,
    updateLanguageValidator,
    deleteLanguageValidator
} = require('../validators/languageValidator')
const {
    createLanguage,
    getLanguage,
    getAllLanguages,
    updateLanguage,
    deleteLanguage,
} = require('../controllers/languagesController')

router.route('/').get(getAllLanguages).post(createLanguageValidator, createLanguage)
router.route('/:code').get(getLanguageValidator, getLanguage).put(updateLanguageValidator, updateLanguage).delete(deleteLanguageValidator, deleteLanguage)

module.exports = router
