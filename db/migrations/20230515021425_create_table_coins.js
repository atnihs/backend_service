/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.hasTable('coins').then(exists => {
        if (!exists) {
            return knex.schema.createTable('coins', table => {
                table.bigIncrements();
                table.string('name').notNullable().comment('Tên của coin');
                table.string('symbol').notNullable().comment('Mã của coin');
                table.integer('coinID').notNullable().comment('Coin ID từ coinmarketcap');
                table.integer('rank').notNullable().comment('Xếp hạng của coin');
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
    return knex.schema.hasTable('coins').then(exists => {
        if (exists) {
            return knex.schema.dropTable('coins');
        }
    });
};
