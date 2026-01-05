const features = require("../config/features.config");

/**
 * Middleware to check if user's tier has access to a specific feature
 * @param {string} featureName - Feature key from features.config.js
 */
const checkFeatureAccess = (featureName) => {
  return async (req, res, next) => {
    try {
      // User should be attached by authenticate middleware
      const userTier = req.payload?.tier || "free";

      // Check if feature exists
      if (!features[featureName]) {
        return res.status(500).json({
          success: false,
          error: "Invalid feature configuration",
          message: `Feature "${featureName}" not found in configuration`,
        });
      }

      // Check if user's tier has access to this feature
      const hasAccess = features[featureName][userTier];

      if (!hasAccess) {
        // Determine which tier is needed
        const requiredTier = features[featureName].premium ? "premium" : "pro";

        return res.status(403).json({
          success: false,
          error: "Feature not available",
          message: `This feature is not available in your ${userTier} plan.`,
          upgrade: {
            currentTier: userTier,
            requiredTier: requiredTier,
            feature: featureName,
            pricing: {
              premium: "₹99/month",
              pro: "₹199/month",
            },
          },
        });
      }

      // Feature is accessible
      req.featureAccess = {
        feature: featureName,
        allowed: true,
        tier: userTier,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};

module.exports = checkFeatureAccess;
