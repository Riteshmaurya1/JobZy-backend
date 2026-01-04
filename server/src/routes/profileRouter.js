const express = require("express");
const profileRouter = express.Router();

const {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  getAccountStats,
} = require("../controllers/profileController");
const isAuth = require("../middleware/verifyJwt");

// All routes require authentication
profileRouter.use(isAuth);
profileRouter.get("/user/profile", getProfile);
profileRouter.put("/user/profile/update", updateProfile);
profileRouter.patch("/user/profile/password", changePassword);
profileRouter.delete("/user/profile/account/delete", deleteAccount);
profileRouter.get("/user/profile/tier/status", getAccountStats);

module.exports = profileRouter;
