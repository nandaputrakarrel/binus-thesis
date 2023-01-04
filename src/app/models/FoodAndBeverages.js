/* eslint-disable require-jsdoc */
const {Model} = require('objection');
const knex = require('../../db/knex');
const Recipes = require('./Recipes');

Model.knex(knex);

class FoodAndBeverages extends Model {
  static get tableName() {
    return 'foodAndBeverages';
  }
  
  static get idColumn() {
    return 'fnbId';
  }

  static get relationMappings() {
    return {
      recipe: {
        relation: Model.HasManyRelation,
        modelClass: Recipes,
        join: {
          from: 'foodAndBeverages.fnbId',
          to: 'recipe.fnbId'
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

module.exports = FoodAndBeverages;
