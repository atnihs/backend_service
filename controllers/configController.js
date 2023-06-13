const configService = require('../services/configService')
const handleResponse = require('../utils/responseMessage')

const createConfig = async (req, res) => {
    const { key, value } = req.body
    const isConfig = await configService.createConfig({ key, value })
    handleResponse(res, isConfig, 201, 400)
}

const createMultiConfig = async (req, res) => {
    const isMultiConfig = await configService.createMultiConfig({
        configs: req.body,
    })
    handleResponse(res, isMultiConfig, 201)
}

const getConfig = async (req, res) => {
    const { id } = req.params
    const isConfig = await configService.getConfig({ id })
    handleResponse(res, isConfig, 200, 404)
}

const getAllConfig = async (req, res) => {
    const data = await configService.getAllConfig()
    handleResponse(res, data, 200)
}

const updateConfig = async (req, res) => {
    const { id } = req.params
    const { key, value } = req.body
    const isUpdate = await configService.updateConfig({ id, key, value })
    handleResponse(res, isUpdate, 200, 404)
}

const deleteConfig = async (req, res) => {
    const { id } = req.params
    const isUpdate = await configService.deleteConfig({ id })
    handleResponse(res, isUpdate, 200, 404)
}

module.exports = {
    createConfig,
    createMultiConfig,
    getConfig,
    getAllConfig,
    updateConfig,
    deleteConfig,
}
