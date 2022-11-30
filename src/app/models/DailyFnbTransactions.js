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
          from: 'recipe.fnbId',
          to: 'foodAndBeverages.fnbId'
          
        }
      }
    }
  }

  $beforeUpdate() {
    this.updatedAt = 'now()';
  }
}

module.exports = DailyFnbTransactions;
