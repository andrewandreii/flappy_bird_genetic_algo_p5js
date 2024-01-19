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

var parallax = [0.7,0.8,0.9,1];

var birdSprite;
var pipeBodySprite;
var pipePeakSprite;
var bgImg = [];

var bgX = [0,0,0,0];

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

function preload() {
    pipeBodySprite = getResource('pipe.png');
    pipePeakSprite = getResource('pipe.png');
    Bird.default_sprite = getResource('bird_up.png');
    Bird.flip_sprite = getResource('bird_down.png');
    Pipe.spacing = maxGap;
    makeBackSet();
    pipeFrequancy = 0;
}

function makeBackSet(){
    let set = random(0,4.9);
    set = floor(set)
    bgImg[0] = getResource("back"+ set + "1.png");
    bgImg[1] = getResource("back"+ set + "2.png");
    bgImg[2] = getResource("back"+ set + "3.png");
    bgImg[3] = getResource("back"+ set + "4.png");
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
}

function parallax_background() {
    background(0);
    widthBack = 1200;
    for(let i=0;i<4;i++){
        image(bgImg[i], bgX[i], 0, widthBack , height);
            bgX[i] -= pipes[0].speed * parallax[i];

        if (bgX[i] <= -widthBack  + width) {
            image(bgImg[i], bgX[i] + widthBack, 0, widthBack , height);
                if (bgX[i] <= -widthBack ) {
                bgX[i] = 0;
        }
    }
    }
}

const INFO_TEXT = ["Generation", "Best score", "Terrain difficulty", "Hardest terrain reached", "Population size"]
function draw() {
    parallax_background();

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
    bgX = [0,0,0,0];
    makeBackSet();

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