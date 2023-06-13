const handleResponse = require('../utils/responseMessage')
const currencyService = require('../services/currencyService')

const getCurrency = async (req, res) => {
    const { slug } = req.params
    const dataCurrency = await currencyService.getCurrency({ slug })
    handleResponse(res, dataCurrency, 200, 404)
}

const getFiats = async (req, res) => {
    const dataFiats = await currencyService.getFiats()
    handleResponse(res, dataFiats, 200, 404)
}

module.exports = {
    getCurrency,
    getFiats
}
