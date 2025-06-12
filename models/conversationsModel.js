const mongoose = require("mongoose");

const conversationsModel = new mongoose.Schema({
  participants: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Messages" }],
},{timestamps:true});

module.exports = mongoose.model("Conversation",conversationsModel)
