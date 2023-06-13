/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.hasTable('application').then(exists => {
        if (!exists) {
            return knex.schema.createTable('application', table => {
                table.bigIncrements()
                table.string('name').notNullable()
                table.double('coin').notNullable()
                table.string('logo').notNullable()
                table.string('url').notNullable()
                table.text('description').notNullable()
                table.boolean('is_verify').notNullable().defaultTo(false)
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
    return knex.schema.hasTable('application').then((exists) => {
        if (exists) {
            return knex.schema.dropTable('application')
        }
    })
}
