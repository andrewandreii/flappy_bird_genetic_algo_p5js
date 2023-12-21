class Bird {
    default_sprite = null;

    in_nodes = 4;
    hid_nodes = 6;
    out_nodes = 1;

    constructor(brain, color, sprite) {
        this.width = 64;
        this.height = 64;

        this.gravity = 0.6;
        this.lift = -10;
        this.velocity = 0;

        this.y = 64;
        this.x = 64;

        this.score = 0;

        this.dead = false;

        if (sprite != null) {
            this.sprite = sprite;
        } else {
            this.sprite = Bird.default_sprite;
        }

        if (brain) {
            this.brain = brain.copy();
        } else {
            this.brain = new NeuralNetwork(this.in_nodes, this.hid_nodes, this.out_nodes);
        }

        if (color) {
            this.color = color;
        } else {
            this.color = [random(30, 225), random(30, 225), random(30, 225)];
        }

        // TODO: implement color based on genetic code
    }

    show() {
        noStroke();
        fill(this.color);
        ellipse(this.x, this.y, max(this.width, this.height) + 5);
        image(this.sprite, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }

    up() {
        this.velocity = this.lift;
    }

    make_decision(pipes) {
        let inputs = [];
        inputs[0] = this.y / height;
        inputs[1] = pipes[0].top / height;
        inputs[2] = pipes[0].bottom / height;
        inputs[3] = pipes[0].x / width;

        let output = this.brain.predict(inputs);
        if(output[0] > 0.5){
            this.up();
        }
    }

    update() {
        ++ this.score;

        this.velocity += this.gravity;
        this.y += this.velocity;

        if (this.y >= height - this.height / 2) {
            // this.y = height - this.height / 2;
            // this.velocity = 0;
            this.dead = true;
          }
      
        if (this.y <= this.height / 2) {
            // this.y = this.height / 2;
            // this.velocity = 0;
            this.dead = true;
        }
    }
}