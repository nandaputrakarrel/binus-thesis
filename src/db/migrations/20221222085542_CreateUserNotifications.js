
exports.up = function(knex) {
  return knex.schema.createTable('userNotifications', (table) => {
    table.integer('notificationId');
    table.string('email');
    table.boolean('isRead').defaultTo(false);
    table.timestamp('createdAt').defaultTo(knex.fn.now());
    table.timestamp('updatedAt').defaultTo(knex.fn.now());
  });
};

exports.down = function(knex) {
  return knex.schema.dropTableIfExists('userNotifications');
};
