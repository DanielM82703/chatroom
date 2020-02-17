var socket;
var type = false;
var userName = null;
var data;
var textSend = "";
var currentX;
var currentY;
var localText = [];
var localTextUser = [];
var globalUsernames = [];
var currentLine = "";

function setup() {
  createCanvas(800, 800);
  background(200);
  textAlign(LEFT, TOP);
  socket = io.connect('http://localhost:3000/');
  socket.on('newText', updateText);
  socket.on("newData", updateText);
  socket.on("sendUsernames", updateUsernames);
  userName = prompt("Enter username");
  addUsername();
  socket.emit('requestData');
}

function draw() {
  background(200);
  fill(255);
  rect(1, 1, 600, 600);
  rect(601, 1, 199, 100);
  rect(601, 101, 199, 100);
  rect(601, 201, 199, 399);

  if (userName != null && type == true) {
    rect(1, 601, 799, 199);
    rect(750, 750, 50, 50);
    textSize(20);
    fill(0);
    text("Send", 750, 775, 50, 25);
    displayText(textSend, 10, 610, 790, 190, 20);
  }

  textSize(25);
  fill(0);
  text("Reset username", 601, 1, 199, 100);
  text("Type", 601, 101, 199, 100);

  displayChatText();

  textSize(15);
  text("Connected users:", 600, 200, 200, 50);

  currentY = 250;
  for (let i = 0; i < globalUsernames.length; i++) {
    text(globalUsernames[i], 600, currentY, 200, 50);
    currentY += 50;
  }

}

function updateUsernames(data) {
  globalUsernames = data;
}

function mousePressed() {
  if (mouseX > 601 && mouseY > 1 && mouseX < 800 && mouseY < 101) {
    userName = prompt("Enter username");
    addUsername();
  } else if (mouseX > 601 && mouseY > 101 && mouseX < 800 && mouseY < 201) {
    type = true;
  } else if (mouseX > 750 && mouseY > 775 && mouseX < 800 && mouseY < 800) {
    data = {
      tex: textSend
    }
    socket.emit('sendText', data)
    textSend = "";
    type = false;
  }
}

function addUsername() {
  data = {
    u: userName
  }
  socket.emit('addUser', data);
}

function keyPressed() {
  if (key == 't' && type == false) {
    type = true;
  } else if ((keyCode > 47 || keyCode == 32) && type == true) {
    textSend = str(textSend + key);
  } else if (keyCode == 13) {
    data = {
      tex: textSend
    }
    socket.emit('sendText', data)
    textSend = "";
    type = false;
  }
}

function displayText(t, x, y, w, h, s) {
  textSize(s);
  fill(0);
  currentX = x;
  currentY = y;
  for (let i = 0; i < t.length; i++) {
    text(str(t.charAt(i)), currentX, currentY, textWidth(str(t.charAt(i))), 25);
    currentX += textWidth(str(t.charAt(i)));
    if (currentX > x + w - 10) {
      currentX = x;
      currentY += 25;
    }
  }
}

function updateText(data) {
  localText = data.t;
  localTextUser = data.u;
}

function displayChatText() {
  currentX = 10;
  currentY = 10;
  textSize(15);
  for (let i = 0; i < localText.length; i++) {
    currentLine = localTextUser[i] + ": " + localText[i];
    for (let j = 0; j < localTextUser[i].length + 2 + localText[i].length; j++) {
      text(str(currentLine.charAt(j)), currentX, currentY, textWidth(str(currentLine.charAt(j))), 25);
      currentX += textWidth(str(currentLine.charAt(j)));
      if (currentX > 590) {
        currentX = 10;
        currentY += 25;
        b
      }
    }
    currentX = 10;
    currentY += 25;
  }
}