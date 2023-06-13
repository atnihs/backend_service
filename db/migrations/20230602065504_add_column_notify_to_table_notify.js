/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.hasColumn('notify', 'notify_to').then((exists) => {
        if (!exists) {
            return knex.schema.alterTable('notify', table => {
                table.string('notify_to').nullable()
            });
        }
    })
}

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.hasColumn('notify', 'notify_to').then((exists) => {
        if (exists) {
            return knex.schema.alterTable('notify', table => {
                table.dropColumn('notify_to');
            });
        }
    })
}
