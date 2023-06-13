/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.hasTable('category_application').then((exists) => {
        if (!exists) {
            return knex.schema.createTable('category_application', (table) => {
                table.bigIncrements()
                table.bigInteger('category_id').unsigned().references('category.id').onDelete('CASCADE')
                table.bigInteger('application_id').unsigned().references('application.id').onDelete('CASCADE')
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
    return knex.schema.hasTable('category_application').then((exists) => {
        if (exists) {
            return knex.schema.dropTable('category_application')
        }
    })
}
