const express = require("express");
const paymentRouter = express.Router();

const {
  createOrder,
  verifyPayment,
  handlePaymentFailure,
  getPaymentHistory,
  getPaymentById,
  getActiveSubscription,
  handleWebhook
} = require("../controllers/paymentController");

const isAuth = require("../middleware/verifyJwt");

// Public routes
paymentRouter.post("/payments/webhook", handleWebhook);

// Protected routes
paymentRouter.use(isAuth);

// Order management
paymentRouter.post("/payments/create-order", createOrder);
paymentRouter.post("/payments/verify", verifyPayment);
paymentRouter.post("/payments/failure", handlePaymentFailure);

// Payment history and subscription
paymentRouter.get("/payments/history", getPaymentHistory);
paymentRouter.get("/payments/subscription", getActiveSubscription);
paymentRouter.get("/payments/:paymentId", getPaymentById);

module.exports = paymentRouter;
