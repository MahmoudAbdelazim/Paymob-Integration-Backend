const express = require('express');

const authController = require('../controllers/auth');

const router = express.Router();

router.get(
  '/authenticatedUser',
  authController.getAuthenticatedUser
);

module.exports = router;