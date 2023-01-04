/* eslint-disable require-jsdoc */
const {Model} = require('objection');
const knex = require('../../db/knex');

Model.knex(knex);

class StockingTransactions extends Model {
  static get tableName() {
    return 'stockingTransactions';
  }

  static get idColumn() {
    return 'stockingTransactionId';
  }

  $beforeInsert() {
    this.createdAt = 'now()';
  }

  $beforeUpdate() {
    this.updatedAt = 'now()';
  }
}

module.exports = StockingTransactions;
