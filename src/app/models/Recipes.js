/* eslint-disable require-jsdoc */
const {Model} = require('objection');
const knex = require('../../db/knex');
const FoodAndBeverages = require('./FoodAndBeverages');
const Ingredients = require('./Ingredients');

Model.knex(knex);

class Recipes extends Model {
  static get tableName() {
    return 'recipes';
  }

  static get idColumn() {
    return 'recipeId';
  }

  static get relationMappings() {
    return {
      ingredients: {
        relation: Model.BelongsToOneRelation,
        modelClass: Ingredients,
        join: {
          from: 'recipe.ingredientId',
          to: 'ingredients.ingredientId'
        }
      },
      foodAndBeverages: {
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

module.exports = Recipes;
