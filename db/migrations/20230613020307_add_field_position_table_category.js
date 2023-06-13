/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.hasTable('category').then((exists) => {
        if (exists) {
            return knex.schema.alterTable('category', (table) => {
                table.integer('position').notNullable()
            })
        }
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.hasTable('category').then((exists) => {
        if (exists) {
            return knex.schema.alterTable('category', (table) => {
                table.dropColumn('position')
            })
        }
    })
}
