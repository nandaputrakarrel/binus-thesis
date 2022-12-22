
exports.up = function(knex) {
  return knex.schema.createTable('notifications', (table) => {
    table.increments('notificationId').primary();
    table.string('title');
    table.string('subTitle');
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('notifications');
};
