/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.hasTable('config').then(exists => {
        if (!exists) {
            return knex.schema.createTable('config', table => {
                table.increments();
                table.string('key').notNullable().unique();
                table.string('value').notNullable();
                table.timestamp('created_at').defaultTo(knex.fn.now());
                table.timestamp('updated_at').defaultTo(knex.fn.now());
            });
        }
    });
};

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.hasTable('config').then(exists => {
        if (exists) {
            return knex.schema.dropTable('config');
        }
    });
};
