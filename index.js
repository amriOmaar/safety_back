const http = require("http");
const socketIo = require("socket.io");
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

const connectDB = require("./config/db.js");
const userRouter = require("./Routes/UserRouter.js");
const UserModel = require("./Models/UserModels.js");
const messageRouter = require("./Routes/MessageRouter.js");
const roomRouter = require("./Routes/RoomRouter.js");
const RoomModel = require("./Models/RoomModel.js");
const app = express();
const server = http.createServer(app);
global.io = socketIo(server, { cors: { origin: "*" } });

const admin = require("firebase-admin");
const serviceAccount = require("./safety-338e7-firebase-adminsdk-dh2gg-4cc89b6ac2.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://safety-338e7-default-rtdb.firebaseio.com",
});

const users = [];
io.on("connection", (socket) => {
  socket.on("setUserName", function (username) {
    let exists = false;

    users.forEach((user) => {
      if (user.username == username) {
        user.userID = socket.id;
        exists = true;
      }
    });

    if (!exists) {
      users.push({
        userID: socket.id,
        username: username,
      });
    }
  });

  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
  });

  socket.on("newMessage", async (roomId, user, content, file) => {
    console.log("newMessage", roomId, user, content);
    const room = await RoomModel.findById(roomId);
    if (!room) {
      return console.log(`room with id  ${roomId} not fount`);
    }

    const sender = await UserModel.findById(user);
    if (!sender) {
      return console.log(`user with id ${user} not found`);
    }
    if (file) {
      var new_file = {
        data: file,
        filename: "files" + new Date().getMilliseconds(),
        contentType: "pdf",
      };
    }
    const newMessage = { user, content, file: new_file };
    // console.log("File Data:", file);
    // console.log("New Message:", newMessage);
    // console.log("Room:", room);

    room.messages.push(newMessage);
    await room.save();
    const message = {
      user: sender.username,
      content,
      file: new_file,
    };
    io.to(roomId).emit("updateMessages", message);
  });

  socket.on("private-message", async ({ content, to, timestamp, sender }) => {
    let receiverId = "";

    console.log(sender);
    users.forEach((user) => {
      if (user.username == to) receiverId = user.userID;
    });

    socket.to(receiverId).emit("private-message", { content, timestamp });
    const user = await UserModel.findOne({ username: to });

    console.log("useeer  :  " + user);
    console.log("FCM INDEX.JS :  " + user.fcmToken);

    // Send Firebase Push Notification
    const message = {
      data: {
        title: "New Message",
        // body: `From ${sender}`,3
        body: "Message",
      },
      // to: `/topics/${sender}`,
      // priority: "high",
      notification: {
        title: `${sender}` ,
        body: "Nouveau message..",
      },
      token: user.fcmToken,
    };

    try {
      const response = await admin.messaging().send(message);
      console.log("Successfully sent notification :", response);
    } catch (error) {
      console.error("Error sending notification :", error);
    }
  });

  socket.on("offer", async (offer, to, sender) => {
    const user = await UserModel.findOne({ username: to });
    const receiver = users.find((user) => user.username === to);
    // console.log({ receiver });
    if (receiver) {
      socket.to(receiver.userID).emit("offer", offer, socket.id);
    }

        // Send Firebase Push Notification
        const message = {
          data: {
            title: "New Message",
            // body: `From ${sender}`,
            body: "Message",
          },
          // to: `/topics/${sender}`,
          // priority: "high",
          notification: {
            title: "Appel..",
            body: `From ${sender}`,
          },
          token: user.fcmToken,
        };
    
        try {
          const response = await admin.messaging().send(message);
          console.log("Successfully sent notification :", response);
        } catch (error) {
          console.error("Error sending notification :", error);
        }

  });

  socket.on("answer", (answer, to) => {
    console.log("answer", answer);
    console.log("to", to);
    const receiver = users.find((user) => user.username === to);
    console.log("reciever", receiver);
    if (receiver) {
      console.log("reciever found");

      socket.to(receiver.userID).emit("answer", answer, socket.id);
    }
  });

  socket.on("ice-candidate", (candidate, to) => {
    const receiver = users.find((user) => user.username === to);
    if (receiver) {
      socket.to(receiver.userID).emit("ice-candidate", candidate, socket.id);
    }
  });

  socket.on("end-call", (to) => {
    const receiver = users.find((user) => user.username === to);
    console.log("end call", to);

    if (receiver) {
      console.log("end call", receiver);

      socket.to(receiver.userID).emit("end-call", socket.id);
    }
  });
});

io.on("disconnect", (socket) => {
  console.log("DESCONNECTED !!!");
  socket.disconnect(true);
});

dotenv.config();
app.use(cors());
app.use(express.json());
connectDB();

app.get("/", (req, res) => {
  res.send("API is running...");
});

app.use("/api/users", userRouter);
app.use("/api/messages", messageRouter);
app.use("/api/rooms", roomRouter);
const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running in IP:${PORT}`);
});
