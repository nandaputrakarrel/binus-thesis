require('dotenv').config();
const {raw} = require('objection');
const Joi = require('joi');

const FoodAndBeverages = require('../models/FoodAndBeverages');
const Ingredients = require('../models/Ingredients');
const Notifications = require('../models/Notifications');
const Recipes = require('../models/Recipes');
const Users = require('../models/Users');

const InvalidData = require('../exceptions/InvalidData');
const DataExisted = require('../exceptions/DataExisted');

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
    ops.orWhere(raw('lower("fnbId")'), 'like', '%'+search.toLowerCase()+'%');
  }

  if (query.fnbId) {
    const result = await ops.where('fnbId', query.fnbId).first();
    return {
      results: result ? result : null,
      total: result ? 1 : 0
    }
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
    ops.orWhere(raw('lower("ingredientId")'), 'like', '%'+search.toLowerCase()+'%');
  }

  if (query.ingredientId) {
    const result = await ops.where('ingredientId', query.ingredientId).first();
    return {
      results: result ? result : null,
      total: result ? 1 : 0
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

  const recipes = await ops.orderBy(sortBy, orderBy);
  const result = [];

  for(const eachRecipe of recipes) {
    eachRecipe.fnb = fnbs.find((e) => e.fnbId == eachRecipe.fnbId);
    eachRecipe.ingredient = ingredients.find((e) => e.ingredientId == eachRecipe.ingredientId);
    if (query.search) {
      if (!eachRecipe.fnb || !eachRecipe.ingredient) {
        continue;
      }

      if (!eachRecipe.fnb.name.toLowerCase().includes(query.search.toLowerCase()) &&
        !eachRecipe.fnb.fnbId.toLowerCase().includes(query.search.toLowerCase()) &&
        !eachRecipe.ingredient.name.toLowerCase().includes(query.search.toLowerCase()) &&
        !eachRecipe.ingredient.ingredientId.toLowerCase().includes(query.search.toLowerCase())) {
          continue;
        }
    }
    result.push(eachRecipe);
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

  await Recipes.query()
  .where('fnbId', request.fnbId)
  .del()

  return await Recipes.query()
      .insert(insertData);
}

async function pushNotification() {
  const allUsers = await Users.query().select('email');
  const ingredients = ['Egg', 'Milk', 'Coffee'];
  for (const eachEmail of allUsers) {
    const randomValue = Math.floor(Math.random() * 3);
    await Notifications.query().insert({
      email: eachEmail.email,
      title: `${ingredients[randomValue]} is running out`,
      subTitle: `Current stock of ${ingredients[randomValue]} is less than 100.`
    })
  }
}

module.exports = {
  getFnb,
  getIngredients,
  getRecipes,
  createFnb,
  createIngredient,
  createRecipe,
  pushNotification,
}