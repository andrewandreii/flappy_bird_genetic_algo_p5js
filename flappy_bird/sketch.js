const DEFAULT_POPULATION_SIZE = 1000;
var populationSize;
var birds;
var savedBirds;
var pipes;

var parallax = 0.8;

var birdSprite;
var pipeBodySprite;
var pipePeakSprite;
var bgImg;

var bgX;

const maxGap = 240;
const minGap = 160;
var gapThightteningRate = 0.03;
const minPipePeriod = 90;
const maxPipePeriod = 150; // every 150 frames
var periodShorteningRate = 0.03;
var pipePeriod = maxPipePeriod;
var minGapReached = maxGap;
var pipePeriodCheck = 0;

var saveBestButton;
var pauseButton;
var isPaused = false;

const TEXT_SIZE = 20;
const TEXT_PADDING = 5;

function terrainDifficulty(gapSize) {
  return 1 - (gapSize - minGap) / (maxGap - minGap);
}

function getResource(filename) {
  return loadImage(resourcesPath + filename);
}

function preload() {
  pipeBodySprite = getResource('gate.png');
  pipePeakSprite = getResource('gate.png');
  Bird.default_sprite = getResource('bird_down.png');
  Bird.flip_sprite = getResource('bird_up.png');
  Pipe.spacing = maxGap;
  bgImg = getResource('background.png');
  pipeFrequancy = 0;
}

function setup() {
  createCanvas(800, 600);

  populationSize = createSlider(30, 700, DEFAULT_POPULATION_SIZE, 5);
  populationSize.parent("controls");

  birds = [];
  Bird.sizeColony = populationSize.value();
  let hueCounter = 0;;

  for (let i = 0; i < populationSize.value(); ++i) {

    let color = i * (360 / populationSize.value());
    hueCounter += color;

    if (hueCounter > 5) {
      hueCounter = 0;
      birds[i] = new Bird(null, [color, 100, 100]);
    }
    else {
      if (hueCounter > 2.5) {
        birds[i] = new Bird(null, [color, 100 - 4 * hueCounter, 100]);
      }
      else {
        birds[i] = new Bird(null, [color, 100, 100 - 4 * hueCounter]);
      }
    }
  }
}

function initGUI() {
  populationSize = document.getElementById("populationSize");
  populationSize.value = DEFAULT_POPULATION_SIZE;

  birdLift = document.getElementById("birdLift");

  resetButton = document.getElementById("resetButton")
  resetButton.addEventListener("click",
    function (e) {
      if (window.isSecureContext) {
        Navigator.clipboard.writeText(JSON.stringify(bestEachGen));
      } else {
        alert('must use https for this feature, text printed to console');
        print(JSON.stringify(bestEachGen.map(function (x) { return x.decision; })));
      }
    }
  );
  saveBestButton.parent("controls");

  pauseButton = createButton('Pause');
  pauseButton.mousePressed(togglePause);
  pauseButton.parent("controls");

  reset(false);
}

function parallax_background() {
  background(0);
  image(bgImg, bgX, 0, bgImg.width, height);
  bgX -= pipes[0].speed * parallax;

  if (bgX <= -bgImg.width + width) {
    image(bgImg, bgX + bgImg.width, 0, bgImg.width, height);
    if (bgX <= -bgImg.width) {
      bgX = 0;
    }
  }
}

const INFO_TEXT = ["Generation", "Best score", "Terrain difficulty", "Hardest terrain reached", "Population size"]
function draw() {
  parallax_background();

  if (birds.length == 0) {
    reset(true);
  }

  for (let i = pipes.length - 1; i >= 0; i--) {
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


  for (let i = 0; i < birds.length;) {
    birds[i].make_decision(pipes);
    birds[i].update();
    birds[i].show();
    if (birds[i].dead) {
      savedBirds.push(birds.splice(i, 1)[0]);
    } else {
      ++i;
    }
  }

  if (frameCount % pipePeriod == pipePeriodCheck) {
    if (Pipe.spacing > minGap) {
      Pipe.spacing += (minGap - maxGap) * gapThightteningRate;
    }
    if (Pipe.spacing < minGapReached) {
      minGapReached = Pipe.spacing;
    }

    if (pipePeriod > minPipePeriod) {
      pipePeriod += floor((minPipePeriod - maxPipePeriod) * periodShorteningRate);
      pipePeriodCheck = frameCount % pipePeriod;
    }

    pipes.push(new Pipe());
  }

  let info_values = [
    ngen, bestScore,
    (terrainDifficulty(Pipe.spacing) * 100).toFixed(0) + '%',
    (terrainDifficulty(minGapReached) * 100).toFixed(0) + '%',
    populationSize.value
  ];
  showInfo(INFO_TEXT, info_values, TEXT_SIZE, TEXT_PADDING);
}

function reset(nextGen) {
  bgX = 0;

  if (!nextGen) {
    bestScore = 0;
    minGapReached = maxGap;
    ngen = 1;
  }
  
  Bird.lift = int(birdLift.value);

  Pipe.spacing = maxGap;
  let posInPeriod = frameCount % pipePeriod;
  // pipePeriodCheck = posInPeriod < pipePeriodCheck ? pipePeriodCheck % maxPipePeriod : (posInPeriod + pipePeriod - (posInPeriod - pipePeriodCheck)) % maxPipePeriod;
  pipePeriod = maxPipePeriod;
  pipePeriodCheck = 0;
  frameCount = 0; // Dirty fix
  pipes = [];
  pipes.push(new Pipe());

  if (nextGen) {
    nextGeneration();
  }

  savedBirds = [];

  frameCount = 1;
}