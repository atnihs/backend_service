/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.hasTable('languages').then(exists => {
        if (!exists) {
            return knex.schema.createTable('languages', table => {
                table.string('code', 10).primary().unique();
                table.string('name').notNullable().unique();
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
    return knex.schema.hasTable('languages').then(exists => {
        if (exists) {
            return knex.schema.dropTable('languages');
        }
    });
};
