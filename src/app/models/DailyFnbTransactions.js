/* eslint-disable require-jsdoc */
const {Model} = require('objection');
const knex = require('../../db/knex');
const FoodAndBeverages = require('./FoodAndBeverages');

Model.knex(knex);

class DailyFnbTransactions extends Model {
  static get tableName() {
    return 'dailyFnbTransactions';
  }

  static get relationMappings() {
    return {
      recipe: {
        relation: Model.BelongsToOneRelation,
        modelClass: FoodAndBeverages,
        join: {
          from: 'dailyFnbTransactions.fnbId',
          to: 'foodAndBeverages.fnbId'
          
        }
      }
    }
  }

  $beforeInsert() {
    this.createdAt = 'now()';
  }

  $beforeUpdate() {
    this.updatedAt = 'now()';
  }
}

module.exports = DailyFnbTransactions;
