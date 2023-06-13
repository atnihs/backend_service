const WebSocket = require('ws')
const _ = require('lodash')
const knex = require('../db/knex')
const fs = require('fs')
const path = require('path')

async function chunkFile() {
    try {
        await knex('coins')
            .select('coinID')
            .orderBy('id')
            .then((coins) => {
                const chunks = _.chunk(coins, 50)
                chunks.forEach((chunk, index) => {
                    const data = chunk.map((coin) => coin.coinID).join(',')

                    const folderPath = __dirname + `/../data/coins/`
                    if (!fs.existsSync(folderPath)) {
                        fs.mkdirSync(folderPath, { recursive: true })
                    }
                    fs.writeFileSync(
                        __dirname + `/../data/coins/chunks_${index + 1}.txt`,
                        data
                    )
                })
            })
    } catch (error) {
        console.error(error)
    }
}

chunkFile().then(() => {
    const ws = new WebSocket(
        'wss://push.coinmarketcap.com/ws?device=web&client_source=home_page',
        {
            headers: {
                'User-Agent':
                    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/113.0.0.0 Safari/537.36'
            }
        }
    )
    ws.on('message', async function message(data) {
        // console.log('received: %s', data)
        await bulkWriteData(JSON.parse(data.toString()))
    })
    ws.on('open', function open() {
        const folderPath = __dirname + `/../data/coins/`
        fs.readdir(folderPath, (err, files) => {
            if (err) return
            files.forEach((file) => {
                const filePath = path.join(folderPath, file)
                fs.readFile(filePath, 'utf-8', (err, data) => {
                    if (err) return
                    ws.send(`{"method":"RSUBSCRIPTION","params":["main-site@crypto_price_15s@{}@normal","${data}"]}`)
                })
            })
        })
    })
})

async function bulkWriteData(data) {
    try {
        if ('d' in data) {
            const checkID = await knex('coins')
                .select('id', 'slug')
                .where({ coinID: data.d.id })
                .first()
            if (!checkID) return
            global.io.emit('prices', {
                change_24h: data.d.p24h,
                price: data.d.p,
                slug: checkID.slug,
                id: checkID.id,
                provider: 'coinmarketcap'
            })
            await knex('coins_detail').insert({
                coin_id: checkID.id,
                price: data.d.p,
                volume24h: data.d.v,
                marketCap: data.d.mc,
                percentChange1h: data.d.p1h,
                percentChange24h: data.d.p24h,
                percentChange7d: data.d.p7d,
                percentChange30d: data.d.p30d
            })
        }
    } catch (error) {
        console.error(error)
    }
}
