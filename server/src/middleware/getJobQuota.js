const { User } = require("../models");
const tierLimits = require("../utils/tierLimits");

// Middleware to fetch quota without blocking
const getJobQuota = async (req, res, next) => {
  try {
    const userId = req.payload.id;

    const user = await User.findByPk(userId, {
      attributes: ["tier", "monthlyJobsUsed", "lastReset"],
    });

    if (!user) {
      return next();
    }

    // Check for monthly reset
    const now = new Date();
    const lastReset = new Date(user.lastReset);
    const isNewMonth =
      now.getMonth() !== lastReset.getMonth() ||
      now.getFullYear() !== lastReset.getFullYear();

    let currentUsage = user.monthlyJobsUsed;

    if (isNewMonth) {
      await user.update({ monthlyJobsUsed: 0, lastReset: now });
      currentUsage = 0;
    }

    const limit = tierLimits[user.tier];

    req.userQuota = {
      tier: user.tier,
      used: currentUsage,
      limit: limit === Infinity ? "Unlimited" : limit,
      remaining: limit === Infinity ? "Unlimited" : limit - currentUsage,
      resetDate: new Date(now.getFullYear(), now.getMonth() + 1, 1), // Next month 1st
    };

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = getJobQuota;