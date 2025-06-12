const express = require("express")
const { sendMessageRoute, getMessageRoute, getOtherUsersRoute } = require("../controllers/messagesController")
const authToken = require("../middleware/authToken")
const router = express.Router()

router.get("/other-users",authToken, getOtherUsersRoute)
router.post("/send-message/:receiverId",authToken, sendMessageRoute)
router.get("/receive-message/:receiverId",authToken, getMessageRoute)

module.exports = router