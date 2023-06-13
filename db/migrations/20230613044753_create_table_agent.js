/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.hasTable('agent').then((exists) => {
        if (!exists) {
            return knex.schema.createTable('agent', (table) => {
                table.bigIncrements()
                table.string('agent').notNullable()
                table.string('address').notNullable()
                table.string('phone').notNullable().unique()
                table.integer('status').notNullable().defaultTo(1)
                table.timestamp('created_at').defaultTo(knex.fn.now())
                table.timestamp('updated_at').defaultTo(knex.fn.now())
            })
        }
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.hasTable('agent').then((exists) => {
        if (exists) {
            return knex.schema.dropTable('agent')
        }
    })
}
