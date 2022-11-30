const UserService = require('../services/UserService');
const InvalidCredentials = require('../exceptions/InvalidCredentials');

module.exports = async (req, res, next) => {
  const token = req.header('Authorization');
  if (token == undefined) {
    res.status(401).send({
      status: 401,
      message: 'Authorization is required.',
    });
  } else {
    try {
      await UserService.verifyToken(token.split(' ')[1]);
    } catch (err) {
      throw new InvalidCredentials();
    }
    next();
  }
};
