
exports.up = function(knex) {
  return knex.schema.createTable('foodAndBeverages', (table) => {
    table.string('fnbId').primary();
    table.string('name');
    table.string('createdBy');
    table.string('updatedBy');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('foodAndBeverages');
};
