const express = require("express")
const connectDB = require("./config/db")
const app = express()
const authRoutes = require("./routes/authRoutes")
const messageRoutes = require("./routes/messageRoutes")
const cors = require("cors")

// parsing
app.use(express.json())

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:3001",
      "http://localhost:8000",
    ],
  })
);
// DB before any route runs
connectDB()

app.use("/auth",authRoutes)
app.use("/message",messageRoutes)

const port = 8000
app.listen(port, () => {
    console.log("Server Is Running");
})

module.exports = app