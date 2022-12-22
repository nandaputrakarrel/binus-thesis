const MasterService = require('../services/MasterService');

async function getFnb(req, res) {
  const page = req.query.page || 1;
  const size = req.query.size || 10;
  const sort = req.query.sort;
  const result = await MasterService.getFnb({
    page: page,
    size: size,
    sort: sort,
    query: req.query
  });
  res.status(200).send({
    status: 200,
    paging: {
      totalData: result.total,
      totalPage: Math.ceil(result.total / size),
    },
    data: result.results,
  });
}

async function getIngredients(req, res) {
  const page = req.query.page || 1;
  const size = req.query.size || 10;
  const sort = req.query.sort;
  const result = await MasterService.getIngredients({
    page: page,
    size: size,
    sort: sort,
    query: req.query
  });
  res.status(200).send({
    status: 200,
    paging: {
      totalData: result.total,
      totalPage: Math.ceil(result.total / size),
    },
    data: result.results,
  });
}

async function getRecipes(req, res) {
  const page = req.query.page || 1;
  const size = req.query.size || 10;
  const sort = req.query.sort;
  const result = await MasterService.getRecipes({
    page: page,
    size: size,
    sort: sort,
    query: req.query
  });
  res.status(200).send({
    status: 200,
    paging: {
      totalData: result.total,
      totalPage: Math.ceil(result.total / size),
    },
    data: result.results,
  });
}

async function createFnb(req, res) {
  await MasterService.createFnb({request: req.body});
  res.status(200).send({
    status: 200,
    data: 'Food and Beverages Successfully Created.',
  });
}

async function createIngredient(req, res) {
  await MasterService.createIngredient({request: req.body});
  res.status(200).send({
    status: 200,
    data: 'Ingredient Successfully Created.',
  });
}

async function createRecipe(req, res) {
  await MasterService.createRecipe({request: req.body});
  res.status(200).send({
    status: 200,
    data: 'Recipe Successfully Created.',
  });
}

async function pushRandomNotification(req, res) {
  await MasterService.pushRandomNotification();
  res.status(200).send({
    status: 200,
    data: 'Notification Successfully Pushed.',
  });
}

async function stockUpdate(req, res) {
  await MasterService.stockUpdate({request: req.body});
  res.status(200).send({
    status: 200,
    data: 'Stock Successfully Updated.',
  });
}

module.exports = {
  getFnb,
  getIngredients,
  getRecipes,
  createFnb,
  createIngredient,
  createRecipe,
  pushRandomNotification,
  stockUpdate
}