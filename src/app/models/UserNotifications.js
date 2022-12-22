/* eslint-disable require-jsdoc */
const {Model} = require('objection');
const knex = require('../../db/knex');

Model.knex(knex);

class UserNotifications extends Model {
  static get tableName() {
    return 'userNotifications';
  }

  static get idColumn() {
    return ['email', 'notificationId'];
  }

  $beforeUpdate() {
    this.updatedAt = 'now()';
  }
}

module.exports = UserNotifications;
