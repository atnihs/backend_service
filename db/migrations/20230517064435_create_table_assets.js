/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.hasTable('assets').then(exists => {
        if (!exists) {
            return knex.schema.createTable('assets', table => {
                table.bigIncrements();
                table.string('name').notNullable();
                table.string('device_id').notNullable();
                table.string('token_id').notNullable();
                table.string('address').notNullable();
                table.timestamp('created_at').defaultTo(knex.fn.now());
                table.timestamp('updated_at').defaultTo(knex.fn.now());
                table.unique(['device_id', 'token_id', 'address']);
            });
        }
    });
};

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.hasTable('assets').then(exists => {
        if (exists) {
            return knex.schema.dropTable('assets');
        }
    });
};
