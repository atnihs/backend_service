const axios = require('axios')
const _ = require('lodash')
const knex = require('../../db/knex')
const numeral = require('numeral')
const networks = require('../../services/networks')

function get_service(coinId) {
    for (const key in networks) {
        const service = networks[key]
        if (service.hasOwnProperty('isSupportCoinId') && service.isSupportCoinId.indexOf(coinId) >= 0) {
            return service
        }
    }
    return null
}

async function crawl_from_coinmarketcap() {

    try {
        const url = 'https://api.exchangerate-api.com/v4/latest/VND'
        let { data } = await axios.get(url)
        var price = data['rates']['USD']
        let isCurrency = await knex('coins')
            .where({ slug: 'vndp_solana' })
            .first()

        if (!isCurrency) {
            await knex('coins').insert({
                name: 'VNDP',
                symbol: 'VNDP',
                rank: 0,
                coinID: 0,
                slug: 'vndp_solana'
            })
            isCurrency = await knex('coins')
                .where({ slug: 'vndp_solana' })
                .first()
        }
        if (isCurrency) {
            global.io.emit('prices', {
                change_24h: 0,
                price: price,
                slug: isCurrency.slug,
                id: isCurrency.id,
                provider: 'coinmarketcap'
            })
            await knex('coins_detail').insert({
                coin_id: isCurrency.id,
                price: price,
                volume24h: 0,
                marketCap: 0,
                percentChange1h: 0,
                percentChange24h: 0,
                percentChange7d: 0,
                percentChange30d: 0
            })

        }
    } catch (e) {
    }

    try {
        const slugArr = [
            'bitcoin',
            'litecoin',
            'dogecoin',
            'dash',
            'viacoin',
            'groestlcoin',
            'digibyte',
            'monacoin',
            'decred',
            'ethereum',
            'tether',
            'ethereum-classic',
            'icon',
            'aptos',
            'sui',
            'cosmos',
            'stargaze',
            'juno',
            'stride',
            'axelar',
            'kujira',
            'comdex',
            'neutron',
            'sommelier',
            'fetch',
            'mars',
            'umee',
            'coreum',
            'persistence',
            'akash',
            'zcash',
            'firo',
            'xrp',
            'bitcoin-cash',
            'stellar',
            'bitcoin-gold',
            'nano',
            'ravencoin',
            'poa',
            'eos',
            'wax',
            'tron',
            'fio',
            'nimiq',
            'algorand',
            'iotex',
            'iotex',
            'nervos',
            'zilliqa',
            'terra-luna',
            'terra-luna-v2',
            'polkadot-new',
            'everscale',
            'near',
            'aion',
            'kusama',
            'aeternity',
            'kava',
            'filecoin',
            'bluzelle',
            'band',
            'theta',
            'solana',
            'multiversx-egld',
            'vechain',
            'callisto',
            'neo',
            'tomochain',
            'thundercore',
            'harmony',
            'oasis',
            'ontology',
            'tezos',
            'cardano',
            'kin',
            'qtum',
            'nebulas',
            'gochain',
            'nuls',
            'zel',
            'wanchain',
            'waves',
            'bnb',
            'polygon',
            'thorchain',
            'optimism-ethereum',
            'arbitrum',
            'huobi-token',
            'avalanche',
            'xdai',
            'fantom',
            'cronos',
            'celo',
            'ronin',
            'secret',
            'osmosis',
            'ecash',
            'cronos',
            'kava',
            'boba',
            'metis',
            'aurora',
            'evmos',
            'evmos',
            'moonriver',
            'moonbeam',
            'klaytn',
            'meter-stable',
            'okt',
            'hedera',
            'agoric',
            'injective',
            'canto',
            'toncoin'
        ]

        const slugWithProtocol = slugArr.map((v) => v + '-protocol')
        const slugWithToken = slugArr.map((v) => v + '-token')
        const slugWithNetwork = slugArr.map((v) => v + '-network')

        const url =
            'https://api.coinmarketcap.com/data-api/v3/cryptocurrency/listing?start=1&limit=10000&sortBy=market_cap&sortType=desc&cryptoType=all&aux=cmc_rank'

        let { data } = await axios.get(url)
        let listCurrencies = []
        data.data.cryptoCurrencyList.forEach((currency) => {
            if (slugArr.indexOf(currency.slug) >= 0) {
                listCurrencies.push(currency)
            } else if (slugWithProtocol.indexOf(currency.slug) >= 0) {
                currency.slug = currency.slug.replace(/-protocol$/, '')
                listCurrencies.push(currency)
            } else if (slugWithToken.indexOf(currency.slug) >= 0) {
                currency.slug = currency.slug.replace(/-token$/, '')
                listCurrencies.push(currency)
            } else if (slugWithNetwork.indexOf(currency.slug) >= 0) {
                currency.slug = currency.slug.replace(/-network$/, '')
                listCurrencies.push(currency)
            }
        })

        for (const currency of listCurrencies) {
            new Promise(async (resolve, reject) => {
                const isCurrency = await knex('coins')
                    .where({ slug: currency.slug })
                    .first()

                if (!isCurrency) {
                    await knex('coins').insert({
                        name: currency.name,
                        symbol: currency.symbol,
                        rank: currency.cmcRank,
                        coinID: currency.id,
                        slug: currency.slug
                    })
                }
            })
        }
    } catch (error) {
        console.error(error)
    }
}

async function crawl_from_tronscan() {
    try {
        const listAddressTRX = await knex('assets')
            .select('address')
            .where({ token_id: 'TRX' })

        if (listAddressTRX.length === 0) return

        await Promise.all(
            listAddressTRX.map(async (trx_address) => {
                let urlTRC20 = `https://apilist.tronscanapi.com/api/token_trc20/transfers?limit=20&start=0&sort=-timestamp&relatedAddress=${trx_address.address}`
                let urlTRC10 = `https://apilist.tronscanapi.com/api/transfer?sort=-timestamp&count=true&limit=20&start=0&address=${trx_address.address}`

                let { data: data_TRC20 } = await axios.get(urlTRC20)
                let { data: data_TRC10 } = await axios.get(urlTRC10)

                if (data_TRC20.token_transfers.length > 0) {
                    for (const transfer of data_TRC20.token_transfers) {
                        const checkHash = await knex('transfer_history')
                            .where({ hash: transfer.transaction_id })
                            .first()
                        if (checkHash) break
                        await knex('transfer_history').insert({
                            address_wallet: trx_address.address,
                            network: 'TRON',
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

                if (data_TRC10.data.length > 0) {
                    for (const transfer of data_TRC10.data) {
                        const checkHash = await knex('transfer_history')
                            .where({ hash: transfer.transactionHash })
                            .first()
                        if (checkHash) break
                        await knex('transfer_history').insert({
                            address_wallet: trx_address.address,
                            network: 'TRON',
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
            })
        )
    } catch (error) {
        console.error(error)
    }
}

async function crawl_fiats() {
    try {
        const listCodeFiats = await knex('fiats').select('code')

        let url = process.env.RATE_URL
        const { data } = await axios.get(url)

        await Promise.all(
            listCodeFiats.map(async (fiat) => {
                if (fiat.code in data.rates) {
                    await knex('fiats')
                        .where({ code: fiat.code })
                        .update({ rate: data.rates[fiat.code] })
                }
            })
        )
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    crawl_from_coinmarketcap,
    crawl_from_tronscan,
    get_service,
    crawl_fiats
}
