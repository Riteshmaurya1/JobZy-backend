const express = require("express");
const paymentRouter = express.Router();

const {
  createOrder,
  verifyPayment,
  handlePaymentFailure,
  getPaymentHistory,
  getPaymentById,
  getActiveSubscription,
  handleWebhook,
} = require("../controllers/paymentController");

const {
  validateCreateOrder,
  validateVerifyPayment,
  validateHandlePaymentFailure,
  validateGetPaymentHistory,
  validateGetPaymentById,
} = require("../validations/paymentValidator");

const isAuth = require("../middleware/verifyJwt");
const validationErrorHandler = require("../middleware/validationErrorHandler");
const verifyRazorpayWebhook = require("../middleware/verifyRazorpayWebhook");

// Public routes
paymentRouter.post("/payments/webhook", handleWebhook);

// Protected routes
paymentRouter.use(isAuth);

// Order management
paymentRouter.post(
  "/payments/create-order",
  validateCreateOrder,
  validationErrorHandler,
  createOrder,
);
paymentRouter.post(
  "/payments/verify",
  validateVerifyPayment,
  validationErrorHandler,
  verifyPayment,
);
paymentRouter.post(
  "/payments/failure",
  validateHandlePaymentFailure,
  validationErrorHandler,
  handlePaymentFailure,
);

// Payment history and subscription
paymentRouter.get(
  "/payments/history",
  validateGetPaymentHistory,
  validationErrorHandler,
  getPaymentHistory,
);

paymentRouter.post("/payments/webhook", verifyRazorpayWebhook, handleWebhook);

paymentRouter.get("/payments/subscription", getActiveSubscription);

paymentRouter.get("/payments/:paymentId", getPaymentById);

module.exports = paymentRouter;
