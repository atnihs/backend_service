/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema.hasTable('coins_detail').then((exists) => {
        if (!exists) {
            return knex.schema.createTable('coins_detail', (table) => {
                table.bigIncrements()
                table.bigInteger('coin_id').unsigned().notNullable()
                table
                    .foreign('coin_id')
                    .references('coins.id')
                    .onDelete('CASCADE')
                table
                    .double('price')
                    .notNullable()
                    .defaultTo(0)
                    .comment('Giá của coin hiện tại')
                table
                    .double('volume24h')
                    .notNullable()
                    .defaultTo(0)
                    .comment('Khối lượng giao dịch trong vòng 24h')
                table
                    .double('marketCap')
                    .notNullable()
                    .defaultTo(0)
                    .comment('Tổng giá trị của coin trên thị trường')
                table
                    .double('percentChange1h')
                    .notNullable()
                    .defaultTo(0)
                    .comment('Tỉ lệ phần trăm thay đổi trong vòng 1h')
                table
                    .double('percentChange24h')
                    .notNullable()
                    .defaultTo(0)
                    .comment('Tỉ lệ phần trăm thay đổi trong vòng 24h')
                table
                    .double('percentChange7d')
                    .notNullable()
                    .defaultTo(0)
                    .comment('Tỉ lệ phần trăm thay đổi trong vòng 7days')
                table
                    .double('percentChange30d')
                    .notNullable()
                    .defaultTo(0)
                    .comment('Tỉ lệ phần trăm thay đổi trong vòng 30days')
                table.timestamp('created_at').defaultTo(knex.fn.now())
                table.timestamp('updated_at').defaultTo(knex.fn.now())
            })
        }
    })
}

/**
 * @param { import('knex').Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
    return knex.schema.hasTable('coins_detail').then((exists) => {
        if (exists) {
            return knex.schema.dropTable('coins_detail')
        }
    })
}
