require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const { auth } = require('express-openid-connect');
const router = require("./router/router");

const sequelize = require("./util/database");

const app = express();

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: 'a long, randomly-generated string stored in env',
  baseURL: 'http://localhost:3000',
  clientID: 'Ow5urIc8zpe3eGoaBgv51eCM8OBSkUov',
  issuerBaseURL: 'https://dev-8uv0c3p610gnk0ri.us.auth0.com'
};

app.use(auth(config));

app.use(function (req, res, next) {
  res.locals.user = req.oidc.user;
  next();
});

app.use(function (req, res, next) {
  res.locals.user = req.oidc.user;
  next();
});

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/", router);

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

const port = process.env.PORT || 3005;
sequelize
  .sync({ force: true })
  // .sync()
  .then((result) => {
    app.listen(port);
  })
  .catch((err) => {
    console.log(err);
  });

module.exports = app;
