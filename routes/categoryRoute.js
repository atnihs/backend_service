const express = require('express')
const router = express.Router()

const {
    createCateValidator,
    getCateValidator,
    updateCateValidator,
    deleteCateValidator,
} = require('../validators/categoryValidator')
const { createCate, getCate, updateCate, deleteCate, getCates } = require('../controllers/categoryController')

router.route('/').get(getCates).post(createCateValidator, createCate)
router
    .route('/:id')
    .get(getCateValidator, getCate)
    .put(updateCateValidator, updateCate)
    .delete(deleteCateValidator, deleteCate)

module.exports = router
