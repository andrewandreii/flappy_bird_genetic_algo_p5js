class Bird {

    constructor(){
        this.width = height/2;
        this.height = 64;

        this.gravity = 0.6;
        this.lift = -10;
        this.velocity = 0;

        this.y = 64;
        this.x = 64;

        this.decision = new NeuralNetwork(4,4,1);
    }

    show(){
        image(this.icon, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
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

        let inputs =[];
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
        this.velocity += this.gravity;
        this.y += this.velocity;

        if (this.y >= this.win_height - this.height / 2) {
            this.y = this.win_height - this.height / 2;
            this.velocity = 0;
          }
      
          if (this.y <= this.height / 2) {
            this.y = this.height / 2;
            this.velocity = 0;
        }
    }
}