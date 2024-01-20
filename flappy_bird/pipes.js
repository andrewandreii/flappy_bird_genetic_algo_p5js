class Pipe {
    spacing = 140;

    pipeMargin = 20;

    constructor() {
        this.spacing = Pipe.spacing;
        this.top = random(this.pipeMargin, height - Pipe.spacing - this.pipeMargin);
        this.bottom = this.top + this.spacing;

        this.x = width;
        this.w = 80;
        this.speed = 3;

        if (noImages) {
            this.show = () => {
                fill(115, 98, 65);
                rect(this.x, 0, this.w, this.top);
                rect(this.x, this.bottom, this.w, width - this.bottom);
            };
        }
    }

    hits(bird) {
        let halfBirdHeight = bird.height / 2;
        let halfBirdwidth = bird.width / 2;
        if (bird.y - halfBirdHeight < this.top || bird.y + halfBirdHeight > this.bottom) {
            if (bird.x + halfBirdwidth > this.x && bird.x - halfBirdwidth < this.x + this.w) {
                return true;
            }
        }
        return false;
    }

    drawHalf() {
        let howManyNedeed = 0;
        let peakRatio = pipePeakSprite.height / pipePeakSprite.width;
        let bodyRatio = pipeBodySprite.height / pipeBodySprite.width;
        howManyNedeed = Math.round(height / (this.w * bodyRatio));
        for (let i = 0; i < howManyNedeed; ++i) {
            let offset = this.w * (i * bodyRatio + peakRatio);
            image(pipeBodySprite, -this.w / 2, offset, this.w, this.w * bodyRatio);
        }
        image(pipePeakSprite, -this.w / 2, 0, this.w, this.w * peakRatio);
    }

    show() {
        push();
        translate(this.x + this.w / 2, this.bottom);
        this.drawHalf();
        translate(0, -this.spacing);
        rotate(PI);
        this.drawHalf();
        pop();
    }

    update() {
        this.x -= this.speed;
    }

    offscreen() {
        return this.x < -this.w;
    }
}