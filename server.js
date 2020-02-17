var express = require('express');

var app = express();
var server = app.listen(3000);

app.use(express.static('public'));
console.log("chatroom is running");
var socket = require('socket.io');

var io = socket(server);

var userID = [];
var userName = [];
var globalText = [];
var globalTextUser = [];

io.sockets.on('connection', newConnection);

function newConnection(socket) {
  console.log("new connection: " + socket.id);
  userID.push(socket.id);
  userName.push(null);

  socket.on("addUser", addUserA)
  socket.on("sendText", addText)
  socket.on("requestData", sendData);

  function sendData() {
    data = {
      t: globalText,
      u: globalTextUser
    }
    io.emit('newData', data);
  }

  function addUserA(data) {
    data = userName;
    io.emit("sendUsernames", data);
    userName[userID.indexOf(socket.id)] = data.u;

  }

  function addText(data) {
    globalText.push(data.tex);
    globalTextUser.push(userName[userID.indexOf(socket.id)]);
    if (globalText.length > 10) {
      globalText.shift();
    }
    if (globalTextUser.length > 10) {
      globalTextUser.shift();
    }
    data = {
      t: globalText,
      u: globalTextUser
    }
    io.emit('newText', data);
  }
}