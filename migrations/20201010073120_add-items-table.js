const { table } = require("../database");

exports.up =  function(knex) {
    return knex.schema.createTable('items', table =>  {
        table.increments()
        table.string('name')

    })
};

exports.down = async function(knex) { 
    return knex.schema.dropTableIfExits('items')
};
