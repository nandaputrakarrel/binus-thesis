
exports.up = function(knex) {
  return knex.schema.createTable('stockingTransactions', (table) => {
    table.increments('stockingId').primary();
    table.integer('kindOfIngredients');
    table.boolean('isIn');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('stockingTransactions');
};
