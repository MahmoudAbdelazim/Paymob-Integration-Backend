const transactionServices = require("../services/transaction");

exports.startTransaction = async (req, res, next) => {
  try {
    const user = req.user;
    const amount = req.body.amount;
    const email = req.body.email;
    const response = await transactionServices.startTransactionService(
      user,
      amount,
      email
    );
    if (response.status == 200) {
      res.status(200).json({
        paymentKey: response.paymentKey,
        transaction: response.transaction,
      });
    } else {
      const error = new Error(response?.message);
      error.statusCode = response.status;
      throw error;
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};

exports.getMyTransactions = async (req, res, next) => {
  try {
    const user = req.user;
    const response = await transactionServices.getTransactionsService(user);
    if (response.status == 200) {
      res.status(200).json({
        transactions: response.transactions,
      });
    } else {
      const error = new Error(response?.message);
      error.statusCode = response.status;
      throw error;
    }
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};
