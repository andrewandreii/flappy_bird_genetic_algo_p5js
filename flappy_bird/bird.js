class Bird {
    default_sprite = null;

    in_nodes = 4;
    hid_nodes = 6;
    out_nodes = 1;

    constructor(decision, color, sprite){
        this.width = 64;
        this.height = 64;

        this.gravity = 0.6;
        this.lift = -10;
        this.velocity = 0;

        this.y = 64;
        this.x = 64;

        this.score = 0;

        if (sprite != null) {
            this.sprite = sprite;
        } else {
            this.sprite = Bird.default_sprite;
        }

        if (decision) {
            this.decision = decision.copy();
        } else {
            this.decision = new NeuralNetwork(this.in_nodes, this.hid_nodes, this.out_nodes);
        }

        if (color) {
            this.color = color;
        } else {
            this.color = [random(255), random(255), random(255)];
        }

        // calculate bird's color
        // let weights_ih_sum = this.decision.weights_ih.sum() / (this.in_nodes * this.hid_nodes);
        // let weights_ho_sum = this.decision.weights_ho.sum() / (this.hid_nodes * this.out_nodes);
        // let bias_h_sum = this.decision.bias_h.sum() / this.hid_nodes;
        // let bias_o_sum = this.decision.bias_o.sum() / this.out_nodes;

        // this.color = [weights_ho_sum * weights_ih_sum, bias_h_sum * bias_o_sum];
        // this.color[2] = this.color[0] * this.color[1];
        // this.color = this.color.map(
        //     function (x) {
        //         return (x + 1) / 2 * 255;
        //     }
        // );
    }

    show(){
        noStroke();
        fill(this.color);
        ellipse(this.x, this.y - this.height / 2 - 10, 20);
        image(this.sprite, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }

    up(){
        this.velocity = this.lift;
    }

    make_decision(pipes){
        
        let closest_pipe = null;
        let closest_distance = Infinity;
        for(let i = 1; i < pipes.lenght; i++){
                let distance = pipes[i].x - this.x;
                if(distance < closest_distance && distance > 0){
                    closest_pipe = pipes[i];
                    closest_distance = distance;
                }
        }

        let inputs = [];
        inputs[0] = this.y / height;
        inputs[1] = pipes[0].top / height;
        inputs[2] = pipes[0].bottom / height;
        inputs[3] = pipes[0].x / width;

        let output = this.decision.predict(inputs);
        if(output> 0.5){
            this.up();
        }
    }

    update(){
        ++ this.score;

        this.velocity += this.gravity;
        this.y += this.velocity;

        if (this.y >= height - this.height / 2) {
            this.y = height - this.height / 2;
            this.velocity = 0;
          }
      
          if (this.y <= this.height / 2) {
            this.y = this.height / 2;
            this.velocity = 0;
        }
    }
}