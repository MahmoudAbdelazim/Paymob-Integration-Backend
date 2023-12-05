require("dotenv").config();
const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("./models/user");
const authRoutes = require("./routes/auth");
const transactionRoutes = require("./routes/transaction");
const userRoutes = require("./routes/user");
const sequelize = require("./util/database");

const app = express();

app.use(express.json({ limit: "10mb" }));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/auth", authRoutes);
app.use("/transaction", transactionRoutes);
app.use("/user", userRoutes);

app.use((error, req, res, next) => {
  console.error(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

const port = process.env.PORT || 3005;
sequelize
  .sync({ force: true })
  // .sync()
  .then(async (result) => {
    // Creating a default admin user
    const hashedPw = await bcrypt.hash(process.env.ADMIN_PASSWORD, 12);
    User.create({
      username: process.env.ADMIN_USERNAME,
      password: hashedPw,
      phoneNumber: process.env.ADMIN_PHONE_NUMBER,
      role: "ADMIN",
      firstName: process.env.ADMIN_FIRST_NAME,
      lastName: process.env.ADMIN_LAST_NAME,
    });
    app.listen(port);
  })
  .catch((err) => {
    console.error(err);
  });

module.exports = app;
