const conversationsModel = require("../models/conversationsModel");
const messageModel = require("../models/messageModel");
const signupModel = require("../models/signupModel");

const getOtherUsersRoute = async (req, res) => {
  try {
    const loggedinUser = req.person.personId;
    const otherUsers = await signupModel
      .find({
        _id: { $ne: loggedinUser },
        // $ne → Matches values that are not equal to a specified value.
      })
      .select("-password");
    res.status(200).json({ otherUsers });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const sendMessageRoute = async (req, res) => {
  try {
    const senderId = req?.person?.personId;
    const { receiverId } = req.params;
    const { message } = req.body;

    let gotConversation = await conversationsModel.findOne({
      // $all operator selects the documents where the value of a field matches all specified values.
      participants: { $all: [senderId, receiverId] },
    });

    if (!gotConversation) {
      gotConversation = await conversationsModel.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = await messageModel.create({
      senderId,
      receiverId,
      message,
    });
    
    if (newMessage) {
      gotConversation.messages.push(newMessage._id);
    }
    await gotConversation.save();

    res.status(201).json({ newMessage });

    // SOCKET IO
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMessageRoute = async (req, res) => {
try {
  const senderId = req?.person?.personId;
  const { receiverId } = req.params;
  const conversation = await conversationsModel
    .findOne({
      participants: { $all: [senderId, receiverId] },
    })
    .populate("messages");
    if (!conversation) {
      return res.status(404).json({
        message: "No conversation found between the users.",
        ReceivedMessages: [],
      });
    }
  res.status(200).json({
    message: "Messages Fetched Successfully!",
    ReceivedMessages: conversation.messages,
  });
} catch (error) {
  return res.status(500).json({ message: error.message });
}
};

module.exports = { sendMessageRoute, getMessageRoute, getOtherUsersRoute };
