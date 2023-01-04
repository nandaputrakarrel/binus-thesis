const MasterService = require('../services/MasterService');

async function getFnb(req, res) {
  const page = req.query.page || 1;
  const size = req.query.size || 10;
  const sort = req.query.sortBy;
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
  const sort = req.query.sortBy;
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
  const sort = req.query.sortBy;
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

async function updateFnb(req, res) {
  await MasterService.updateFnb({request: req.body, id: req.params.fnbId});
  res.status(200).send({
    status: 200,
    data: 'Food and Beverages Successfully Updated.',
  });
}

async function updateIngredient(req, res) {
  await MasterService.updateIngredient({request: req.body, id: req.params.ingredientId});
  res.status(200).send({
    status: 200,
    data: 'Ingredient Successfully Updated.',
  });
}

async function pushRandomNotification(req, res) {
  await MasterService.pushRandomNotification();
  res.status(200).send({
    status: 200,
    data: 'Notification Successfully Pushed.',
  });
}

async function getStocking(req, res) {
  const page = req.query.page || 1;
  const size = req.query.size || 10;
  const sort = req.query.sortBy;
  const result = await MasterService.getStocking({
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

async function stockUpdate(req, res) {
  await MasterService.stockUpdate({request: req.body});
  res.status(200).send({
    status: 200,
    data: 'Stock Successfully Updated.',
  });
}

async function getDashboardCards(req, res) {
  const response = await MasterService.getDashboardCards();
  res.status(200).send({
    status: 200,
    data: response,
  });
}

async function getDashboardChart(req, res) {
  const response = await MasterService.getDashboardChart({ingredientIds: req.query.ingredientIds});
  res.status(200).send({
    status: 200,
    data: response,
  });
}

module.exports = {
  getFnb,
  getIngredients,
  getRecipes,
  createFnb,
  createIngredient,
  createRecipe,
  updateFnb,
  updateIngredient,
  pushRandomNotification,
  getStocking,
  stockUpdate,
  getDashboardCards,
  getDashboardChart
}