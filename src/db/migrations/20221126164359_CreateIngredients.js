
exports.up = function(knex) {
  return knex.schema.createTable('ingredients', (table) => {
    table.string('ingredientId').primary();
    table.string('name');
    table.integer('stock');
    table.integer('stockTreshold');
    table.string('createdBy');
    table.string('updatedBy');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('ingredients');
};
