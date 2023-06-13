const translationService = require('../services/translationService')
const handleResponse = require('../utils/responseMessage')

const createTranslation = async (req, res) => {
    const { code_id, key, value } = req.body
    const isAddTranslate = await translationService.createTranslation({
        code_id,
        key,
        value,
    })

    handleResponse(res, isAddTranslate, 201, 400)
}

const createMultiTranslation = async (req, res) => {
    const isMultiTranslation = await translationService.createMultiTranslation({
        translations: req.body,
    })

    handleResponse(res, isMultiTranslation, 201)
}

const getTranslation = async (req, res) => {
    const { code } = req.params
    const dataTrans = await translationService.getTranslation({ code })
    handleResponse(res, dataTrans, 200, 404)
}

const getAllTranslation = async (req, res) => {
    const data = await translationService.getAllTranslation()
    handleResponse(res, data, 200)
}

const updateTranslation = async (req, res) => {
    const { id } = req.params
    const { key, value } = req.body
    const updateTrans = await translationService.updateTranslation({
        id,
        key,
        value,
    })
    handleResponse(res, updateTrans, 200, 404)
}

const deleteTranslation = async (req, res) => {
    const { id } = req.params
    const isUpdate = await translationService.deleteTranslation({ id })
    handleResponse(res, isUpdate, 200, 404)
}

module.exports = {
    createTranslation,
    createMultiTranslation,
    getTranslation,
    getAllTranslation,
    updateTranslation,
    deleteTranslation,
}
