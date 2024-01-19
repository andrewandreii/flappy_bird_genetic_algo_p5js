const resourcesPath = "resources/"
function getResource(filename) {
    let img = loadImage(resourcesPath + filename, () => {}, () => { print("failed to load image"); });
    return img;
}

function showInfo(labels, values, text_size, margin) {
    textSize(text_size);
    stroke(0);
    fill(255);

    let textPos = margin + text_size;

    for (let i = 0; i < labels.length; ++i) {
        text(labels[i] + ": " + values[i], margin, textPos * (i + 1));
    }
}

function togglePause() {
    if (frameRate() != 0) {
        textAlign(CENTER, CENTER);
        fill(0);
        textSize(40);
        text('Paused', width / 2, height / 2);
        frameRate(0);
    } else {
        textAlign(LEFT, BASELINE);
        frameRate(60);
    }
}
