/* eslint-disable require-jsdoc */
const {Model} = require('objection');
const knex = require('../../db/knex');
const Ingredients = require('./Ingredients');

Model.knex(knex);

class DailyIngredientRequirements extends Model {
  static get tableName() {
    return 'dailyIngredientRequirements';
  }

  static get relationMappings() {
    return {
      recipe: {
        relation: Model.BelongsToOneRelation,
        modelClass: Ingredients,
        join: {
          from: 'dailyIngredientRequirements.ingredientId',
          to: 'ingredients.ingredientId'
          
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

module.exports = DailyIngredientRequirements;
