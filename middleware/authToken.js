const jwt = require("jsonwebtoken");
require("dotenv").config();

const authToken = async (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    if (!authHeader) {
      return res.status(401).json({ message: "Authorization header missing!" });
    }
    // IMPORTANT: to remove the word Bearer to get only the actual JWT token.
    const token = authHeader.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token Missing!" });
    }
    const decodeToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.person = decodeToken;

    next(); // move to next middleware
  } catch (error) {
    // Handle specific JWT errors
    if (error.name === "TokenExpiredError") {
      return res
        .status(401)
        .json({ message: "Token expired, please log in again." });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Invalid token." });
    }

    // Any other error
    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};

module.exports = authToken;
