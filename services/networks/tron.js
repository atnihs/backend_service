const axios = require('axios')
const knex = require('../../db/knex')
const numeral = require('numeral')
const isSupportCoinId = ['tron', 'usdt_trx']

async function transactions(coin_id, address) {
    const items = []
    if (coin_id === 'usdt_trx') {
        let url = `https://apilist.tronscanapi.com/api/token_trc20/transfers?limit=100&start=0&sort=-timestamp&relatedAddress=${address}`
        let { data } = await axios.get(url)
        if (data.token_transfers.length > 0) {
            for (const transfer of data.token_transfers) {
                items.push({
                    address_wallet: address,
                    network: 'TRON',
                    token_id: coin_id,
                    hash: transfer.transaction_id,
                    contract_address: transfer.contract_address,
                    contract_type: transfer.contract_type,
                    status: transfer.finalResult,
                    from: transfer.from_address,
                    to: transfer.to_address,
                    amount: numeral(transfer.quant)
                        .divide(10 ** transfer.tokenInfo.tokenDecimal)
                        .value()
                        .toString()
                })
            }
        }
    }

    if (coin_id === 'tron') {
        let url = `https://apilist.tronscanapi.com/api/transfer?sort=-timestamp&count=true&limit=100&start=0&address=${address}`
        let { data } = await axios.get(url)
        if (data.data.length > 0) {
            for (const transfer of data.data) {
                items.push({
                    address_wallet: address,
                    network: 'TRON',
                    token_id: coin_id,
                    hash: transfer.transactionHash,
                    contract_address: transfer.tokenName
                        ? transfer.tokenName
                        : '-',
                    contract_type: transfer.tokenInfo.tokenType,
                    status: transfer.contractRet,
                    from: transfer.transferFromAddress,
                    to: transfer.transferToAddress,
                    amount: numeral(transfer.amount)
                        .divide(10 ** transfer.tokenInfo.tokenDecimal)
                        .value()
                        .toString()
                })
            }
        }
    }

    return items
}

module.exports = {
    isSupportCoinId, transactions
}
