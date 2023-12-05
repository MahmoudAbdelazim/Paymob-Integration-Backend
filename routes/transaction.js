const express = require("express");

const transactionController = require("../controllers/transaction");

const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.post("/start-transaction", authenticate, transactionController.startTransaction);
router.get("/get-my-transactions", authenticate, transactionController.getMyTransactions);

module.exports = router;
