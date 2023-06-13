/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.hasTable('notify').then((exists) => {
        if (exists) {
            return knex.schema.alterTable('notify', (table) => {
                table.dropColumn('title')
                table.dropColumn('body')
                table.dropColumn('link')
                table.text('data', 'longtext').nullable()
            })
        }
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.hasTable('notify').then((exists) => {
        if (exists) {
            return knex.schema.alterTable('notify', (table) => {
                table.dropColumn('data')
            })
        }
    })
}
