/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.hasTable('notification_user').then(exists => {
        if (!exists) {
            return knex.schema.createTable('notification_user', table => {
                table.bigIncrements()
                table.bigInteger('notify_id').unsigned().notNullable()
                table.foreign('notify_id').references('notify.id').onDelete('CASCADE')
                table.integer('user_id').notNullable()
                table.boolean('read').defaultTo(0)
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
    return knex.schema.hasTable('notification_user').then((exists) => {
        if (exists) {
            return knex.schema.dropTable('notification_user')
        }
    })
}
