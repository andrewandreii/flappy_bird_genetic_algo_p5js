var mutationAmount = 0.05;
const AVERAGE_MUTATION_AMOUNT = 0.05;

var bestScore = 0;
var bestScoreColor = 0;
var bestNumOfKids = 0;
var bestBrain;

var bestEachGen = [];

var ngen = 1;

function mutateFunc(x) {
    return x + random(-mutationAmount, mutationAmount);
}

function mutateBy(x, amount) {
    return x + random(-amount, amount);
}

function nextGeneration() {
    ++ngen;

    let avg_fitness = calculateFitness() / savedBirds.length;

    birds = [];
    bestNumOfKids = 0;
    for (let i = 0; i < populationSize.value - 1; ++i) {
        let parents = [pickOne(), pickOne()];

        let child = new Bird(crossover(parents, 0.3, function (x) { return mutateBy(x, (avg_fitness - (parents[0].fitness + parents[1].fitness) / 2) * AVERAGE_MUTATION_AMOUNT + AVERAGE_MUTATION_AMOUNT); }), meanColor(parents[0].color, parents[1].color));

        birds.push(child);
    }

    let savedBird = new Bird(bestBrain, bestScoreColor);
    savedBird.highlight = true;
    birds.push(savedBird);
}

function meanColor(p1, p2) {
    return p1.map((v, idx, arr) => (p2[idx] + v) / 2);
}

function pickOne() {
    let rand = random(0, 1);
    let partSum = 0;
    let i = 0;
    while (partSum < rand && i < savedBirds.length - 1) {
        partSum += savedBirds[i].fitness;
        ++i;
    }

    return savedBirds[i];
}

function matrixCrossover(mat1, mat2, crossover_idx) {
    let mat3 = new Matrix(mat1.rows, mat1.cols);

    if (crossover_idx == null) {
        crossover_idx = random(mat1.rows * mat1.cols);
    }

    for (let i = 0; i < crossover_idx; ++i) {
        mat3.data[floor(i / mat1.cols)][i % mat1.cols] = mat1.data[floor(i / mat1.cols)][i % mat1.cols]
    }

    for (let i = 0; i < crossover_idx; ++i) {
        mat3.data[floor(i / mat1.cols)][i % mat1.cols] = mat2.data[floor(i / mat1.cols)][i % mat1.cols]
    }

    return mat3;
}

function crossover(parents, pmutation, mutateFunc) {
    if (random(1) < pmutation || parents[0] == parents[1]) {
        let brain = parents[floor(random(parents.length - 1))].brain;
        brain.mutate(mutateFunc);
    } else {
        let brain = parents[0].brain;
        let n = brain.input_nodes;
        let m = brain.hidden_nodes;
        let new_brain = new NeuralNetwork(n, m, brain.output_nodes);

        new_brain.weights_ih = matrixCrossover(parents[0].brain.weights_ih, parents[1].brain.weights_ih);
        new_brain.weights_ho = matrixCrossover(parents[0].brain.weights_ho, parents[1].brain.weights_ho);
        new_brain.bias_h = matrixCrossover(parents[0].brain.bias_h, parents[1].brain.bias_h);
        new_brain.bias_o = matrixCrossover(parents[0].brain.bias_o, parents[1].brain.bias_o);

        new_brain.mutate(mutateFunc);
        return new_brain;
    }
}

function calculateFitness() {
    let sum = 0;
    let bestIdx = 0;
    for (let i = 0; i < savedBirds.length; ++i) {
        sum += savedBirds[i].score;
        if (savedBirds[i].score > bestScore) {
            bestIdx = i;
            bestScore = savedBirds[i].score;
            bestScoreColor = savedBirds[i].color;
        }
    }

    bestEachGen.push(savedBirds[bestIdx]);
    bestBrain = savedBirds[bestIdx].brain.copy();

    for (let i = 0; i < savedBirds.length; ++i) {
        savedBirds[i].fitness = savedBirds[i].score / sum;
    }

    return sum;
}