require('dotenv').config();
const {raw} = require('objection');
const Joi = require('joi');

const FoodAndBeverages = require('../models/FoodAndBeverages');
const Ingredients = require('../models/Ingredients');
const Recipes = require('../models/Recipes');

const InvalidData = require('../exceptions/InvalidData');
const DataExisted = require('../exceptions/DataExisted');
const DataNotFound = require('../exceptions/DataNotFound');

async function getFnb({page, size, sort, query}) {
  const ops = FoodAndBeverages.query().select('fnbId', 'name');
  let sortBy = 'createdAt';
  let orderBy = 'asc';
  if (sort) {
    sortBy = sort.split(':')[0];
    orderBy = sort.split(':')[1];
  }

  if (query.search) {
    const search = query.search;
    ops.orWhere(raw('lower("name")'), 'like', '%'+search.toLowerCase()+'%');
  }

  if (query.fnbId) {
    const result = await ops.where('fnbId', query.fnbId).first();
    if (result) {
      return {
        results: result,
        total: 1
      }
    }
    throw new DataNotFound(`FnbId ${query.fnbId} is not found.`);
  }

  const result = await ops.orderBy(sortBy, orderBy);

  return {
    results: size === '*' ? result : result.slice((page - 1) * size, page * size),
    total: result.length,
  };
}

async function getIngredients({page, size, sort, query}) {
  const ops = Ingredients.query().select('ingredientId', 'name', 'stock');

  let sortBy = 'createdAt';
  let orderBy = 'asc';
  if (sort) {
    sortBy = sort.split(':')[0];
    orderBy = sort.split(':')[1];
  }

  if (query.search) {
    const search = query.search;
    ops.orWhere(raw('lower("name")'), 'like', '%'+search.toLowerCase()+'%');
  }

  if (query.ingredientId) {
    const result = await ops.where('ingredientId', query.ingredientId).first();
    return {
      results: result,
      total: 1
    }
  }

  const result = await ops.orderBy(sortBy, orderBy);

  return {
    results: size === '*' ? result : result.slice((page - 1) * size, page * size),
    total: result.length,
  };
}

async function getRecipes({page, size, sort, query}) {
  const ops = Recipes.query().select('recipeId', 'fnbId', 'ingredientId', 'quantity');
  ops.select()

  let sortBy = 'createdAt';
  let orderBy = 'asc';
  if (sort) {
    sortBy = sort.split(':')[0];
    orderBy = sort.split(':')[1];
  }

  const fnbs = await FoodAndBeverages.query().select('fnbId', 'name');
  const ingredients = await Ingredients.query().select('ingredientId', 'name', 'stock');

  if (query.fnbId) {
    ops.andWhere('fnbId', query.fnbId)
  }

  if (query.ingredientId) {
    ops.andWhere('ingredientId', query.ingredientId)
  }

  let result = await ops.orderBy(sortBy, orderBy);

  for(const eachResult of result) {
    eachResult.fnb = fnbs.find((e) => e.fnbId == eachResult.fnbId);
    eachResult.ingredient = ingredients.find((e) => e.ingredientId == eachResult.ingredientId);
  }

  if (query.search) {
    result = result.filter(
      (e) => e.fnb.name.toLowerCase().includes(query.search.toLowerCase() )
      || e.ingredient.name.toLowerCase().includes(query.search.toLowerCase()));
  }

  return {
    results: size === '*' ? result : result.slice((page - 1) * size, page * size),
    total: result.length,
  };
}

async function createFnb({request}) {
  const schema = Joi.object({
    'fnbId': Joi.string().required(),
    'name': Joi.string().required(),
  });

  const {error} = schema.validate(request);

  if (error) {
    throw new InvalidData(error.details[0].message);
  }

  const checkExist = await getFnb({query: {fnbId: request.fnbId}});

  if (checkExist.total > 0) {
    throw new DataExisted(`FnbId ${request.fnbId} is already registered.`)
  }

  return await FoodAndBeverages.query()
      .insert(request);
}

async function createIngredient({request}) {
  const schema = Joi.object({
    'ingredientId': Joi.string().required(),
    'name': Joi.string().required(),
  });

  const {error} = schema.validate(request);

  if (error) {
    throw new InvalidData(error.details[0].message);
  }
  
  const checkExist = await getIngredients({query: {ingredientId: request.ingredientId}});

  if (checkExist.total > 0) {
    throw new DataExisted(`IngredientId ${request.ingredientId} is already registered.`)
  }

  return await Ingredients.query()
      .insert(request);
}

async function createRecipe({request}) {
  const schema = Joi.object({
    'fnbId': Joi.string().required(),
    'ingredients': Joi.array().items(Joi.object({
      'ingredientId': Joi.string().required(),
      'quantity': Joi.number().required()
    })).required(),
  });

  const {error} = schema.validate(request);

  if (error) {
    throw new InvalidData(error.details[0].message);
  }
  
  await getFnb({query: {fnbId: request.fnbId}});

  const insertData = [];
  for (const eachIngredient of request.ingredients) {
    await getIngredients({query: {ingredientId: eachIngredient.ingredientId}});
    
    insertData.push({
      fnbId: request.fnbId,
      ingredientId: eachIngredient.ingredientId,
      quantity: eachIngredient.quantity
    });
  }

  // await Recipes.query()
  // .where('fnbId', request.fnbId)
  // .del()

  // return await Recipes.query()
  //     .insert(insertData);
}

module.exports = {
  getFnb,
  getIngredients,
  getRecipes,
  createFnb,
  createIngredient,
  createRecipe,
}