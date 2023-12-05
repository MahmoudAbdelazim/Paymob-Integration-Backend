const express = require("express");

const transactionController = require("../controllers/transaction");

const authenticate = require("../middleware/authenticate");

const router = express.Router();

router.post("/start-transaction", authenticate, transactionController.startTransaction);
router.get("/get-my-transactions", authenticate, transactionController.getMyTransactions);
router.get("/get-transactions-of-user/:username", authenticate, transactionController.getTransactionsOfUser);

module.exports = router;
