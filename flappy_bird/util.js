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

function HSVtoRGB(h, s, v) {
    let r, g, b, i, f, p, q, t;
    if (arguments.length === 1) {
        s = h.s, v = h.v, h = h.h;
    }
    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    return [
        Math.round(r * 255),
        Math.round(g * 255),
        Math.round(b * 255)
    ];
}
