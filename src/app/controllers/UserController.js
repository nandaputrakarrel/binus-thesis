const UserService = require('../services/UserService');

async function signIn(req, res) {
  const authentication = await UserService.signIn(req.body);
  res.send({
    status: 200,
    message: 'User logged in.',
    data: authentication,
  });
}

async function refreshToken(req, res) {
  const email = req.header('x-email');
  const token = req.header('x-token');
  const refreshedToken = await UserService.refreshToken(email, token);
  res.status(200).send({
    status: 200,
    message: 'Token Refreshed!!',
    data: refreshedToken,
  });
}


async function getSelf(req, res) {
  const email = await UserService.getemailFromToken(req.header('Authorization').split(' ')[1]);
  const user = await UserService.getUser(email);
  res.status(200).send({
    status: 200,
    data: user,
  });
}


async function changePassword(req, res) {
  await UserService.changePassword(req.body, req.header('Authorization'));
  res.status(201).send({
    status: 201,
    message: 'Password Changed!',
  });
}

module.exports = {
  signIn,
  refreshToken,
  getSelf,
  changePassword,
}