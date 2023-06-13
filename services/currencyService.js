const knex = require('../db/knex')

const getCurrency = async ({ slug }) => {
    try {
        const slugs = slug.split(',')

        const tickers = await Promise.all(
            slugs.map(async (slug) => {
                const result = await knex('coins')
                    .select(
                        'coins.id',
                        'coins.slug',
                        'coins_detail.price',
                        'coins_detail.percentChange24h'
                    )
                    .leftJoin(
                        'coins_detail',
                        'coins.id',
                        'coins_detail.coin_id'
                    )
                    .where('coins.slug', slug)
                    .orderBy('coins_detail.updated_at', 'DESC')
                    .orderBy('coins_detail.id', 'DESC')
                    .limit(1)
                    .first()

                if (result) {
                    const data = {
                        provider: 'coinmarketcap',
                        ...result,
                        change_24h: result.percentChange24h
                    }
                    delete data.percentChange24h
                    return { provider: 'coinmarketcap', ...data }
                }
            })
        )

        const filteredTickers = tickers.filter((ticker) => ticker !== undefined)

        return {
            status: true,
            data: { currency: 'USD', tickers: filteredTickers }
        }
    } catch (error) {
        console.error(error)
    }
}

const getFiats = async () => {
    try {
        const data = await knex('fiats').select('name', 'code','symbol','position','decimal','rate')
        if (data.length === 0) return { status: true, data: '' }

        return {
            status: true,
            data,
        }
    } catch (error) {
        console.error(error)
    }
}

module.exports = {
    getCurrency,
    getFiats,
}
