module.exports.Block = class Block {
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.velocityx = -20;
        this.velocityLimit = -70;
        this.color = "black";
    }
    _velocityLimit() {
        if (this.velocityx <= this.velocityLimit) {
            this.velocityx = this.velocityLimit;
        }
    }
    move(deltaTime, timeStamp) {
        this.velocityx += (-timeStamp / 10000) * deltaTime;
        this.x += this.velocityx * deltaTime;
        this._velocityLimit();
    }
    draw(canvas, context) {
        context.beginPath();
        context.rect(this.x, this.y, this.width, -canvas.height - this.x);
        context.rect(
            this.x,
            this.y + this.height,
            this.width,
            canvas.height - this.x
        );
        context.closePath();
        context.fillStyle = this.color;
        context.fill();
    }
};
