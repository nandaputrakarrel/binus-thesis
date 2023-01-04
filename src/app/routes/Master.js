/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
const MasterController = require('../controllers/MasterController');
const {handlerException} = require('../exceptions/handler');
const authenticateToken = require('../validations/authenticateToken');

router.get('/fnb',
  handlerException(authenticateToken),
  handlerException(MasterController.getFnb));

router.get('/ingredients',
  handlerException(authenticateToken),
  handlerException(MasterController.getIngredients));

router.get('/recipes',
  handlerException(authenticateToken),
  handlerException(MasterController.getRecipes));

router.post('/fnb',
  handlerException(authenticateToken),
  handlerException(MasterController.createFnb));

router.post('/ingredients',
  handlerException(authenticateToken),
  handlerException(MasterController.createIngredient));

router.post('/recipes',
  handlerException(authenticateToken),
  handlerException(MasterController.createRecipe));

router.patch('/fnb/:fnbId',
  handlerException(authenticateToken),
  handlerException(MasterController.updateFnb));

router.patch('/ingredients/:ingredientId',
  handlerException(authenticateToken),
  handlerException(MasterController.updateIngredient));

router.get('/push-notification',
  handlerException(authenticateToken),
  handlerException(MasterController.pushRandomNotification));

router.post('/stock-update',
  handlerException(authenticateToken),
  handlerException(MasterController.stockUpdate));

router.get('/stocks',
  handlerException(authenticateToken),
  handlerException(MasterController.getStocking));

router.get('/dashboard/cards',
  handlerException(authenticateToken),
  handlerException(MasterController.getDashboardCards));

router.get('/dashboard/chart',
    handlerException(authenticateToken),
    handlerException(MasterController.getDashboardChart));

module.exports = router;
