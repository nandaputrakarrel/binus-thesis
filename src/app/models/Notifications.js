/* eslint-disable require-jsdoc */
const {Model} = require('objection');
const knex = require('../../db/knex');

Model.knex(knex);

class Notifications extends Model {
  static get tableName() {
    return 'notifications';
  }

  static get idColumn() {
    return 'notificationId';
  }

  $beforeInsert() {
    this.createdAt = 'now()';
  }

  $beforeUpdate() {
    this.updatedAt = 'now()';
  }
}

module.exports = Notifications;
