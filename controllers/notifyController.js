const notifyService = require('../services/notifyService')
const handleResponse = require('../utils/responseMessage')

const createNotify = async (req, res) => {
    const data = await notifyService.createNotify(req.body)
    handleResponse(res, data, 201, 400)
}

const getNotify = async (req, res) => {
    const { notify_id } = req.params
    const data = await notifyService.getNotify({ notify_id })
    handleResponse(res, data, 201, 400)
}

const getListNotify = async (req, res) => {
    const data = await notifyService.getListNotify(req.query)
    handleResponse(res, data, 200, 400)
}

module.exports = {
    createNotify,
    getNotify,
    getListNotify,
}
