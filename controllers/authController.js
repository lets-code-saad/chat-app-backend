const express = require("express");
const signupModel = require("../models/signupModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const signupRoute = async (req, res) => {
  try {
    const { username, email, password, gender } = req.body;

    // Check for missing fields
    if (!username || !email || !password || !gender) {
      return res
        .status(400)
        .json({ success: false, message: "All Fields Are Required!" });
    }

    const existingUser = await signupModel.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      const usernameTaken = existingUser.username === username;
      const emailTaken = existingUser.email === email;

      if (usernameTaken && emailTaken) {
        return res.status(409).json({
          success: false,
          message: "Both Username And Email Are Taken!",
        });
      } else if (usernameTaken) {
        return res
          .status(400)
          .json({ success: false, message: "Username Is Already Taken!" });
      } else if (emailTaken) {
        return res
          .status(400)
          .json({ success: false, message: "Email Is Already Taken!" });
      }
    }

    // Hash the password
    const hashedPass = await bcrypt.hash(password, 6);

    // profile picture avatar
    const maleProfileAvatar = `https://avatar.iran.liara.run/public/boy?username=${username}`;
    const femaleProfileAvatar = `https://avatar.iran.liara.run/public/girl?username=${username}`;

    // Create and save the new user
    const newUser = new signupModel({
      username,
      email,
      password: hashedPass,
      gender,
      profilePhoto: gender === "male" ? maleProfileAvatar : femaleProfileAvatar,
    });
    await newUser.save();

    res
      .status(201)
      .json({ success: true, message: "Registration Successful!", newUser });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || "Internal Server Error" });
  }
};

const loginRoute = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for missing fields
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: "All Fields Are Required!" });
    }

    const existingUser = await signupModel.findOne({ email });

    // Check if user exists
    if (!existingUser) {
      return res
        .status(404)
        .json({ success: false, message: "Email Or Password Incorrect!" });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(password, existingUser.password);
    if (!passwordMatch) {
      return res
        .status(401)
        .json({ success: false, message: "Email Or Password Incorrect!" });
    }

    // Generate token
    const token = jwt.sign(
      { personId: existingUser._id },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "5h" }
    );

    if (!token) {
      return res.status(401).json({message:"Token Expired, Please Login Again!"})
    }

    res.status(200).json({
      success: true,
      message: "Logged In Successfully!",
      existingUser,
      token,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

const getUserProfile = async (req, res) => {
  try {
    const registeredUser = await signupModel
      .findById(req?.person?.personId)
      .select("-password");

    if (!registeredUser) {
      return res.status(404).json({
        success: false,
        message: "User Not Found, Please Signup Again!",
      });
    }

    res.status(200).json({
      success: true,
      message: "Loggedin Successfully!",
      registeredUser,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Error" + error });
  }
};

module.exports = { signupRoute, loginRoute, getUserProfile };
