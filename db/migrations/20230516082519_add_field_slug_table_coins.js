/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.hasTable('coins').then((exists) => {
        if (exists) {
            return knex.schema.alterTable('coins', (table) => {
                table.string('slug', 20).nullable()
            })
        }
    })
}

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.hasTable('coins').then((exists) => {
        if (exists) {
            return knex.schema.alterTable('coins', (table) => {})
        }
    })
}
