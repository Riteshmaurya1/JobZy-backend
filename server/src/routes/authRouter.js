const express = require("express");
const authRouter = express.Router();
const {
  SignUp,
  SignIn,
  logout,
  refreshAccessToken,
} = require("../controllers/authController");

authRouter.post("/auth/signup", SignUp);
authRouter.post("/auth/signin", SignIn);
authRouter.post("/auth/logout", logout);
authRouter.post("/auth/refresh", refreshAccessToken);

module.exports = authRouter;
