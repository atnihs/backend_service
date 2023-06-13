const applicationService = require('../services/applicationService')
const handleResponse = require('../utils/responseMessage')

const createApp = async (req, res) => {
    const isApplication = await applicationService.createApp(req.body)
    handleResponse(res, isApplication, 201, 400)
}

const getApp = async (req, res) => {
    const { id } = req.params
    const data = await applicationService.getApp({ id })
    handleResponse(res, data, 200, 400)
}

const updateApp = async (req, res) => {
    const { id } = req.params
    const dataUpdate = await applicationService.updateApp({ id, payload: req.body })
    handleResponse(res, dataUpdate, 200, 400)
}

const deleteApp = async (req, res) => {
    const { id } = req.params
    const isDelApp = await applicationService.deleteApp({ id })
    handleResponse(res, isDelApp, 200, 400)
}

module.exports = {
    createApp,
    getApp,
    updateApp,
    deleteApp,
}
