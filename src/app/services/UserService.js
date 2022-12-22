require('dotenv').config();
const bcrypt = require('bcrypt');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

const Users = require('../models/Users');
const Notification = require('../models/Notifications');

const DataExisted = require('../exceptions/DataExisted');
const DataNotFound = require('../exceptions/DataNotFound');
const InvalidCredentials = require('../exceptions/InvalidCredentials');
const InactiveUser = require('../exceptions/InactiveUser.js');
const InvalidData = require('../exceptions/InvalidData');


const secretString = process.env.JWT_SECRET || 'binus-thesis';
const salt = 10;

async function signIn(user) {
  const schema = Joi.object({
    'email': Joi.string().required(),
    'password': Joi.string().required(),
  });

  const {error} = schema.validate(user);

  if (error) {
    throw new InvalidData(error.details[0].message);
  }

  const selectedUser = await Users.query()
    .select('password', 'isActive')
    .where('email', user.email)
    .first();

  if (!selectedUser) {
    throw new InvalidCredentials();
  }

  if (!bcrypt.compareSync(user.password, selectedUser.password)) {
    throw new InvalidCredentials();
  }

  const userResult = await Users.query()
    .select('email', 'fullName')
    .where('email', user.email)
    .first();

  if (!selectedUser.isActive) {
    throw new InactiveUser();
  }

  userResult.token = await generateToken(userResult.email);

  await updateLastLogin(userResult.email, new Date());

  return userResult;
}

async function generateToken(email) {
  const expires = new Date().setDate(new Date().getDate() + 1);
  const token = jwt.sign({
    iss: 'BinusThesis',
    sub: email,
    iat: new Date().getTime(),
    exp: expires,
  }, secretString);

  return token;
}

async function refreshToken(email) {
  return {
    token: await generateToken(email),
  };
}

async function verifyToken(token) {
  try {
    jwt.verify(token, secretString);
  } catch (err) {
    throw new InvalidCredentials();
  }
}

async function verifyTokenAdmin(token) {
  try {
    const sub = jwt.verify(token, secretString).sub;
    if (sub != process.env.ADMIN_EMAIL) {
      throw new InvalidCredentials();
    }
  } catch (err) {
    throw new InvalidCredentials();
  }
}

async function changePassword(request, token) {
  const schema = Joi.object({
    'currentPassword': Joi.string().required(),
    'newPassword': Joi.string().required(),
    'confirmPassword': Joi.string().required(),
  });

  const {error} = schema.validate(request);

  if (error) {
    throw new InvalidData(error.details[0].message);
  }

  const email = await getEmailFromToken(token);
  const password = await Users.query()
    .select('password')
    .where('email', email)
    .first();

  if (!bcrypt.compareSync(request.currentPassword, password)) {
    throw new InvalidCredentials();
  }

  if (request.newPassword != request.confirmPassword) {
    throw new InvalidData('New Password and Confirm Password does not match.');
  }

  await Users.query()
      .update({
        password: bcrypt.hashSync(request.newPassword, salt),
      });
}

async function getEmailFromToken(token) {
  try {
    return jwt.verify(token, secretString).sub;
  } catch (err) {
    throw new InvalidCredentials();
  }
}

async function getUserByEmail(email) {
  const user = await Users.query()
    .select('email', 'fullName')
    .where('email', email)
    .first();

  return user;
}


async function createUser(user) {
  const userSchema = Joi.object({
    'email': Joi.string().required(),
    'fullName': Joi.string().required(),
    'password': Joi.string().required()
  });

  const {error} = userSchema.validate(user);

  if (error) {
    throw new InvalidData(error.details[0].message);
  }
  const validateEmail = await getUserByEmail(user.email);

  if (validateEmail) {
    throw new DataExisted();
  }

  try {
    await Users.query().insert(user);
    return await getUserByEmail(user.email);
  } catch (err) {
    throw new InvalidData(`Something wrong!`);
  }
}

async function updateLastLogin(email, lastLogin) {
  const validateEmail = await getUserByEmail(email);
  if (!validateEmail) {
    throw new DataNotFound();
  }

  try {
    const updatedUser = await Users.query()
        .update({
          lastLogin: lastLogin,
        })
        .where('email', email);
    return updatedUser;
  } catch (err) {
    throw new InvalidData();
  }
}

async function getNotification({page, size, token}) {
  const email = jwt.verify(token, secretString).sub;
  const result = await Notification.query()
  .where('email', email);

  return {
    results: size === '*' ? result : result.slice((page - 1) * size, page * size),
    total: result.length,
  };
}

async function updateNotificationReadAll(token) {
  const email = jwt.verify(token, secretString).sub;

  await Notification.query()
  .update({
    isRead: true
  })
  .where('email', email);
}

module.exports = {
  signIn,
  generateToken,
  refreshToken,
  verifyToken,
  verifyTokenAdmin,
  changePassword,
  getEmailFromToken,
  getUserByEmail,
  createUser,
  getNotification,
  updateNotificationReadAll,
}
