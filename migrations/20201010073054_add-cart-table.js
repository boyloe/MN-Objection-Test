
exports.up = function(knex) {
    return knex.schema.createTable('cart', table =>  {
        table.increments("id")
        table.integer("user_id").references("id").inTable("users")
        table.integer('item_id').references("id").inTable('items')
    })
};

exports.down = function(knex) {
    return knex.schema.dropTableIfExists('cart')
};
