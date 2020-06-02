const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const passportTeacher = require("passport");
const passportStudent = require("passport");
const mongoose = require("mongoose");
const config = require("./config/database");

const app = express();
const server = http.createServer(app);
const socket = require("socket.io");
const io = socket(server);
const teachers = require("./routes/teachers");
const students = require("./routes/students");
const PORT = process.env.PORT || 4200;

const person = {};
io.on("connection", (socket) => {
  console.log(person);
  if (!person[socket.id]) {
    person[socket.id] = socket.id;
  }
  socket.emit("yourID", socket.id);
  io.sockets.emit("allUsers", person);
  socket.on("disconnect", () => {
    delete person[socket.id];
  });

  socket.on("callUser", (data) => {
    io.to(data.userToCall).emit("hey", {
      signal: data.signalData,
      from: data.from,
    });
  });

  socket.on("acceptCall", (data) => {
    io.to(data.to).emit("callAccepted", data.signal);
  });
});

mongoose.connect(process.env.MONGODB_URI || config.database, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
});

mongoose.connection.on("connected", () => {
  console.log("connected to database " + config.database);
});
mongoose.connection.on("error", (err) => {
  console.log("database error " + err);
});

app.use(cors());
app.use(express.json());

// initialize teacher session
app.use(passportTeacher.initialize());
app.use(passportTeacher.session());

// initialize student session
app.use(passportStudent.initialize());
app.use(passportStudent.session());

require("./config/passport")(passportTeacher);
require("./config/passport")(passportStudent);

app.use("/teacher", teachers);
app.use("/student", students);

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
}

// index route
app.get("/", (req, res) => {
  res.send("invalid endpoint");
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

server.listen(PORT, () => {
  console.log(`🌏 server on http://localhost:${PORT}`);
});

// require('dotenv').config();
// const express = require("express");
// const http = require("http");
// const app = express();
// const server = http.createServer(app);
// const socket = require("socket.io");
// const io = socket(server);

// const users = {};

// const socketToRoom = {};

// io.on('connection', socket => {
//     socket.on("join room", roomID => {
//         if (users[roomID]) {
//             const length = users[roomID].length;
//             if (length === 4) {
//                 socket.emit("room full");
//                 return;
//             }
//             users[roomID].push(socket.id);
//         } else {
//             users[roomID] = [socket.id];
//         }
//         socketToRoom[socket.id] = roomID;
//         const usersInThisRoom = users[roomID].filter(id => id !== socket.id);

//         socket.emit("all users", usersInThisRoom);
//     });

//     socket.on("sending signal", payload => {
//         io.to(payload.userToSignal).emit('user joined', { signal: payload.signal, callerID: payload.callerID });
//     });

//     socket.on("returning signal", payload => {
//         io.to(payload.callerID).emit('receiving returned signal', { signal: payload.signal, id: socket.id });
//     });

//     socket.on('disconnect', () => {
//         const roomID = socketToRoom[socket.id];
//         let room = users[roomID];
//         if (room) {
//             room = room.filter(id => id !== socket.id);
//             users[roomID] = room;
//         }
//     });

// });

// server.listen(process.env.PORT || 8000, () => console.log('server is running on port 8000'));
