exports.seed = async function (knex) {
    return knex.schema.hasTable('fiats').then(async (exists) => {
        if (exists) {
            const listInsert = [
                {
                    name: 'Vietnam Dong',
                    code: 'VND',
                    symbol: '₫',
                    position: 'after',
                    decimal: 0,
                    rate: 0
                },
                {
                    name: 'US Dollar',
                    code: 'USD',
                    symbol: '$',
                    position: 'before',
                    decimal: 2,
                    rate: 1
                }
            ]

            for (const listInsertElement of listInsert) {
                if (!await knex('fiats').where({ code: listInsertElement.code }).first()) {
                    await knex('fiats').insert(listInsertElement)
                }
            }
        }
    })
}
