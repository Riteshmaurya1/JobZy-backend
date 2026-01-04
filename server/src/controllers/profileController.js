const User = require("../models/userModel");

const getProfile = async (req, res, next) => {
  try {
    // Step1: Find who is current User
    const id = req.payload.id;

    //Step2: Find Details from DB
    const profile = await User.findByPk(id);
    if (!profile) {
      const error = new Error("Profile not found");
      error.statusCode = 400;
      next(error);
    }

    //Step3: Return Profile Response
    return res.status(200).json({
      profile: {
        name: profile.name,
        email: profile.email,
        phoneNumber: profile.phoneNumber,
        tier: profile.tier,
        monthlyJobsUsed: profile.monthlyJobsUsed,
        lastReset: profile.lastReset,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProfile,
};
