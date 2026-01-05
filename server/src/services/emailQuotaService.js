const { User } = require("../models");
const tierLimits = require("../config/tierLimits.config");

/**
 * Check if user can send email based on quota
 * @param {string} userId - User ID
 * @returns {Promise<{allowed: boolean, quota: object}>}
 */
const checkEmailQuota = async (userId) => {
  try {
    const user = await User.findByPk(userId, {
      attributes: ["tier", "monthlyEmailsSent", "lastReset"],
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Check monthly reset
    const now = new Date();
    const lastReset = new Date(user.lastReset);
    const isNewMonth =
      now.getMonth() !== lastReset.getMonth() ||
      now.getFullYear() !== lastReset.getFullYear();

    if (isNewMonth) {
      await user.update({
        monthlyEmailsSent: 0,
        lastReset: now,
      });
      user.monthlyEmailsSent = 0;
    }

    // Get tier limit
    const limits = tierLimits[user.tier];
    const emailLimit = limits.emailsPerMonth;

    // Check if limit reached
    const allowed =
      emailLimit === Infinity || user.monthlyEmailsSent < emailLimit;

    return {
      allowed,
      quota: {
        tier: user.tier,
        used: user.monthlyEmailsSent,
        limit: emailLimit === Infinity ? "Unlimited" : emailLimit,
        remaining:
          emailLimit === Infinity
            ? "Unlimited"
            : Math.max(0, emailLimit - user.monthlyEmailsSent),
      },
      user,
    };
  } catch (error) {
    console.error("[Email Quota Service] Error:", error);
    throw error;
  }
};

/**
 * Increment email counter after sending
 * @param {string} userId - User ID
 */
const incrementEmailCount = async (userId) => {
  try {
    const user = await User.findByPk(userId);
    if (user) {
      await user.increment("monthlyEmailsSent");
    }
  } catch (error) {
    console.error("[Email Quota Service] Increment Error:", error);
  }
};

module.exports = {
  checkEmailQuota,
  incrementEmailCount,
};
