/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.hasTable('translation').then(exists => {
        if (!exists) {
            return knex.schema.createTable('translation', table => {
                table.increments();
                table.string('code_id').notNullable();
                table.foreign('code_id').references('languages.code').onDelete('CASCADE');
                table.string('key').notNullable();
                table.text('value').notNullable();
                table.timestamp('created_at').defaultTo(knex.fn.now());
                table.timestamp('updated_at').defaultTo(knex.fn.now());
                table.unique(['code_id', 'key']);
            });
        }
    });
};

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.hasTable('translation').then(exists => {
        if (exists) {
            return knex.schema.dropTable('translation');
        }
    });
};
