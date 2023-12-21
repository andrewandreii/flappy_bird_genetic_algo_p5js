var mutationAmount = 0.05;
const AVERAGE_MUTATION_AMOUNT = 0.05;

var bestScore = 0;
var bestScoreColor = 0;
var bestNumOfKids = 0;

var bestEachGen = [];

var ngen = 1;

function mutateFunc(x) {
    return x + random(-mutationAmount, mutationAmount);
}

function mutateBy(x, amount) {
    return x + random(-amount, amount);
}

function nextGeneration() {
    ++ ngen;

    let avg_fitness = calculateFitness() / savedBirds.length;

    birds = [];
    bestNumOfKids = 0;
    for (let i = 0; i < populationSize.value(); ++ i) {
        let parent = pickOne();
        
        if (parent.color == bestScoreColor) {
            ++ bestNumOfKids;
        }

        let child = new Bird(parent.brain, parent.color.map(function (x) { return mutateBy(x, 0.1 * 255); }));
        child.brain.mutate(function (x) { return mutateBy(x, (avg_fitness - parent.fitness) * AVERAGE_MUTATION_AMOUNT + AVERAGE_MUTATION_AMOUNT); });

        birds.push(child);
    }
}

function pickOne() {
    let rand = random(0, 1);
    let partSum = 0;
    let i = 0;
    while (partSum < rand && i < savedBirds.length - 1) {
        partSum += savedBirds[i].fitness;
        ++ i;
    }

    return savedBirds[i];
}

function calculateFitness() {
    // print(savedBirds);

    let sum = 0;
    let bestIdx = 0;
    for (let i = 0; i < savedBirds.length; ++ i) {
        sum += savedBirds[i].score;
        if (savedBirds[i].score > bestScore) {
            bestIdx = i;
            bestScore = savedBirds[i].score;
            bestScoreColor = savedBirds[i].color;
        }
    }

    bestEachGen.push(savedBirds[bestIdx]);

    for (let i = 0; i < savedBirds.length; ++ i) {
        savedBirds[i].fitness = savedBirds[i].score / sum;
    }

    // print(savedBirds.map(function (x) { return x.fitness; }));

    return sum;
}