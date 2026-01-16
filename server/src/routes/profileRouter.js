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

// Profile CRUD (REST-ful)rs
profileRouter.get("/user/profile", getProfile);
profileRouter.put("/user/profile", updateProfile);
profileRouter.delete("/user/profile", deleteAccount);

// Profile actions
profileRouter.patch("/user/profile/password", changePassword);
profileRouter.get("/user/profile/status", getAccountStats);

module.exports = profileRouter;