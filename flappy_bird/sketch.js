const DEFAULT_POPULATION_SIZE = 1000;

// GUI
var populationSize;
var birdLift;
var resetButton;
var pauseButton;

var isPaused = false;

var birds;
var savedBirds;
var pipes;

var parallax = 0.8;

var birdSprite;
var birdFlipSprite;
var pipeBodySprite;
var pipePeakSprite;
var bgImg;

var bgX;

const maxGap = 240;
const minGap = 160;
var gapThightteningRate = 0.03;
const MIN_PIPE_PERIOD = 90;
const MAX_PIPE_PERIOD = 150; // every 150 frames
var periodShorteningRate = 0.03;
var pipePeriod = MAX_PIPE_PERIOD;
var minGapReached = maxGap;
var pipePeriodCheck = 0;

const TEXT_SIZE = 20;
const TEXT_PADDING = 5;

function terrainDifficulty(gapSize) {
    return 1 - (gapSize - minGap) / (maxGap - minGap);
}

var noImages = true;
function preload() {
    fetch(resourcesPath + "gate.png")
        .then(() => { noImages = false; })
        .catch(() => {});
    
    pipeBodySprite = getResource("gate.png");
    pipePeakSprite = getResource("gate.png");
    birdSprite = getResource("bird_up.png");
    birdFlipSprite = getResource("bird_down.png");
    bgImg = getResource("background.png");

    Pipe.spacing = maxGap;
    pipeFrequancy = 0;
}

function initBirds() {
    birds = [];
    Bird.sizeColony = populationSize.value;
    let hueCounter = 0;
    for (let i = 0; i < populationSize.value; ++i) {

        let color = i * (360 / populationSize.value);
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
            initBirds();
            reset(false);
        }
    );

    pauseButton = document.getElementById("pauseButton");
    pauseButton.addEventListener("click", togglePause);
}

function setup() {
    createCanvas(800, 600);

    initGUI();
    initBirds();

    reset(false);

    loop();
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
    if (noImages) {
        background(0);
    } else {
        parallax_background();
    }

    if (birds.length == 0) {
        reset(true);
    }

    for (let i = pipes.length - 1; i >= 0; --i) {
        pipes[i].update();
        pipes[i].show();

        for (let j = 0; j < birds.length; ++j) {
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

        if (pipePeriod > MIN_PIPE_PERIOD) {
            pipePeriod += floor((MIN_PIPE_PERIOD - MAX_PIPE_PERIOD) * periodShorteningRate);
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
    pipePeriod = MAX_PIPE_PERIOD;
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