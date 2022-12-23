
exports.up = function(knex) {
  return knex.schema.createTable('stockingTransactionDetails', (table) => {
    table.increments('stockingDetailsId').primary();
    table.integer('stockingId');
    table.string('ingredientId');
    table.integer('amount');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('stockingTransactionDetails');
};
