/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.hasTable('fiats').then(exists => {
        if (!exists) {
            return knex.schema.createTable('fiats', table => {
                table.bigIncrements();
                table.string('name', 50).notNullable();
                table.string('code', 10).notNullable();
                table.string('symbol', 5).notNullable();
                table.string('position', 10).notNullable();
                table.integer('decimal').notNullable();
                table.double('rate').notNullable().defaultTo(0);
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
    return knex.schema.hasTable('fiats').then(exists => {
        if (exists) {
            return knex.schema.dropTable('fiats');
        }
    });
};
