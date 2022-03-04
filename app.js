const express = require('express');
const cookieParser = require('cookie-parser');
require('dotenv').config();
const config = require('./config/database');
const logger = require('morgan')
const userRouter = require('./routes/userroute');

const { PORT } = process.env;
//app initialization
const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false}));
app.use(cookieParser());

app.use('/', userRouter);

app.listen( PORT, async () => {
  await config();
console.log(`Server listening on port ${PORT}`)
})

module.exports = app;
