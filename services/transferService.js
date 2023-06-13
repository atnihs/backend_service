const knex = require('../db/knex')
const { get_service } = require('../helper/crawl/crawl')
const { RESPONSE } = require('../constants')

const getTransfer = async ({ coin_id, address, pathEndPoint }) => {
    try {

        const service = get_service(coin_id)
        if (!service) return { status: false, message: RESPONSE.MESSAGE.NOT_SUPPORTED }

        const checkAddress = await knex('assets').where({ token_id: coin_id, address }).first()
        if (!checkAddress) return { status: false, message: RESPONSE.MESSAGE.RESOURCE_NOT_FOUND }

        if (service.hasOwnProperty('transactions')) {
            const transactions = await service.transactions(coin_id, address)

            for (const transaction of transactions) {
                const checkHash = await knex('transfer_history').where({ hash: transaction.hash }).first()
                if (checkHash) break
                await knex('transfer_history').insert(transaction)
            }
        } else {
            return { status: false, message: RESPONSE.MESSAGE.NOT_SUPPORTED }

        }
    } catch (error) {
        console.error(error)
    }

    if (pathEndPoint === 'transaction') {
        const result = await knex('transfer_history').where({
            address_wallet: address,
            token_id: coin_id
        })
        if (result.length > 0) {
            return { status: true, data: result }
        }
    }
    return { status: true, message: 'SCAN SUCCESS' }
}

module.exports = {
    getTransfer
}
