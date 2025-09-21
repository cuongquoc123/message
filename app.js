require("dotenv").config();
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const path = require("path");

const connectDB = require("./config/db");
const authRoutes = require("./routes/auth.route");
const friendRequestRoutes = require("./routes/friendRequest.route");
const conversationRoutes = require("./routes/conversation.route");
const messageRoutes = require("./routes/message.route");

const logger = require("./middlewares/logger");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");
const { Socket } = require("dgram");

connectDB();

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

app.use(logger);
app.use(express.json());

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/friend-request", friendRequestRoutes);
app.use("/api/v1/conversations", conversationRoutes);
app.use("/api/v1/messages", messageRoutes);

app.use(express.static(path.join(__dirname, "public")));

app.use(notFound);
app.use(errorHandler);

io.on("connection", (socket) => {
  console.log("Client connected: ", socket.id);

  socket.on("sendMessage", (data) => {
    console.log("Message received:", data);
    io.emit("receiveMessage", data);
  });

  socket.on("disconnect", () => {
    console.log("Client disconnect:", socket.id);
  });
});

const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
