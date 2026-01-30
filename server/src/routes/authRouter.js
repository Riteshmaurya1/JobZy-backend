const express = require("express");
const authRouter = express.Router();
const {
  validateSignUp,
  validateSignIn,
  validateRefreshToken,
} = require("../validations/authValidator");
const validationErrorHandler = require("../middleware/validationErrorHandler");
const {
  SignUp,
  SignIn,
  logout,
  refreshAccessToken,
} = require("../controllers/authController");

const isAuth = require("../middleware/verifyJwt");
const { authLimiter } = require("../middleware/api-limiter");

authRouter.post("/auth/signup", authLimiter,validateSignUp, validationErrorHandler, SignUp);
authRouter.post("/auth/signin", authLimiter,validateSignIn, validationErrorHandler, SignIn);
authRouter.post(
  "/auth/refresh",
  authLimiter,
  validateRefreshToken,
  validationErrorHandler,
  refreshAccessToken,
);
authRouter.post("/auth/logout", isAuth, logout);

module.exports = authRouter;
