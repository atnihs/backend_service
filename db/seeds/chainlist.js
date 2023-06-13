const axios = require('axios')

function getChainName(chain) {
    switch (parseInt(chain['chainId'])) {
        case 1:
            return 'ETH Mainnet'
        case 10001:
            return 'EthereumPoW'
        case 513100:
            return 'EthereumFair'
        case 10:
            return 'Optimistic'
        case 42161:
            return 'Arbitrum'
        case 42170:
            return 'Arbitrum Nova'
        case 3:
            return 'ETH Ropsten'
        case 4:
            return 'ETH Rinkeby'
        case 42:
            return 'ETH Kovan'
        case 5:
            return 'ETH Gorli'
        case 97:
            return 'BSC Testnet'
        case 56:
            return 'BSC Mainnet'
        case 65:
            return 'OKX Testnet'
        case 66:
            return 'OKX Mainnet'
        case 250:
            return 'Fantom Mainnet'
        case 137:
            return 'Polygon Mainnet'
        case 80001:
            return 'Polygon Testnet'
        case 43114:
            return 'Avalanche Mainnet'
        case 42220:
            return 'Celo Mainnet'
        case 128:
            return 'HECO Mainnet'
        case 256:
            return 'HECO Testnet'
        case 321:
            return 'KCC Mainnet'
        case 100:
            return '(Gnosis)Xdai Mainnet'
        case 1285:
            return 'Moonriver Mainnet'
        case 25:
            return 'Cronos Mainnet'
        case 106:
            return 'Velas Mainnet'
        case 4689:
            return 'IoTeX Mainnet'
        case 1e4:
            return 'SmartBCH Mainnet'
        case 1284:
            return 'Moonbeam Mainnet'
        case 50:
            return 'XDC Mainnet'
        case 336:
            return 'Shiden'
        case 122:
            return 'Fuse'
        case 512:
            return 'Double-A Chain'
        case 8217:
            return 'Klaytn Network'
        case 16666e5:
            return 'Harmony Mainnet'
        case 9001:
            return 'Evmos'
        case 32520:
            return 'Brise Mainnet'
        case 2e3:
            return 'DogeChain'
        case 61:
            return 'Ethereum Classic'
        case 57:
            return 'SysCoin Mainnet'
        case 7700:
            return 'Canto Mainnet'
        case 1975:
            return 'ONUS Mainnet'
        case 1116:
            return 'Core Mainnet'
        case 1030:
            return 'Conflux Mainnet'
        case 314:
            return 'FileCoin Mainnet'
        case 1101:
            return 'Polygon zkEVM'
        case 369:
            return 'PulseChain'
    }
    return chain['name']
}

exports.seed = async function (knex) {
    return knex.schema.hasTable('chains').then(async (exists) => {
        if (exists) {
            const response = await axios.get('https://chainid.network/page-data/sq/d/3703536561.json')
            if (response.data && response.data['data']&& response.data['data']['allChain']['nodes']) {
                const listInsert = []
                for (const chain of response.data['data']['allChain']['nodes']) {
                    var icon = '';
                    if (chain['icon']) {
                        var nodeImages = response.data['data']['allImageSharp']['nodes'];
                        var iconLists = nodeImages.find(e => e['parent']['name'] === chain['icon']);
                        if (iconLists) {
                            icon = iconLists['gatsbyImageData']['images']['fallback']['src'];
                        }
                    }
                    if (icon.length > 0) {
                        icon = 'https://chainid.network' + icon;
                    }
                    listInsert.push({
                        id: chain['chainId'],
                        code: chain['chain'],
                        name: getChainName(chain),
                        rpc: JSON.stringify(chain['rpc']),
                        icon: icon
                    })
                }
                for (const listInsertElement of listInsert) {
                    if (!await knex('chains').where({ id: listInsertElement.id }).first()) {
                        await knex('chains').insert(listInsertElement)
                    }
                }
            }
        }
    })
}
