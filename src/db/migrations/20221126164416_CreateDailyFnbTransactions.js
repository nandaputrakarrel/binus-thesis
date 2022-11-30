
exports.up = function(knex) {
  return knex.schema.createTable('dailyFnbTransactions', (table) => {
    table.increments('transactionId').primary();
    table.string('fnbId');
    table.integer('amount');
    table.date('transactionDate');
    table.string('createdBy');
    table.string('updatedBy');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('dailyFnbTransactions');
};
