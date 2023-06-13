const categoryService = require('../services/categoryService')
const handleResponse = require('../utils/responseMessage')

const createCate = async (req, res) => {
    const isCategory = await categoryService.createCate(req.body)
    handleResponse(res, isCategory, 201, 400)
}

const getCates = async (req, res) => {
    const data = await categoryService.getCates()
    handleResponse(res, data, 200, 400)
}

const getCate = async (req, res) => {
    const { id } = req.params
    const data = await categoryService.getCate({ id })
    handleResponse(res, data, 200, 400)
}

const updateCate = async (req, res) => {
    const { id } = req.params
    const dataUpdate = await categoryService.updateCate({ id, payload: req.body })
    handleResponse(res, dataUpdate, 200, 400)
}

const deleteCate = async (req, res) => {
    const { id } = req.params
    const isDeteleCate = await categoryService.deleteCate({ id })
    handleResponse(res, isDeteleCate, 200, 400)
}

module.exports = {
    createCate,
    getCates,
    getCate,
    updateCate,
    deleteCate,
}
