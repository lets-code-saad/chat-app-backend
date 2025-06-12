const mongoose = require("mongoose");
require("dotenv").config();

const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.DB_LINK}`);
    console.log("DB CONNECTED");
  } catch (error) {
    console.log("DB ERROR:", error.message);
  }
};
module.exports = connectDB;
