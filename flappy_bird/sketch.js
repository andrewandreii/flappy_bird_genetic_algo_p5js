var populationSize = 500;
var birds;
var savedBirds;
var pipes;
var parallax = 0.8;
var score = 0;
var maxScore = 0;
var birdSprite;
var pipeBodySprite;
var pipePeakSprite;
var bgImg;
var bgX;
var gameoverFrame = 0;
var isOver = false;

var touched = false;
var prevTouched = touched;

const maxGap = 250;
const minGap = 150;
var gapThightteningRate = 0.01;
var minGapReached = maxGap;

const TEXT_SIZE = 20;
const TEXT_PADDING = 5;

function terrainDifficulty(gapSize) {
  return 1 - (gapSize - minGap) / (maxGap - minGap);
}

function preload() {
  pipeBodySprite = loadImage('graphics/gate.png');
  pipePeakSprite = loadImage('graphics/gate.png');
  Bird.default_sprite = loadImage('graphics/train.png');

  birds = [];
  for (let i = 0; i < populationSize; ++ i) {
    birds[i] = new Bird();
  }

  Pipe.spacing = maxGap;

  bgImg = loadImage('graphics/background.png');
}

function setup() {
  createCanvas(800, 600);
  reset(false);
}

function draw() {
  background(0);
  image(bgImg, bgX, 0, bgImg.width, height);
  bgX -= pipes[0].speed * parallax;

  if (bgX <= -bgImg.width + width) {
    image(bgImg, bgX + bgImg.width, 0, bgImg.width, height);
    if (bgX <= -bgImg.width) {
      bgX = 0;
    }
  }

  if (birds.length == 0) {
    reset(true);
  }

  for (var i = pipes.length - 1; i >= 0; i--) {
    pipes[i].update();
    pipes[i].show();

    for (let j = 0; j < birds.length; ++ j) {
      if (pipes[i].hits(birds[j])) {
        savedBirds.push(birds.splice(j, 1)[0]);
      }
    }

    if (pipes[i].offscreen()) {
      pipes.splice(i, 1);
    }
  }

  for (let bird of birds) {
    bird.make_decision(pipes);
    bird.update();
    bird.show();
  }

  if ((frameCount - gameoverFrame) % 150 == 0) {
    if (Pipe.spacing > minGap) {
      Pipe.spacing += (minGap - maxGap) * gapThightteningRate;
    }
    if (Pipe.spacing < minGapReached) {
      minGapReached = Pipe.spacing;
    }

    pipes.push(new Pipe());
  }

  showScores();
  touched = (touches.length > 0);

  prevTouched = touched;
}

function showScores() {
  textSize(TEXT_SIZE);
  stroke(0);
  fill(bestScoreColor);
  text('Best score: ' + bestScore, TEXT_PADDING, TEXT_SIZE + TEXT_PADDING);
  fill(255);
  text('Terrain difficulty: ' + (terrainDifficulty(Pipe.spacing) * 100).toFixed(0) + '%', TEXT_PADDING, (TEXT_SIZE + TEXT_PADDING) * 2);
  text('Hardest terrain reached: ' + (terrainDifficulty(minGapReached) * 100).toFixed(0) + '%', TEXT_PADDING, (TEXT_SIZE + TEXT_PADDING) * 3);
  text('Generation #' + ngen, TEXT_PADDING, height - TEXT_SIZE - TEXT_PADDING);
}

function reset(nextGen) {
  bgX = 0;

  Pipe.spacing = maxGap;
  pipes = [];
  pipes.push(new Pipe());

  if (nextGen) {
    nextGeneration();
  }

  savedBirds = [];
  gameoverFrame = frameCount - 1;
}

function touchStarted() {
  if (isOver) reset();
}