const { User } = require("../models");
const tierLimits = require("../utils/tierLimits");

const checkJobQuota = async (req, res, next) => {
  try {
    const userId = req.payload.id;

    // Fetch user with current usage
    const user = await User.findByPk(userId, {
      attributes: ["id", "tier", "monthlyJobsUsed", "lastReset"],
    });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    // Check if monthly reset is needed (new month started)
    const now = new Date();
    const lastReset = new Date(user.lastReset);
    const isNewMonth =
      now.getMonth() !== lastReset.getMonth() ||
      now.getFullYear() !== lastReset.getFullYear();

    if (isNewMonth) {
      // Reset counter for new month
      await user.update({
        monthlyJobsUsed: 0,
        lastReset: now,
      });
      user.monthlyJobsUsed = 0; // Update in-memory object
    }

    // Get tier limit
    const limit = tierLimits[user.tier];

    // Check if limit reached (pro has Infinity, so will never fail)
    if (limit !== Infinity && user.monthlyJobsUsed >= limit) {
      return res.status(403).json({
        success: false,
        error: "Monthly job limit reached",
        message: `You have reached your ${user.tier} plan limit of ${limit} jobs/month. Upgrade to create more!`,
        quota: {
          tier: user.tier,
          used: user.monthlyJobsUsed,
          limit,
          remaining: 0,
        },
      });
    }

    // Attach quota info to request for use in controller
    req.userQuota = {
      tier: user.tier,
      used: user.monthlyJobsUsed,
      limit: limit === Infinity ? "Unlimited" : limit,
      remaining:
        limit === Infinity ? "Unlimited" : limit - user.monthlyJobsUsed,
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = checkJobQuota;
