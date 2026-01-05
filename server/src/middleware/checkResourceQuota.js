const { User } = require("../models");
const tierLimits = require("../config/tierLimits.config");

/**
 * Middleware to check resource quota
 * @param {string} resourceType - Type of resource (jobs, interviews, aiResumeGenerations, etc.)
 * @param {boolean} blockOnLimit - If true, blocks when limit reached
 */
const checkResourceQuota = (resourceType, blockOnLimit = true) => {
  return async (req, res, next) => {
    try {
      const userId = req.payload.id;

      // Fetch user with usage stats
      const user = await User.findByPk(userId, {
        attributes: [
          "id",
          "tier",
          "monthlyJobsUsed",
          "totalInterviews",
          "totalNotes",
          "monthlyAIResumes",
          "monthlyATSChecks",
          "monthlyEmailsSent",
          "lastReset",
        ],
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // ✅ Check if monthly reset is needed
      const now = new Date();
      const lastReset = new Date(user.lastReset);
      const isNewMonth =
        now.getMonth() !== lastReset.getMonth() ||
        now.getFullYear() !== lastReset.getFullYear();

      if (isNewMonth) {
        // Reset all monthly counters
        await user.update({
          monthlyJobsUsed: 0,
          monthlyAIResumes: 0,
          monthlyATSChecks: 0,
          monthlyEmailsSent: 0,
          lastReset: now,
        });

        // Update in-memory values
        user.monthlyJobsUsed = 0;
        user.monthlyAIResumes = 0;
        user.monthlyATSChecks = 0;
        user.monthlyEmailsSent = 0;
      }

      // ✅ Get tier limits
      const limits = tierLimits[user.tier] || tierLimits.free;
      const limit = limits[resourceType];

      // ✅ Get current usage
      const usageMap = {
        jobs: user.monthlyJobsUsed,
        interviews: user.totalInterviews,
        notes: user.totalNotes,
        aiResumeGenerations: user.monthlyAIResumes,
        atsChecks: user.monthlyATSChecks,
        emailsPerMonth: user.monthlyEmailsSent,
      };

      const currentUsage = usageMap[resourceType] || 0;

      // ✅ Check if limit reached
      if (blockOnLimit && limit !== Infinity && currentUsage >= limit) {
        return res.status(403).json({
          success: false,
          error: "Quota limit reached",
          message: `You have reached your ${user.tier} plan limit for ${resourceType}.`,
          quota: {
            tier: user.tier,
            resource: resourceType,
            used: currentUsage,
            limit: limit,
            remaining: 0,
          },
          upgrade: {
            currentTier: user.tier,
            nextTier: user.tier === "free" ? "premium" : "pro",
          },
        });
      }

      // ✅ Attach user and quota to request
      req.user = user;
      req.quota = {
        tier: user.tier,
        resource: resourceType,
        used: currentUsage,
        limit: limit === Infinity ? "Unlimited" : limit,
        remaining:
          limit === Infinity ? "Unlimited" : Math.max(0, limit - currentUsage),
        resetDate: new Date(now.getFullYear(), now.getMonth() + 1, 1),
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = checkResourceQuota;
