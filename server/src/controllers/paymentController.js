const { Payment, User } = require("../models");
const Razorpay = require("razorpay");
const crypto = require("crypto");
const { Op } = require("sequelize");
const sequelize = require("../config/db-connection");
const { queueEmail } = require("../jobs/customEmailWorker");
const { paymentConfirmationTemplate } = require("../utils/emailTemplates");
const { log } = require("console");
const logger = require("../logger/logger");

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Plan pricing configuration
const PLAN_PRICING = {
  premium: {
    monthly: 9900,
    yearly: 99900,
  },
  pro: {
    monthly: 19900,
    yearly: 199900,
  },
};

// POST: Create Razorpay order
const createOrder = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const userId = req.payload.id;
    const { planType, planDuration = "monthly" } = req.body;

    // Validation
    if (!planType || !["premium", "pro"].includes(planType)) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Invalid plan type. Choose 'premium' or 'pro'.",
      });
    }

    if (!["monthly", "yearly"].includes(planDuration)) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Invalid plan duration. Choose 'monthly' or 'yearly'.",
      });
    }

    // Get amount based on plan
    const amount = PLAN_PRICING[planType][planDuration];

    // Fetch user details
    const user = await User.findByPk(userId, { transaction: t });
    if (!user) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Create receipt
    const receipt = `rcpt_${userId.substring(0, 8)}_${Date.now()}`;

    // Create Razorpay order (external API - no transaction needed)
    const razorpayOrder = await razorpay.orders.create({
      amount: amount,
      currency: "INR",
      receipt: receipt,
      notes: {
        userId: userId,
        planType: planType,
        planDuration: planDuration,
        email: user.email,
      },
    });

    // Calculate subscription validity
    const validFrom = new Date();
    const validUntil = new Date();
    if (planDuration === "monthly") {
      validUntil.setMonth(validUntil.getMonth() + 1);
    } else {
      validUntil.setFullYear(validUntil.getFullYear() + 1);
    }

    // Save payment record in database
    const payment = await Payment.create(
      {
        userId: userId,
        orderId: razorpayOrder.id,
        amount: amount,
        currency: "INR",
        status: "created",
        planType: planType,
        planDuration: planDuration,
        receipt: receipt,
        email: user.email,
        contact: user.phoneNumber?.toString(),
        validFrom: validFrom,
        validUntil: validUntil,
        metadata: {
          userName: user.name,
          userEmail: user.email,
        },
      },
      { transaction: t },
    );

    await t.commit();

    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: {
        id: razorpayOrder.id,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        receipt: razorpayOrder.receipt,
      },
      payment: {
        id: payment.id,
        planType: payment.planType,
        planDuration: payment.planDuration,
        validFrom: payment.validFrom,
        validUntil: payment.validUntil,
      },
      razorpayKeyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    await t.rollback();
    logger
    logger.error("[Create Order Error]:", error);
    next(error);
  }
};

// POST: Verify payment signature
const verifyPayment = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const userId = req.payload.id;
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      method,
    } = req.body;

    // Validation
    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Missing payment verification parameters",
      });
    }

    // Find payment record
    const payment = await Payment.findOne({
      where: { orderId: razorpay_order_id, userId: userId },
      transaction: t,
      lock: true,
    });

    if (!payment) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    // Verify signature
    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      // Update payment status to failed
      await payment.update(
        {
          status: "failed",
          errorCode: "SIGNATURE_MISMATCH",
          errorDescription: "Payment signature verification failed",
        },
        { transaction: t },
      );

      await t.commit();

      return res.status(400).json({
        success: false,
        message: "Payment verification failed",
      });
    }

    if (
      payment.status === "captured" &&
      payment.paymentId === razorpay_payment_id
    ) {
      await t.commit();
      return res.json({
        success: true,
        message: "Payment already verified",
        payment: {
          id: payment.id,
          status: payment.status,
        },
      });
    }

    // Update payment status to captured
    await payment.update(
      {
        paymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
        status: "captured",
        method: method,
      },
      { transaction: t },
    );

    // Update user tier (CRITICAL: Must succeed with payment update)
    const user = await User.findByPk(userId, { transaction: t, lock: true });
    await user.update(
      {
        tier: payment.planType,
      },
      { transaction: t },
    );

    await t.commit();

    try {
      const planDisplayName =
        payment.planType === "premium"
          ? `JobZy Premium${payment.planDuration === "yearly" ? " (Yearly)" : ""}`
          : `JobZy Pro${payment.planDuration === "yearly" ? " (Yearly)" : ""}`;

      // ✅ Simple email without features - user can check on dashboard
      const html = paymentConfirmationTemplate(
        user.name,
        planDisplayName,
        payment.amount / 100,
        payment.paymentId,
        payment.createdAt,
        payment.validFrom,
        payment.validUntil,
      );
      queueEmail("payment-confirmation", {
        userId: user.id,
        email: user.email,
        name: user.name,
        subject: `💸 Payment Successful - Welcome to ${planDisplayName}!`,
        html,
      });
      logger.info(
        ` [Payment Email] Queued for ${user.email} - ${planDisplayName}`,
      );
    } catch (emailError) {
      logger.error("⚠️ [Payment Email Error]:", emailError.message);
    }

    return res.status(200).json({
      success: true,
      message: "Payment verified and subscription activated successfully",
      payment: {
        id: payment.id,
        orderId: payment.orderId,
        paymentId: payment.paymentId,
        amount: payment.amount,
        status: payment.status,
        planType: payment.planType,
        planDuration: payment.planDuration,
        validFrom: payment.validFrom,
        validUntil: payment.validUntil,
      },
      user: {
        tier: user.tier,
      },
    });
  } catch (error) {
    await t.rollback();
    logger.error("[Verify Payment Error]:", error);
    next(error);
  }
};

// POST: Handle payment failure
const handlePaymentFailure = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const userId = req.payload.id;
    const { razorpay_order_id, error_code, error_description } = req.body;

    if (!razorpay_order_id) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    // Find payment record
    const payment = await Payment.findOne({
      where: { orderId: razorpay_order_id, userId: userId },
      transaction: t,
      lock: true,
    });

    if (!payment) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Payment record not found",
      });
    }

    // Update payment status to failed
    await payment.update(
      {
        status: "failed",
        errorCode: error_code,
        errorDescription: error_description,
      },
      { transaction: t },
    );

    await t.commit();

    return res.status(200).json({
      success: true,
      message: "Payment failure recorded",
      payment: {
        id: payment.id,
        orderId: payment.orderId,
        status: payment.status,
        errorCode: payment.errorCode,
        errorDescription: payment.errorDescription,
      },
    });
  } catch (error) {
    await t.rollback();
    logger.error("[Handle Payment Failure Error]:", error);
    next(error);
  }
};

// GET: Get payment history (No transaction needed - read-only)
const getPaymentHistory = async (req, res, next) => {
  try {
    const userId = req.payload.id;
    const { status, planType, limit = 20, offset = 0 } = req.query;

    const whereClause = { userId };

    if (status) {
      whereClause.status = status;
    }

    if (planType) {
      whereClause.planType = planType;
    }

    const payments = await Payment.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
      limit: parseInt(limit),
      offset: parseInt(offset),
    });

    const totalCount = await Payment.count({ where: whereClause });

    return res.status(200).json({
      success: true,
      count: payments.length,
      totalCount,
      payments,
    });
  } catch (error) {
    next(error);
  }
};

// GET: Get single payment by ID (No transaction needed - read-only)
const getPaymentById = async (req, res, next) => {
  try {
    const userId = req.payload.id;
    const { paymentId } = req.params;

    const payment = await Payment.findOne({
      where: { id: paymentId, userId: userId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "tier"],
        },
      ],
    });

    if (!payment) {
      return res.status(404).json({
        success: false,
        message: "Payment not found",
      });
    }

    return res.status(200).json({
      success: true,
      payment,
    });
  } catch (error) {
    next(error);
  }
};

// GET: Get active subscription (No transaction needed - read-only)
const getActiveSubscription = async (req, res, next) => {
  try {
    const userId = req.payload.id;
    const currentDate = new Date();

    const activeSubscription = await Payment.findOne({
      where: {
        userId: userId,
        status: "captured",
        validFrom: { [Op.lte]: currentDate },
        validUntil: { [Op.gte]: currentDate },
      },
      order: [["validUntil", "DESC"]],
    });

    if (!activeSubscription) {
      return res.status(200).json({
        success: true,
        message: "No active subscription found",
        subscription: null,
      });
    }

    const daysRemaining = Math.ceil(
      (activeSubscription.validUntil - currentDate) / (1000 * 60 * 60 * 24),
    );

    return res.status(200).json({
      success: true,
      subscription: {
        id: activeSubscription.id,
        planType: activeSubscription.planType,
        planDuration: activeSubscription.planDuration,
        validFrom: activeSubscription.validFrom,
        validUntil: activeSubscription.validUntil,
        daysRemaining: daysRemaining,
        amount: activeSubscription.amount,
        status: activeSubscription.status,
      },
    });
  } catch (error) {
    next(error);
  }
};

// POST: Initiate refund
const initiateRefund = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const { paymentId } = req.params;
    const { amount, reason } = req.body;

    const payment = await Payment.findOne({
      where: { id: paymentId, status: "captured" },
      transaction: t,
      lock: true,
    });

    if (!payment) {
      await t.rollback();
      return res.status(404).json({
        success: false,
        message: "Payment not found or cannot be refunded",
      });
    }

    // Razorpay refund (external API)
    const refund = await razorpay.payments.refund(payment.paymentId, {
      amount: amount || payment.amount,
      notes: {
        reason: reason || "Customer request",
      },
    });

    // Update payment record
    await payment.update(
      {
        status: "refunded",
        refundId: refund.id,
        refundAmount: refund.amount,
        refundReason: reason,
      },
      { transaction: t },
    );

    // Downgrade user tier (must succeed with payment update)
    const user = await User.findByPk(payment.userId, {
      transaction: t,
      lock: true,
    });
    await user.update({ tier: "free" }, { transaction: t });

    await t.commit();

    return res.status(200).json({
      success: true,
      message: "Refund initiated successfully",
      refund: {
        id: refund.id,
        amount: refund.amount,
        status: refund.status,
      },
    });
  } catch (error) {
    await t.rollback();
    logger.error("[Refund Error]:", error);
    next(error);
  }
};

// POST: Webhook handler
const handleWebhook = async (req, res, next) => {
  const t = await sequelize.transaction();

  try {
    const webhookSignature = req.headers["x-razorpay-signature"];
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

    // Verify webhook signature
    const generated_signature = crypto
      .createHmac("sha256", webhookSecret)
      .update(JSON.stringify(req.body))
      .digest("hex");

    if (generated_signature !== webhookSignature) {
      await t.rollback();
      return res.status(400).json({
        success: false,
        message: "Invalid webhook signature",
      });
    }

    const event = req.body.event;
    const paymentEntity = req.body.payload.payment.entity;

    // Handle different webhook events
    switch (event) {
      case "payment.captured":
        await Payment.update(
          {
            status: "captured",
            paymentId: paymentEntity.id,
            method: paymentEntity.method,
          },
          {
            where: { orderId: paymentEntity.order_id },
            transaction: t,
          },
        );
        break;

      case "payment.failed":
        await Payment.update(
          {
            status: "failed",
            errorCode: paymentEntity.error_code,
            errorDescription: paymentEntity.error_description,
          },
          {
            where: { orderId: paymentEntity.order_id },
            transaction: t,
          },
        );
        break;

      case "refund.created":
        await Payment.update(
          {
            status: "refunded",
            refundId: paymentEntity.id,
            refundAmount: paymentEntity.amount,
          },
          {
            where: { paymentId: paymentEntity.payment_id },
            transaction: t,
          },
        );
        break;

      default:
        logger.info(`Unhandled webhook event: ${event}`);
    }

    await t.commit();

    return res.status(200).json({ success: true });
  } catch (error) {
    await t.rollback();
    logger.error("[Webhook Error]:", error);
    next(error);
  }
};

module.exports = {
  createOrder,
  verifyPayment,
  handlePaymentFailure,
  getPaymentHistory,
  getPaymentById,
  getActiveSubscription,
  initiateRefund,
  handleWebhook,
};
