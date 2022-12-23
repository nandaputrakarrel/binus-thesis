/* eslint-disable require-jsdoc */
const {Model} = require('objection');
const knex = require('../../db/knex');

Model.knex(knex);

class StockingTransactionDetails extends Model {
  static get tableName() {
    return 'stockingTransactionDetails';
  }

  static get idColumn() {
    return 'stockingDetailsId';
  }

  $beforeUpdate() {
    this.updatedAt = 'now()';
  }
}

module.exports = StockingTransactionDetails;