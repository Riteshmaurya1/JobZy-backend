const { body, param, query } = require("express-validator");

// POST: /payments/create-order
const validateCreateOrder = [
  body("planType")
    .trim()
    .notEmpty()
    .withMessage("Plan type is required")
    .isIn(["premium", "pro"])
    .withMessage("Plan type must be one of: premium, pro"),

  body("planDuration")
    .optional({ checkFalsy: true })
    .trim()
    .isIn(["monthly", "yearly"])
    .withMessage("Plan duration must be one of: monthly, yearly"),
];

// POST: /payments/verify (Verify Razorpay payment)
const validateVerifyPayment = [
  body("razorpay_order_id")
    .trim()
    .notEmpty()
    .withMessage("Razorpay order ID is required")
    .matches(/^order_/)
    .withMessage('Invalid order ID format (must start with "order_")'),

  body("razorpay_payment_id")
    .trim()
    .notEmpty()
    .withMessage("Razorpay payment ID is required"),

  body("razorpay_signature")
    .trim()
    .notEmpty()
    .withMessage("Razorpay signature is required")
    .isLength({ min: 64 })
    .withMessage("Invalid signature format (must be at least 64 characters)"),

  body("method")
    .optional({ checkFalsy: true })
    .trim()
    .isIn(["card", "netbanking", "upi", "wallet", "emi"])
    .withMessage(
      "Payment method must be one of: card, netbanking, upi, wallet, emi",
    ),
];

// POST: /payments/failure (Handle payment failure)
const validateHandlePaymentFailure = [
  body("razorpay_order_id")
    .trim()
    .notEmpty()
    .withMessage("Razorpay order ID is required")
    .matches(/^order_/)
    .withMessage('Invalid order ID format (must start with "order_")'),

  body("error_code")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 50 })
    .withMessage("Error code must not exceed 50 characters"),

  body("error_description")
    .optional({ checkFalsy: true })
    .trim()
    .isLength({ max: 500 })
    .withMessage("Error description must not exceed 500 characters"),
];

// GET: /payments/history (Get payment history)
const validateGetPaymentHistory = [
  query("status")
    .optional({ checkFalsy: true })
    .trim()
    .isIn(["created", "captured", "failed"])
    .withMessage("Status must be one of: created, captured, failed"),

  query("planType")
    .optional({ checkFalsy: true })
    .trim()
    .isIn(["premium", "pro"])
    .withMessage("Plan type must be one of: premium, pro"),

  query("limit")
    .optional({ checkFalsy: true })
    .isInt({ min: 1, max: 100 })
    .withMessage("Limit must be between 1 and 100"),

  query("offset")
    .optional({ checkFalsy: true })
    .isInt({ min: 0 })
    .withMessage("Offset must be a non-negative number"),
];

// GET: /payments/:paymentId (Get single payment)
const validateGetPaymentById = [
  param("paymentId").trim().notEmpty().withMessage("Payment ID is required"),
];

module.exports = {
  validateCreateOrder,
  validateVerifyPayment,
  validateHandlePaymentFailure,
  validateGetPaymentHistory,
  validateGetPaymentById,
};
