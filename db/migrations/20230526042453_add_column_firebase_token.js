/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.hasColumn('users', 'firebase_token').then((exists) => {
        if (!exists) {
            return knex.schema.alterTable('users', table => {
                table.string('firebase_token').nullable()
            });
        }
    })
}

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.hasColumn('users', 'firebase_token').then((exists) => {
        if (exists) {
            return knex.schema.alterTable('users', table => {
                table.dropColumn('firebase_token');
            });
        }
    })
}
