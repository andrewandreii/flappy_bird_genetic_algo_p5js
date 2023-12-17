var mutationAmount = 0.1;

var bestScore = 0;
var bestScoreColor = [255, 255, 255];

function mutateFunc(x) {
    return x + random(-mutationAmount, mutationAmount);
}

function mutateBy(x, amount) {
    return x + random(-amount, amount);
}

function nextGeneration() {
    print("next gen");

    calculateFitness();

    birds = [];
    for (let i = 0; i < populationSize; ++ i) {
        let parent = pickOne();
        let child = new Bird(parent.decision, parent.color.map(function (x) {return mutateBy(x, 0.01); }));
        child.decision.mutate(mutateFunc);

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
    let sum = 0;
    for (let i = 0; i < savedBirds.length; ++ i) {
        sum += savedBirds[i].score;
        if (savedBirds[i].score > bestScore) {
            bestScore = savedBirds[i].score;
            bestScoreColor = savedBirds[i].color;
        }
    }

    for (let i = 0; i < savedBirds.length; ++ i) {
        savedBirds[i].fitness = savedBirds[i].score / sum;
    }

    print(sum);
}