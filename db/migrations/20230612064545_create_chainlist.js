/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.hasTable('chains').then(exists => {
        if (!exists) {
            return knex.schema.createTable('chains', table => {
                table.bigIncrements();
                table.string('code').notNullable();
                table.string('name').notNullable();
                table.string('icon').nullable();
                table.json('rpc').nullable();
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
    return knex.schema.hasTable('chains').then(exists => {
        if (exists) {
            return knex.schema.dropTable('chains');
        }
    });
};
