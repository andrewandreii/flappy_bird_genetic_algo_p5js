
var populationSize;
var birds;
var savedBirds;
var pipes;

var parallax = 0.8;
var pipeFrequancy;

var birdSprite;
var pipeBodySprite;
var pipePeakSprite;
var bgImg;

var bgX;

const maxGap = 250;
const minGap = 155;
var gapThightteningRate = 0.05;
var minGapReached = maxGap;

var saveBestButton;

const TEXT_SIZE = 20;
const TEXT_PADDING = 5;

function terrainDifficulty(gapSize) {
  return 1 - (gapSize - minGap) / (maxGap - minGap);
}

const resourcesPath = "../resources/"
function getResource(filename) {
  return loadImage(resourcesPath + filename);
}

function preload() {
  pipeBodySprite = getResource('gate.png');
  pipePeakSprite = getResource('gate.png');
  Bird.default_sprite = getResource('train.png');
  Pipe.spacing = maxGap;
  bgImg = getResource('background.png');
  pipeFrequancy = 0;
}

function setup() {
  createCanvas(800, 600);

  populationSize = createSlider(30, 700, 200, 5);

  birds = [];
  Bird.sizeColony = populationSize.value();
  let hueCounter = 0;;

  for (let i = 0; i < populationSize.value(); ++ i) {
    
    let color = i*(360/populationSize.value());
    hueCounter += color;

    if(hueCounter > 5) { 
      hueCounter = 0;
      birds[i] = new Bird(null,color);
    }
    else{
      if(hueCounter > 2.5){
        birds[i] = new Bird(null,color,null,hueCounter)
      }
      else{
        birds[i] = new Bird(null,color,null,null,hueCounter)
      }
    }
  }

  saveBestButton = createButton('Save the best birds history');
  saveBestButton.mousePressed(
    function (e) {
      if (window.isSecureContext) {
        Navigator.clipboard.writeText(JSON.stringify(bestEachGen));
      } else {
        alert('must use https for this feature, text printed to console');
        print(JSON.stringify(bestEachGen.map(function (x) { return x.decision; } )));
      }
    }
  );

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
      //pipeFrequancy = random(-35, 35);
    }
  }

  for (let bird of birds) {
    bird.make_decision(pipes);
    bird.update();
    bird.show();
  }

  print(floor(pipeFrequancy));
  if ((frameCount + floor(pipeFrequancy)) % 150 == 0) {
    if (Pipe.spacing > minGap) {
      Pipe.spacing += (minGap - maxGap) * gapThightteningRate;
    }
    if (Pipe.spacing < minGapReached) {
      minGapReached = Pipe.spacing;
    }

    pipes.push(new Pipe());

  }

  showScores();
}

function showScores() {
  textSize(TEXT_SIZE);
  stroke(0);

  let textPos = TEXT_PADDING + TEXT_SIZE;

  fill(bestScoreColor);
  text('Best score: ' + bestScore, TEXT_PADDING, textPos);
  fill(255);
  text('Terrain difficulty: ' + (terrainDifficulty(Pipe.spacing) * 100).toFixed(0) + '%', TEXT_PADDING, textPos * 2);
  text('Hardest terrain reached: ' + (terrainDifficulty(minGapReached) * 100).toFixed(0) + '%', TEXT_PADDING, textPos * 3);
  text('Best had ' + bestNumOfKids + (bestNumOfKids != 1 ? ' children' : ' child'), TEXT_PADDING, textPos * 4);
  text('Population size: ' + populationSize.value(), TEXT_PADDING, textPos * 5);
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
  Bird.colorD = 0;

  frameCount = 1;
}