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
  const email = await UserService.getEmailFromToken(req.header('Authorization').split(' ')[1]);
  const user = await UserService.getUserByEmail(email);
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

async function createUser(req, res) {
  await UserService.createUser(req.body);
  res.status(201).send({
    status: 201,
    message: 'User created!',
  });
}

async function getNotification(req, res) {
  const page = req.query.page || 1;
  const size = req.query.size || 10;
  const token = req.header('Authorization');
  const result = await UserService.getNotification({
    page: page,
    size: size,
    token: token.split(' ')[1]
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

async function updateNotificationReadAll(req, res) {
  const token = req.header('Authorization');
  await UserService.updateNotificationReadAll(token.split(' ')[1]);
  res.status(200).send({
    status: 200,
    data: 'Notification Successfully marked as read.',
  });
}

module.exports = {
  signIn,
  refreshToken,
  getSelf,
  changePassword,
  createUser,
  getNotification,
  updateNotificationReadAll,
}