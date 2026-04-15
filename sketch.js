//================ GAME MANAGEMENT =================
let state = 0;
let song;
let alive, dead;
let fishcut1, fishcut2, fishcut3, fishcut4;
let fist, fistX = 0;
let knife, knifeX = 0;
let fish, img, board;

//================ COOKING =================
let tapCount = 0;
let tapLimit = 10;
let cookMode = "Mallet";
let miniGameLoaded = false;
let shapes = [];
const dragRadius = 40;

//================ TIMER =================
let minutes = 1;
let seconds = 0;

//================ STATS =================
let packedFish = 0;
// let accuracy = 0;
let timeLeft = 0;
let rank = "E for effort.";
let insideCount = 0;

//================ PRELOAD =================
function preload() {
  
  song = loadSound("Fish.mp3");
  alive = loadImage("alivefish.png");
  fish = loadImage("sardine.png");
  img = loadImage("sardinecan.webp");
  img2 = loadImage("fishbackground.png");
  img3 = loadImage("instructions.png");
  dead = loadImage("deadfish.png");
  fishcut1 = loadImage("fishcut1.png");
  fishcut2 = loadImage("fishcut2.png");
  fishcut3 = loadImage("fishcut3.png");
  fishcut4 = loadImage("fishcut4.png");
  fist = loadImage("fist.webp");
  knife = loadImage("knife.png");
  board = loadImage("board.png");
}

//================ SETUP =================
function setup() {
  createCanvas(1000, 800);
  resetShapes();
}

//================ DRAW =================
function draw() {
  clear();

  console.log(insideCount);
  
  if (state == 0) menu();
  else if (state == 1) instructions();
  else if (state == 2) game();
  else if (state == 3) winScreen();
  else if (state == 4) loseScreen();
}

//================ AUDIO =================
function backgroundMusic() {
  if (!song.isPlaying()) song.loop();
  userStartAudio();
}

//================ INPUT =================
function mousePressed() {
  if (state == 2) {
    if (cookMode == "Pack") {
      for (let i = shapes.length - 1; i >= 0; i--) {
        let shape = shapes[i];
        if (shape.active && mouseIsInside(shape)) {
          shape.isBeingDragged = true;
          shape.offsetX = shape.x - mouseX;
          shape.offsetY = shape.y - mouseY;

          shapes.splice(i, 1);
          shapes.push(shape);
          break;
        }
      }
    }

    if (tapCount < tapLimit) tapCount++;
  }
}

function mouseReleased() {
  for (let shape of shapes) {
    shape.isBeingDragged = false;
  }
}

function keyPressed() {
  backgroundMusic();

  if (state == 0 && keyCode === ENTER) state = 1;
  else if (state == 1 && keyCode === ENTER) state = 2;

  if (key === 'r' || key === 'R') resetGame();
}

//================ MENU =================
function menu() {
  imageMode(CORNER);
  background(img2,255);
  textSize(50);
  fill(0);
  textSize(30);
  textStyle(BOLD);
}

function instructions() {
  background(img3,255);
  textSize(35);
  fill(0);
}

//================ GAME =================
function game() {
  background(255);

  if (!miniGameLoaded) {
    mini1();
    miniGameLoaded = true;
  }

  text("Taps: " + tapCount + "/" + tapLimit, 100, 40);

  // MALLET
  if (cookMode == "Mallet") {
    noCursor();
    imageMode(CENTER);
    image(board, 500, 350, 600, 625);

    fistX = mouseIsPressed ? -50 : 0;

    if (tapCount <= 4) image(alive, 500, 350, 400, 425);
    else image(dead, 500, 350, 400, 425);

    image(fist, mouseX - 35 + fistX, mouseY - 35, 150, 125);
  }

  // KNIFE
  if (cookMode == "Knife") {
    noCursor();
    imageMode(CENTER);
    image(board, 500, 350, 600, 625);

    knifeX = mouseIsPressed ? -35 : 0;

    if (tapCount == 0) image(dead, 500, 350, 400, 425);
    else if (tapCount == 1) image(fishcut1, 300, 350, 100, 125);
    else if (tapCount == 2) {
      image(fishcut1, 300, 350, 100, 125);
      image(fishcut2, 450, 350, 100, 125);
    } 
    else if (tapCount == 3) {
      image(fishcut1, 300, 350, 100, 125);
      image(fishcut2, 450, 350, 100, 125);
      image(fishcut3, 600, 350, 100, 125);
    } 
    else if (tapCount >= 4) {
      image(fishcut4, 500, 350, 200, 225);
    }

    image(knife, mouseX - 90 + knifeX, mouseY - 90, 150, 125);
  }

  // TRANSITIONS
  if (cookMode == "Mallet" && tapCount >= tapLimit) {
    text("Press Enter to cut", 500, 700);
    if (keyIsDown(ENTER)) mini2();
  }

  if (cookMode == "Knife" && tapCount >= tapLimit) {
    text("Press Enter to pack", 500, 700);
    if (keyIsDown(ENTER)) cookMode = "Pack";
  }

  if (cookMode == "Pack") {
    mini3();
    cursor();
  }

  timer();
}

//================ MINI GAMES =================
function mini1() {
  cookMode = "Mallet";
  tapCount = 0;
  tapLimit = 10;
}

function mini2() {
  cookMode = "Knife";
  tapCount = 0;
  tapLimit = 5;
}

function mini3() {
  background(255);
  imageMode(CENTER);
  image(img, 500, 400);

  textAlign(CENTER);
  text("Drag the sardines into the can!", 500, 700);

  for (let shape of shapes) {
    handleDragging(shape);
    drawShape(shape);
  }

  if (isPackingComplete()) {
    finalizeStats();
    calculateRank();
    state = 3;
  }
}

//================ TIMER =================
function timer() {
  textSize(40);
  textAlign(CENTER);

  text(minutes + ":" + nf(seconds, 2), 800, 50);

  if (frameCount % 60 == 0) seconds--;

  if (seconds < 0) {
    minutes--;
    seconds = 59;
  }

  if (minutes <= 0 && seconds <= 0) {
    finalizeStats();
    calculateRank();
    state = 4;
  }
}

//================ STATS =================
function finalizeStats() {
  

  for (let shape of shapes) {
    if (shape.x > 400 && shape.x < 600 && shape.y > 200 && shape.y < 500) {
      //insideCount++;
    }
  }

  packedFish = insideCount;
  accuracy = floor((insideCount / shapes.length) * 100);
  timeLeft = minutes * 60 + seconds;
}

function isPackingComplete() {
  let insideCount = 0;

  for (let shape of shapes) {
    if (shape.x > 400 && shape.x < 600 && shape.y > 200 && shape.y < 500) {
      // insideCount++;
    }
  }

  return insideCount === shapes.length;
}

//================ RANK SYSTEM =================
function calculateRank() {
  if (packedFish === 100 && timeLeft > 30) rank = "S";
  else if (packedFish >= 50) rank = "A";
  else if (packedFish >= 30) rank = "B";
  else if (packedFish >= 10) rank = "C";
  else if (packedFish >= 5) rank = "D";
  else rank = "E for effort.";
}

//================ SCREENS =================
function winScreen() {
  background(220);
  textAlign(CENTER);

  textSize(50);
  text("Fish Master!!", width / 2, 100);

  textSize(25);
  text("Fish Packed: " + packedFish, width / 2, 300);
  // text("Accuracy: " + accuracy + "%", width / 2, 350);
  text("Time Left: " + timeLeft + "s", width / 2, 400);
  text("Rank: " + rank, width / 2, 450);

  text("Press R to Replay", width / 2, 600);
}

function loseScreen() {
  background(100);
  fill(255);
  textAlign(CENTER);

  textSize(50);
  text("Time's Up!", width / 2, 100);

  textSize(25);
  text("Fish Packed: " + packedFish, width / 2, 300);
  // text("Accuracy: " + accuracy + "%", width / 2, 350);
  text("Rank: " + rank, width / 2, 400);

  text("Press R to Retry", width / 2, 600);
}

//================ RESET =================
function resetGame() {
  state = 0;
  cookMode = "Mallet";
  tapCount = 0;
  miniGameLoaded = false;

  minutes = 1;
  seconds = 0;

  packedFish = 0;
  accuracy = 0;
  timeLeft = 0;
  rank = "E for effort";

  resetShapes();
}

function resetShapes() {
  shapes = [];
  shapes.push(createDraggableShape(width / 4, height / 3));
  shapes.push(createDraggableShape(width / 4, (2 * height) / 3));
  shapes.push(createDraggableShape(random(width / 2), random(height)));
  shapes.push(createDraggableShape(random(width / 2), random(height)));
  shapes.push(createDraggableShape(random(width / 2), random(height)));
}

//================ DRAG SYSTEM =================
function createDraggableShape(x, y) {
  return {
    x: x,
    y: y,
    size: dragRadius * 7,
    isBeingDragged: false,
    offsetX: 0,
    offsetY: 0,
    active: true,
    img: fish,
  };
}

function handleDragging(shape) {
  if (!shape.active) return;

  if (shape.isBeingDragged) {
    shape.x = constrain(mouseX + shape.offsetX, 0, width);
    shape.y = constrain(mouseY + shape.offsetY, 0, height);
  }
}

function drawShape(shape) {
  if (!shape.active) return;

  imageMode(CENTER);
  image(shape.img, shape.x, shape.y, shape.size, shape.size);
}

function mouseIsInside(shape) {
  return dist(mouseX, mouseY, shape.x, shape.y) < shape.size / 2.5;
}