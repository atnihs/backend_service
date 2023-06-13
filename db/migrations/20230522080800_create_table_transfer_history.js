/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.hasTable('transfer_history').then(exists => {
        if (!exists) {
            return knex.schema.createTable('transfer_history', table => {
                table.bigIncrements();
                table.string('network').notNullable();
                table.string('address_wallet').notNullable();
                table.string('hash').notNullable();
                table.string('token_id').notNullable();
                table.string('contract_address').notNullable();
                table.string('contract_type').notNullable();
                table.string('status').notNullable();
                table.string('from').notNullable();
                table.string('to').notNullable();
                table.string('amount').notNullable();
                table.boolean('pushed_notify').notNullable().defaultTo(false);
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
    return knex.schema.hasTable('transfer_history').then(exists => {
        if (exists) {
            return knex.schema.dropTable('transfer_history');
        }
    });
};
