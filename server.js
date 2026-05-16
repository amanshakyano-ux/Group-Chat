require("dotenv").config();

//Importing
const express = require("express");
const http = require("http");
const WebSocket = require("ws");
const db = require("./utils/db-connection");
const userRouter = require("./routes/user");
const msgRouter = require("./routes/message");
const aiRoutes= require("./routes/aiRoutes")
const path = require("path");
const cors = require("cors");
require("./models");
require("./cron/messageCleanup")

const { Server } = require("socket.io");

const socketIO = require("./socket.io/index");

const app = express();
const server = http.createServer(app); //connection through http
const io = socketIO(server);

//app middlware

app.set("io", io); //Ye line Express app ke andar io object ko globally store karti hai.
app.use(express.static("public"));

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//Routes
app.use("/user", userRouter);
app.use("/message", msgRouter);
app.use("/ai",aiRoutes)

//error middleware
app.use((err, req, res, next) => {
  console.error(err.message);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message,
  });
});

//Paths

app.get("/login", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "login.html"));
});
app.get("/signup", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "signup.html"));
});
app.get("/chat", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "chat.html"));
});

db.sync({ alter: true })
  .then(() => {
    server.listen(process.env.PORT, () => {
      console.log("SERVER IS RUNNING AT : ", process.env.PORT);
    });
  })
  .catch((err) => {
    console.log(`SERVER IS NOT RUNNING :`, err.message);
  });
