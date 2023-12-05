const express = require("express");

const authController = require("../controllers/auth");

const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.post("/signup", authController.signup);

router.post("/login", authController.login);

router.get("/getUserBasicInfo", authenticate, authController.getUserBasicInfo);

module.exports = router;
