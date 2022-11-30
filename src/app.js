/* eslint-disable new-cap */
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const logger = require('morgan');

const app = express();

const logFormat = {
  remote: ':remote-addr',
  user: ':remote-user',
  method: ':method',
  path: ':url',
  code: ':status',
  size: ':res[content-length]',
  agent: ':user-agent',
  responseTime: ':response-time',
};

app.use(logger(JSON.stringify(logFormat)));

const corsOptions = {
  origin: process.env.CORS_WHITELIST.split(','),
  methods: process.env.CORS_METHODS.split(','),
};

app.use(cors(corsOptions));
app.use(express.json({limit: '1mb'}));
app.use(express.urlencoded({limit: '1mb', extended: true}));

fs.readdirSync(__dirname + '/app/routes').filter((file) => {
  return file.toLowerCase().endsWith('.js');
}).forEach((eachFile) => {
  app.use('/', require(__dirname + '/app/routes/' + eachFile));
});

const defaultPort = process.env.PORT || 3000;
app.listen(defaultPort, () => {
  console.log(`Services started at port : ${defaultPort}`);
});

// Error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (typeof err.handle === 'function') {
    err.handle();
  }

  if (err.printMsg === undefined) {
    console.error(err);
  }

  res.status(err.statusCode || 500).json({
    status: err.statusCode || 500,
    message: err.printMsg || 'Something went wrong!',
  });
});
