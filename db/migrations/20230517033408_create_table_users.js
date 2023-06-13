/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.hasTable('users').then(exists => {
        if (!exists) {
            return knex.schema.createTable('users', table => {
                table.bigIncrements();
                table.string('name').notNullable();
                table.string('device_id').notNullable();
                table.timestamp('created_at').defaultTo(knex.fn.now());
                table.timestamp('updated_at').defaultTo(knex.fn.now());
                table.unique(['name', 'device_id']);
            });
        }
    });
};

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.hasTable('users').then(exists => {
        if (exists) {
            return knex.schema.dropTable('users');
        }
    });
};
