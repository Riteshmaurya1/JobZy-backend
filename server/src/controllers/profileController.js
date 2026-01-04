const User = require("../models/userModel");
const tierLimits = require("../utils/tierLimits"); // ✅ Import centralized limits

// GET: Fetch user profile
const getProfile = async (req, res, next) => {
  try {
    const id = req.payload.id;

    const profile = await User.findByPk(id, {
      attributes: { exclude: ["password", "refreshToken"] },
    });

    if (!profile) {
      const error = new Error("Profile not found");
      error.statusCode = 404;
      throw error;
    }

    return res.status(200).json({
      success: true,
      profile: {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        phoneNumber: profile.phoneNumber,
        tier: profile.tier,
        monthlyJobsUsed: profile.monthlyJobsUsed,
        lastReset: profile.lastReset,
        createdAt: profile.createdAt,
        updatedAt: profile.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// PUT: Update user profile (email excluded)
const updateProfile = async (req, res, next) => {
  try {
    const id = req.payload.id;
    const { name, phoneNumber } = req.body;

    if (!name && !phoneNumber) {
      const error = new Error(
        "At least one field (name or phoneNumber) is required"
      );
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findByPk(id);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const updates = {};
    if (name) updates.name = name;
    if (phoneNumber) updates.phoneNumber = phoneNumber;

    await user.update(updates);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      profile: {
        id: user.id,
        name: user.name,
        email: user.email,
        phoneNumber: user.phoneNumber,
        tier: user.tier,
        updatedAt: user.updatedAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

// PATCH: Change password
const changePassword = async (req, res, next) => {
  try {
    const id = req.payload.id;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      const error = new Error("Current password and new password are required");
      error.statusCode = 400;
      throw error;
    }

    if (newPassword.length < 6) {
      const error = new Error("New password must be at least 6 characters");
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findByPk(id);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const bcrypt = require("bcryptjs");
    const isValid = await bcrypt.compare(currentPassword, user.password);
    if (!isValid) {
      const error = new Error("Current password is incorrect");
      error.statusCode = 401;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await user.update({ password: hashedPassword });

    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    next(error);
  }
};

// DELETE: Delete user account
const deleteAccount = async (req, res, next) => {
  try {
    const id = req.payload.id;
    const { password } = req.body;

    if (!password) {
      const error = new Error("Password is required to delete account");
      error.statusCode = 400;
      throw error;
    }

    const user = await User.findByPk(id);
    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    const bcrypt = require("bcryptjs");
    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      const error = new Error("Password is incorrect");
      error.statusCode = 401;
      throw error;
    }

    await user.destroy();

    return res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// GET: Get account stats
const getAccountStats = async (req, res, next) => {
  try {
    const id = req.payload.id;

    const user = await User.findByPk(id, {
      attributes: ["tier", "monthlyJobsUsed", "lastReset", "createdAt"],
    });

    if (!user) {
      const error = new Error("User not found");
      error.statusCode = 404;
      throw error;
    }

    // ✅ Use imported tierLimits
    const limit = tierLimits[user.tier];
    const remaining =
      limit === Infinity ? "Unlimited" : limit - user.monthlyJobsUsed;

    return res.status(200).json({
      success: true,
      stats: {
        tier: user.tier,
        monthlyJobsUsed: user.monthlyJobsUsed,
        limit: limit === Infinity ? "Unlimited" : limit,
        remaining,
        lastReset: user.lastReset,
        memberSince: user.createdAt,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  getAccountStats,
};
