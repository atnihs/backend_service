const transferService = require('../services/transferService')
const handleResponse = require('../utils/responseMessage')

const getTransfer = async (req, res) => {
    const { coin_id, address } = req.query
    const path = req.path
    const pathEndPoint = path.split('/').pop()
    const getListTransfer = await transferService.getTransfer({
        coin_id,
        address,
        pathEndPoint,
    })
    handleResponse(res, getListTransfer, 200, 404)
}

module.exports = {
    getTransfer,
}
