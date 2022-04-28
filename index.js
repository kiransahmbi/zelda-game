var gameContainer = document.getElementById("game-container");
var resetScore = document.getElementById("reset-score");
var resetSpeed = document.getElementById("reset-speed");
var backgroundMusic = new Audio('Ganon-Appears.mp3');
var swordStrikeMusic = new Audio('sword.mp3');
var gameStarted = false;

// Canvas ////////////////////////////////////////////////////////////////////////////////////////
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 420;
canvas.height = 420;
gameContainer.appendChild(canvas);

// Draw Objects ////////////////////////////////////////////////////////////////////////////////////////
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
  bgReady = true;
};
bgImage.src = "Images/grass-green.png";

var bgGameStartReady = false;
var bgGameStartImage = new Image();
bgGameStartImage.onload = function () {
  bgGameStartReady = true;
};
bgGameStartImage.src = "Images/grass-red.png";

var heroineReady = false;
var heroineImage = new Image();
heroineImage.onload = function () {
  heroineReady = true;
};
heroineImage.src = "Images/zelda.png";

var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
  heroReady = true;
};
heroImage.src = "Images/link.png";

var villanReady = false;
var villanImage = new Image();
villanImage.onload = function () {
  villanReady = true;
};
villanImage.src = "Images/villan.png";

// Game Objects ////////////////////////////////////////////////////////////////////////////////////////
var heroine = {
  x: canvas.width / 2 - 25,
  y: canvas.height / 2 - 25
};

var villan = {
  x: 0,
  y: 0,
  prevX: 0,
  prevY: 0
};

var villansCaught = 0;
var villanSpeed = 1500;

// Reset the game when villan caught ////////////////////////////////////////////////////////////////////////////////////////
var reset = function () {
  villan.prevX = villan.x;
  villan.prevY = villan.y;
	// Place villan randomly
	villan.x = 32 + (Math.random() * (canvas.width - 64));
	villan.y = 32 + (Math.random() * (canvas.height - 64));
};


// Move villan on timer ////////////////////////////////////////////////////////////////////////////////////////
var updateVillan = function () {
  villan.prevX = villan.x;
  villan.prevY = villan.y;
  villan.x = 32 + (Math.random() * (canvas.width - 64));
  villan.y = 32 + (Math.random() * (canvas.height - 64));
  console.log(villan.prevX, villan.prevY);
}

// Recognize when villan is killed ////////////////////////////////////////////////////////////////////////////////////////
canvas.addEventListener("click", (event) => {
  const canvasBoundary = canvas.getBoundingClientRect();
  const x = event.clientX - canvasBoundary.left;
  const y = event.clientY - canvasBoundary.top;

  if (x <= (villan.x + 50) && x >= (villan.x - 0) && y <= (villan.y + 60) && y >= (villan.y - 0)) {
    villansCaught++;
    clearInterval(interval);
    villanSpeed *= 0.90;
    interval = setInterval(updateVillan, villanSpeed);
    reset();
  }  

  //Add music when game starts
  if (villanSpeed === 1500 || backgroundMusic.paused) {
    backgroundMusic.play();
    gameStarted = true;
  }

  //Add music with sword strike
  swordStrikeMusic.play();

})

// Draw graphics ////////////////////////////////////////////////////////////////////////////////////////
var render = function () {
	gameStarted ? bgGameStartReady && ctx.drawImage(bgGameStartImage, 0, 0): bgReady && ctx.drawImage(bgImage, 0, 0);
  gameStarted && heroReady && ctx.drawImage(heroImage, heroine.x, heroine.y);
  !gameStarted && heroineReady && ctx.drawImage(heroineImage, heroine.x, heroine.y);
  villanReady && ctx.drawImage(villanImage, villan.x, villan.y);

	// Score
	ctx.fillStyle = "rgb(250, 250, 250)";
	ctx.font = "18px Verdana";
	ctx.textAlign = "left";
	ctx.textBaseline = "top";
	ctx.fillText("Kills: " + villansCaught, 10, 10);
};

// Buttons ////////////////////////////////////////////////////////////////////////////////////////
resetScore.addEventListener("click", (event) => {
  reset();
  villansCaught = 0;
  villanSpeed = 1500;
})

resetSpeed.addEventListener("click", (event) => {
  villanSpeed = 1500;
  clearInterval(interval);
  interval = setInterval(updateVillan, villanSpeed);
})

// The gameContainer game loop ////////////////////////////////////////////////////////////////////////////////////////
var gameContainer = function () {
	render();
	// Request to do this again ASAP
	requestAnimationFrame(gameContainer);
};

// Cross-browser support for requestAnimationFrame
var w = window;
requestAnimationFrame = w.requestAnimationFrame || w.webkitRequestAnimationFrame || w.msRequestAnimationFrame || w.mozRequestAnimationFrame;

// Let's play this game! ////////////////////////////////////////////////////////////////////////////////////////
reset();
gameContainer();
var interval = setInterval(updateVillan, villanSpeed);
