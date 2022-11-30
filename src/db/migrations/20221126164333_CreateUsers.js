
exports.up = function(knex) {
  return knex.schema.createTable('users', (table) => {
    table.string('email').primary();
    table.string('fullName');
    table.string('password');
    table.boolean('isActive').defaultTo(true);
    table.timestamp('lastLogin');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('users');
};
