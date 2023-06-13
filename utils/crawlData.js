const cron = require('node-cron')
const { crawl_from_coinmarketcap, crawl_fiats } = require('../helper/crawl/crawl')

const taskCrawlCoins = cron.schedule('0 */12 * * *', () => {
    crawl_from_coinmarketcap().then().catch()
    console.log('Running task crawl coins from coinmarketcap every 12 hours')
})

// const taskCrawlTronScan = cron.schedule('*/1 * * * *', () => {
//     crawl_from_tronscan().then().catch()
//     console.log('Running task crawl transfer from TronScan every 1 minute')
// })

const taskCrawlFiats = cron.schedule('*/15 * * * *', () => {
    crawl_fiats().then().catch()
    console.log('Running task crawl fiat every 15 minute')
})

function start() {
    crawl_from_coinmarketcap().then().catch()
    taskCrawlCoins.start()
    crawl_fiats().then().catch()
    taskCrawlFiats.start()
}

module.exports = { start }
