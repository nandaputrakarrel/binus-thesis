/* eslint-disable new-cap */
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');
const {handlerException} = require('../exceptions/handler');
const authenticateToken = require('../validations/authenticateToken');
const authenticateTokenAdmin = require('../validations/authenticateTokenAdmin');

router.post('/auth/signin',
  handlerException(UserController.signIn));

router.get('/auth/refresh-token',
  handlerException(authenticateToken),
  handlerException(UserController.refreshToken));

router.post('/auth/change-password',
  handlerException(authenticateToken),
  handlerException(UserController.changePassword));

router.post('/auth/create-user',
  handlerException(authenticateTokenAdmin),
  handlerException(UserController.createUser));

router.get('/me',
  handlerException(authenticateToken),
  handlerException(UserController.getSelf));

module.exports = router;
