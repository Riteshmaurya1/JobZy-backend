const express = require("express");
const profileRouter = express.Router();

const {
  getProfile,
  updateProfile,
  changePassword,
  deleteAccount,
  getAccountStats,
} = require("../controllers/profileController");
const {
  validateUpdateProfile,
  validateChangePassword,
  validateDeleteAccount,
} = require("../validations/profileValidator");
const validationErrorHandler = require("../middleware/validationErrorHandler");
const isAuth = require("../middleware/verifyJwt");

// All routes require authentication
profileRouter.use(isAuth);

// Profile CRUD (REST-ful)rs
profileRouter.get("/user/profile", getProfile);
profileRouter.put("/user/profile", validateUpdateProfile, validationErrorHandler, updateProfile);
profileRouter.delete("/user/profile", validateDeleteAccount, validationErrorHandler, deleteAccount);

// Profile actions
profileRouter.patch("/user/profile/password", validateChangePassword, validationErrorHandler, changePassword);
profileRouter.get("/user/profile/status", getAccountStats);

module.exports = profileRouter;
