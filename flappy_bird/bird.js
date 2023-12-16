class Bird {
    costructor(){
        this.width = 64;
        this.height = 64;

        this.gravity = 0.6;
        this.lift = -10;
        this.velocity = 0;

        this.y = 64;
        this.x = 64;
    }

    show(){
        image(this.icon, this.x - this.width / 2, this.y - this.height / 2, this.width, this.height);
    }

    up(){
        this.velocity = this.lift;
    }

    update(){
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