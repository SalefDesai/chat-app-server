const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoutes = require("./routes/userRoute.js");
const messageRoutes = require("./routes/messageRoute.js");
const socket = require("socket.io");

const app = express();
require("dotenv").config();

app.use(express.json()); 
//By using app.use(express.json());, you can access this JSON data in your Express route handler
// Without this middleware, you would need to manually parse the JSON data from the request body using another method like JSON.parse().

app.use(cors());


mongoose.connect(process.env.MONGO_URI,{
    useUnifiedTopology : true,
    useNewUrlParser : true
}).then(()=>{
    console.log("Connected to mongoDB");
}).catch((err) => {
    console.error("error in connecting : ",err);
})


app.use("/api/auth",userRoutes);
app.use("/api/messages",messageRoutes);


const port = process.env.PORT || 6000;

const server = app.listen(port,()=> {
    console.log(`Server Started on port ${port}`);
})

const io = socket(server, {
  cors: {
    origin: "https://spectacular-buttercream-dd709e.netlify.app",
    // "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.message);
    }
  });
});