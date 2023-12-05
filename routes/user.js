const express = require("express");

const userController = require("../controllers/user");

const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.get("/getAllUsers", authenticate, userController.getAllUsers);

module.exports = router;
