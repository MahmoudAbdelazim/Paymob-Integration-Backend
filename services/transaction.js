const transactionValidators = require("../validators/transaction");
const database = require("./database");

const getToken = async () => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    api_key: process.env.PAYMOB_API_KEY,
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      "https://accept.paymob.com/api/auth/tokens",
      requestOptions
    );
    if (response.status == 201) {
      const result = await response.json();
      return result?.token;
    }
  } catch (err) {
    console.error(err);
  }
};

const createOrder = async (authToken, amount) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    auth_token: authToken,
    delivery_needed: "false",
    amount_cents: amount,
    currency: "EGP",
    items: [],
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      "https://accept.paymob.com/api/ecommerce/orders",
      requestOptions
    );
    if (response.status == 201) {
      const result = await response.json();
      return {
        id: result.id,
        receiverPhone: result?.merchant?.phones[0],
        receiverEmail: result?.merchant?.company_emails[0],
        receiverCompanyName: result?.merchant?.company_name,
        receiverCountry: result?.merchant?.country,
        receiverCity: result?.merchant?.city,
      };
    }
  } catch (err) {
    console.error(err);
  }
};

const requestPaymentKey = async (
  authToken,
  orderId,
  amount,
  firstName,
  lastName,
  email,
  phoneNumber
) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    auth_token: authToken,
    amount_cents: amount,
    expiration: 3600,
    order_id: `${orderId}`,
    currency: "EGP",
    integration_id: 4402298,
    billing_data: {
      apartment: "NA",
      email: email,
      floor: "NA",
      first_name: firstName,
      street: "NA",
      building: "NA",
      phone_number: phoneNumber,
      shipping_method: "NA",
      postal_code: "NA",
      city: "NA",
      country: "NA",
      last_name: lastName,
      state: "NA",
    },
  });

  var requestOptions = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow",
  };

  try {
    const response = await fetch(
      "https://accept.paymob.com/api/acceptance/payment_keys",
      requestOptions
    );
    console.log(response.status);
    if (response.status == 201) {
      const result = await response.json();
      return { token: result.token };
    } else if (response.status == 400) {
      return {message: "An error occured, please try again"}
    }
  } catch (err) {
    console.error(err);
  }
};

exports.startTransactionService = async (user, amount, email) => {
  const validation = transactionValidators.validateTransaction(amount);
  if (!validation.valid) {
    return { status: 400, message: validation.message };
  }
  amount = amount * 100; // from cents to EGP pounds
  const authToken = await getToken();
  const order = await createOrder(authToken, amount);
  const response = await requestPaymentKey(
    authToken,
    order.id,
    amount,
    user.firstName,
    user.lastName,
    email,
    user.phoneNumber
  );
  if (!response.error) {
    const paymentKey = response.token;
    const transaction = await database.saveTransaction(user, order, amount / 100);
    return { status: 200, paymentKey: paymentKey, transaction: transaction };
  } else {
    return { status: 400, message: response.message };
  }
};

exports.getTransactionsService = async(user) => {
  const transactions = await database.getTransactionsOfUser(user.username);
  return {status: 200, transactions: transactions};
}
