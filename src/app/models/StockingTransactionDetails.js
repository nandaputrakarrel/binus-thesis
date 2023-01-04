/* eslint-disable require-jsdoc */
const {Model} = require('objection');
const knex = require('../../db/knex');

Model.knex(knex);

class StockingTransactionDetails extends Model {
  static get tableName() {
    return 'stockingTransactionDetails';
  }

  static get idColumn() {
    return 'stockingTransactionDetailsId';
  }

  $beforeInsert() {
    this.createdAt = 'now()';
  }

  $beforeUpdate() {
    this.updatedAt = 'now()';
  }
}

module.exports = StockingTransactionDetails;
