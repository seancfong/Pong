// CANVAS INITIALIZATION
var canvas = document.querySelector("canvas");

canvas.width = window.innerWidth * 0.9;
canvas.height = window.innerWidth / 20 * 9;

var c = canvas.getContext('2d');

// VARIABLES
const setWidth = 20;
const setHeight = 150;
const ballRadius = 20;
var dist = 7;
var setY = (canvas.height / 2) - (setHeight / 2);
var player1;
var player2;
var ball;
var balldx = 5;
var balldy = 5;

var p1Down = false;
var p1Up = false;
var p2Down = false;
var p2Up = false;

var p1Score = 0;
var p2Score = 0;
var rounds = 0;

// EVENT HANDLERS
/*
  S: 83
  W: 87
  DOWN: 40
  UP: 38
*/
window.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case 40:
      p2Down = true;
      break;
    case 38:
      p2Up = true;
      break;
    case 83:
      p1Down = true;
      break;
    case 87:
      p1Up = true;
      break;
    default:
      break;
  }

});

window.addEventListener('keyup', function(event) {
  switch (event.keyCode) {
    case 40:
      p2Down = false;
      break;
    case 38:
      p2Up = false;
      break;
    case 83:
      p1Down = false;
      break;
    case 87:
      p1Up = false;
      break;
    default:
      break;
  }

});

// FUNCTIONS

function Paddle(x, y, width, height, player) {
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
  this.player = player;

  this.update = function() {
    if (this.player == 1) {
      if (p1Down == true && (this.y + this.height <= canvas.height)) {
          this.y += dist;
      } else if (p1Up == true && (this.y >= 0)) {
        this.y -= dist;
      }
    }

    if (this.player == 2) {
      if (p2Down == true && (this.y + this.height <= canvas.height)) {
        this.y += dist;
      } else if (p2Up == true && (this.y >= 0)) {
        this.y -= dist;
      }
    }
    this.draw();

  }

  this.draw = function() {
    c.fillStyle = "#ffffff";
    c.fillRect(this.x, this.y, this.width, this.height);

  };
}

function Ball(x, y, dx, dy, radius) {
  this.x = x;
  this.y = y;
  this.dx = dx;
  this.dy = dy;
  this.radius = radius;

  this.update = function() {
    // TOP AND BOTTOM WALLS
    if (this.y - this.radius < 0) {
      this.dy = -this.dy;
    }
    if (this.y + this.radius > canvas.height) {
      this.dy = -this.dy;
    }

    // BALL COLLISION
    // Player 1
    if ((this.x <= (this.radius + setWidth))
    && ((this.y >= player1.y) && (this.y <= player1.y + setHeight))) {
      this.dx = -this.dx * 1.1;
      this.dy *= 1.1;
      this.x += 5;
    }
    // Player 2
    if ((this.x >= (canvas.width - (this.radius + setWidth)))
    && ((this.y >= player2.y) && (this.y <= player2.y + setHeight))) {
      this.dx = -this.dx * 1.1;
      this.dy *= 1.1;
      this.x -= 5;
    }

    this.x += this.dx;
    this.y += this.dy;
    this.draw();

  };

  this.draw = function() {
    c.beginPath();
    c.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
    c.fillStyle = "#000000";
    c.fill();
    c.closePath();
  };
}

// GAME FUNCTIONS

function checkBounds() {
  if (ball.x < -10) {
    onRound = false;
    p2Score++;
  }
  if (ball.x > (canvas.width + 10)) {
    onRound = false;
    p1Score++;
  }
}

function nextRound() {
  rounds++;
  dist += 0.05;
  console.log("New round!");
  ball.dx = (Math.random() * 5) + (rounds / 20) + 3;
  ball.dy = (Math.random() * 3) + (rounds / 20) + 4;
  if (p1Score > p2Score) {
    ball.dx = -ball.dx;
  }
  ball.x = canvas.width / 2;
  ball.y = canvas.height / 2;
  console.log(p1Score);
  console.log(p2Score);
  onRound = true;

}
// GAME INITIALIZATION

function init() {
  player1 = new Paddle(0, setY, setWidth, setHeight, 1);
  player2 = new Paddle(canvas.width - setWidth, setY, setWidth, setHeight, 2);
  ball = new Ball(canvas.width / 2, canvas.height / 2, balldx, balldy, ballRadius);

}

var onRound = false;
var canPlay = false;

function play() {
  if (onRound == false) {
    nextRound();
  }
  requestAnimationFrame(play);
  c.clearRect(0, 0, canvas.width, canvas.height);
  // Background
  c.font = "350px Arial";
  c.textAlign = "center";
  c.fillStyle = "#fff";
  c.fillText(String(rounds), canvas.width / 2, (canvas.height / 2) + 150);

  c.font = "50px Arial";
  c.fillText(String(p1Score), 50, 50);
  c.fillText(String(p2Score), canvas.width - 50, 50);
  // Players
  player1.update();
  player2.update();
  ball.update();
  checkBounds();

}

init();
play();
