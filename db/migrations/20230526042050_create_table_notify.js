/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function(knex) {
    return knex.schema.hasTable('notify').then(exists => {
        if (!exists) {
            return knex.schema.createTable('notify', table => {
                table.bigIncrements();
                table.string('notify_title',255).nullable();
                table.string('notify_content',255).nullable();
                table.string('notify_image',255).nullable();
                table.text('title', 'mediumtext').nullable();
                table.text('body', 'longtext').nullable();
                table.string('link', 255).nullable();
                table.string('type', 50).nullable();
                table.string('type_detail', 255).nullable();
                table.text('variables', 'longtext').nullable();
                table.timestamp('created_at').defaultTo(knex.fn.now())
                table.timestamp('updated_at').defaultTo(knex.fn.now())
            });
        }
    });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.hasTable('notify').then((exists) => {
        if (exists) {
            return knex.schema.dropTable('notify')
        }
    })
}
