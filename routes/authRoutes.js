const express = require("express");
const { signupRoute, loginRoute, getUserProfile } = require("../controllers/authController");
const authToken = require("../middleware/authToken");
const router = express.Router();

// signup
router.post("/signupRoute", signupRoute);
router.post("/loginRoute", loginRoute);
router.get("/getUserProfile", authToken, getUserProfile);

module.exports = router;
