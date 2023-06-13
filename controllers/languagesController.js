const languageService = require('../services/languagesService')
const handleResponse = require('../utils/responseMessage')

const createLanguage = async (req, res) => {
    const { code, name } = req.body
    const isLanguage = await languageService.createLanguage({ code, name })
    handleResponse(res, isLanguage, 201, 400)
}

const getAllLanguages = async (req, res) => {
    const data = await languageService.getAllLanguages()
    handleResponse(res, data, 200)
}

const getLanguage = async (req, res) => {
    const { code } = req.params
    const isLanguage = await languageService.getLanguage({ code })
    handleResponse(res, isLanguage, 200, 404)
}

const updateLanguage = async (req, res) => {
    const { code } = req.params
    const { name } = req.body
    const updateData = await languageService.updateLanguage({ code, name })
    handleResponse(res, updateData, 200, 404)
}

const deleteLanguage = async (req, res) => {
    const { code } = req.params
    const isDelete = await languageService.deleteLanguage({ code })
    handleResponse(res, isDelete, 200, 404)
}

module.exports = {
    createLanguage,
    getAllLanguages,
    getLanguage,
    updateLanguage,
    deleteLanguage,
}
