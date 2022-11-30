/* eslint-disable require-jsdoc */
const {Model} = require('objection');
const knex = require('../../db/knex');

Model.knex(knex);

class Users extends Model {
  static get tableName() {
    return 'users';
  }

  $beforeUpdate() {
    this.updatedAt = 'now()';
  }
}

module.exports = Users;
