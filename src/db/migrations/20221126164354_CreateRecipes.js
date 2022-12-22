
exports.up = function(knex) {
  return knex.schema.createTable('recipes', (table) => {
    table.increments('recipeId').primary();
    table.string('fnbId');
    table.string('ingredientId');
    table.integer('quantity');
    table.string('createdBy');
    table.string('updatedBy');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('recipes');
};
