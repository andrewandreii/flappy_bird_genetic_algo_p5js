class Bird {
    default_sprite = null;
    static lift = 10;
    flip_sprite = null;

    in_nodes = 4;
    hid_nodes = 4;
    out_nodes = 1;

    sizeColony = 0;

    constructor(brain, color, sprite) {
        this.width = 64;
        this.height = 64;

        this.gravity = 0.6;
        this.lift = Bird.lift;
        this.velocity = 0;

        this.y = height / 2;
        this.x = 64 + random(-20, 20);

        this.score = 0;
        this.color = [];

        this.dead = false;
        this.flip = false;

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

        this.color = color;
    }

    show() {
        colorMode(HSB, 360, 100, 100);
        noStroke();
        fill(floor(this.color[0]),floor(this.color[1]),floor(this.color[2]));
        ellipse(this.x , this.y - 10, max(this.width, this.height) + 5);
        image(this.sprite, this.x - this.width / 2 , this.y - this.height / 2 , this.width, this.height);
    }

    up() {
        this.velocity = -this.lift;
        this.flip = 15;
        this.sprite = Bird.flip_sprite;
    }

    make_decision(pipes) {
        let inputs = [];
        inputs[0] = this.y / height;
        inputs[1] = pipes[0].top / height;
        inputs[2] = pipes[0].bottom / height;
        inputs[3] = pipes[0].x / width;

        let output = this.brain.predict(inputs);
        if(output[0] > 0.50) {
            this.up();
        }
    }

    update() {
        ++ this.score;
        this.flip --;
        if(this.flip <= 0)
            this.sprite = Bird.default_sprite;

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