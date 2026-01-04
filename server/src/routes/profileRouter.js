const express = require("express");
const profileRouter = express.Router();

const { getProfile } = require("../controllers/profileController");
const isAuth = require("../middleware/verifyJwt");

profileRouter.get("/user/profile", isAuth, getProfile);

module.exports = profileRouter;
