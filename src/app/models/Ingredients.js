/* eslint-disable require-jsdoc */
const {Model} = require('objection');
const knex = require('../../db/knex');
const Recipes = require('./Recipes');

Model.knex(knex);

class Ingredients extends Model {
  static get tableName() {
    return 'ingredients';
  }

  static get idColumn() {
    return 'ingredientId';
  }

  static get relationMappings() {
    return {
      recipe: {
        relation: Model.HasManyRelation,
        modelClass: Recipes,
        join: {
          from: 'ingredients.ingredientId',
          to: 'recipe.ingredientId'
        }
      }
    }
  }

  $beforeUpdate() {
    this.updatedAt = 'now()';
  }
}

module.exports = Ingredients;
