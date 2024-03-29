class Bird {
    lift = 10;

    in_nodes = 4;
    hid_nodes = 4;
    out_nodes = 1;

    sizeColony = 0;

    constructor(brain, color) {
        this.width = 64;
        this.height = 64;
        this.id;

        this.gravity = 0.6;
        this.velocity = 0;

        this.y = height / 2;
        this.x = 64;

        this.score = 0;
        this.color = [];
        this.parents = [];

        this.dead = false;
        this.flip = 0;
        this.is_flipped = false;

        if (brain) {
            this.brain = brain.copy();
        } else {
            this.brain = new NeuralNetwork(this.in_nodes, this.hid_nodes, this.out_nodes);
        }

        this.color = color;
        //this.processImage(this.sprite_default,this.color);
        //this.processImage(this.sprite_flip,this.color);
    }

    processImage(img,color) {
        img.loadPixels(); 
      
        for (let x = 0; x < img.width; x++) {
          for (let y = 0; y < img.height; y++){
            let pixelColor = img.get(x, y); 

            if (pixelColor == [255,255,255,0]){
              img.set(x,y,color);
              print("PPP");
            }
          }
        }
      
        img.updatePixels(); 
      }

    show() {
        // colorMode(HSB, 360, 100, 100);
        noStroke();
        fill(floor(this.color[0]), floor(this.color[1]), floor(this.color[2]));
        ellipse(this.x, this.y, max(this.width, this.height) + 12);
        if (noImages == false) {
            image(this.is_flipped ? birdSprite : birdFlipSprite, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
        }
    }

    up() {
        this.velocity = -Bird.lift;
        this.flip = 15;
        this.is_flipped = true;
    }

    make_decision(pipes) {
        let inputs = [];
        inputs[0] = this.y / height;
        inputs[1] = pipes[0].top / height;
        inputs[2] = pipes[0].bottom / height;
        inputs[3] = pipes[0].x / width;

        let output = this.brain.predict(inputs);
        if (output[0] > 0.50) {
            this.up();
        }
    }

    update() {
        ++this.score;

        --this.flip;
        if (this.flip <= 0) {
            this.is_flipped = false;
        }

        this.velocity += this.gravity;
        this.y += this.velocity;


        if (this.y >= height - this.height / 2 || this.y <= this.height / 2) {
            this.dead = true;
        }
    }
}