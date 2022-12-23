require('dotenv').config();
const {raw} = require('objection');
const Joi = require('joi');

const FoodAndBeverages = require('../models/FoodAndBeverages');
const Ingredients = require('../models/Ingredients');
const Notifications = require('../models/Notifications');
const Recipes = require('../models/Recipes');
const StockingTransactionDetails = require('../models/StockingTransactionDetails')
const StockingTransactions = require('../models/StockingTransactions')
const Users = require('../models/Users');
const UserNotifications = require('../models/UserNotifications');

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
  const ops = Ingredients.query().select('ingredientId', 'name', 'stock', 'stockTreshold');

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
    'stock': Joi.number().required(),
    'stockTreshold': Joi.number().required(),
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

async function pushRandomNotification() {
  const allUsers = await Users.query().select('email');
  const ingredients = ['Egg', 'Milk', 'Coffee'];
  const randomValue = Math.floor(Math.random() * 3);
  const notification = await Notifications.query().insert({
    title: `${ingredients[randomValue]} is running out`,
    subTitle: `Current stock of ${ingredients[randomValue]} is less than 100.`
  })
  for (const eachEmail of allUsers) {
    await UserNotifications.query().insert({
      notificationId: notification.notificationId,
      email: eachEmail.email
    })
  }
}

async function getStocking({page, size, sort, query}) {
  const ops = StockingTransactions.query().select('stockingId', 'kindOfIngredients', 'isIn', 'createdAt');
  let sortBy = 'createdAt';
  let orderBy = 'asc';
  if (sort) {
    sortBy = sort.split(':')[0];
    orderBy = sort.split(':')[1];
  }

  if (query.stockingId) {
    const result = await ops.where('stockingId', query.stockingId).first();
    return {
      results: result ? result : null,
      total: result ? 1 : 0
    }
  }

  const result = await ops.orderBy(sortBy, orderBy);
  for(const eachStockTransaction of result) {
    eachStockTransaction.ingredients = await StockingTransactionDetails.query()
        .select('ingredientId', 'amount')
        .where('stockingId', eachStockTransaction.stockingId);
  }

  return {
    results: size === '*' ? result : result.slice((page - 1) * size, page * size),
    total: result.length,
  };
}

async function stockUpdate({request}) {
  const schema = Joi.object({
    'isIn': Joi.boolean().required(),
    'ingredients': Joi.array().items(
      Joi.object({
        'ingredientId': Joi.string().required(),
        'amount': Joi.number().required(),
      })
    ).required(),
  });

  const {error} = schema.validate(request);

  if (error) {
    throw new InvalidData(error.details[0].message);
  }

  const stocking = await StockingTransactions.query().insert({
    kindOfIngredients: request.ingredients.length,
    isIn: request.isIn
  })

  for(const eachIngredient of request.ingredients) {
    if (request.isIn) {
      await stockIn(eachIngredient);
    } else {
      await stockOut(eachIngredient);
    }
    
    await StockingTransactionDetails.query().insert({
      stockingId: stocking.stockingId,
      ingredientId: eachIngredient.ingredientId,
      amount: eachIngredient.amount,
    })
    pushNotification(eachIngredient)
  }
}

async function stockIn({ingredientId, amount}) {
  const selectedIngredient = await getIngredients({query: {ingredientId: ingredientId}});
  if (selectedIngredient.total == 0) {
    return;
  }
  await Ingredients.query()
    .update({stock: selectedIngredient.results.stock + amount})
    .where('ingredientId', ingredientId)
}

async function stockOut({ingredientId, amount}) {
  const selectedIngredient = await getIngredients({query: {ingredientId: ingredientId}});
  if (selectedIngredient.total == 0) {
    return;
  }
  await Ingredients.query()
    .update({stock: selectedIngredient.results.stock - amount})
    .where('ingredientId', ingredientId)
}

async function pushNotification({ingredientId}) {
  const selectedIngredient = await getIngredients({query: {ingredientId: ingredientId}});
  const allUsers = await Users.query().select('email');
  const notification = await Notifications.query().insert({
    title: `${selectedIngredient.results.name} is running out`,
    subTitle: `Current stock of ${selectedIngredient.results.name} is less than ${selectedIngredient.results.stockTreshold}.`
  })
  for (const eachEmail of allUsers) {
    await UserNotifications.query().insert({
      notificationId: notification.notificationId,
      email: eachEmail.email
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
  pushRandomNotification,
  getStocking,
  stockUpdate,
}