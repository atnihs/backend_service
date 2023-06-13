/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.hasTable('assets').then((exists) => {
        if (exists) {
            return knex.schema.alterTable('assets', (table) => {
                try {
                    table.dropUnique(['device_id', 'token_id', 'address'])
                } catch (e) {
                }
            })
        }
    })
}

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.hasTable('assets').then((exists) => {
        if (exists) {
            return knex.schema.alterTable('assets', (table) => {
                try {
                    table.unique(['device_id', 'token_id', 'address'])
                } catch (e) {
                }
            })
        }
    })
}
