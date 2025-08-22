module.exports.Player = class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.velocityy = 0;
        this.velocityLimit = -70;
        this.jumpHeight = 200;
        this.jumpTimer = 0;
        this.radius = 25;
        this.color = "black";
    }
    boundaries(canvas) {
        const canvasTop = 0;
        if (this.y > canvas.height - this.radius) {
            this.y = canvas.height - this.radius;
            this.velocityy = 0;
        }
        if (this.y < canvasTop + this.radius) {
            this.y = canvasTop + this.radius;
            this.velocityy = 0;
        }
    }
    _velocityLimit() {
        if (this.velocityy <= this.velocityLimit) {
            this.velocityy = this.velocityLimit;
        }
    }
    collision(block) {
        if (!block) return;
        if (
            block.x < this.x + this.radius &&
            block.y > this.y - this.radius &&
            block.x + block.width > this.x - this.radius
        ) {
            return true;
        } else if (
            block.x < this.x + this.radius &&
            block.y + block.height < this.y + this.radius &&
            block.x + block.width > this.x - this.radius
        ) {
            return true;
        } else {
            return false;
        }
    }
    physics(gravity, deltaTime) {
        this.velocityy += gravity * deltaTime;
        this.y += this.velocityy * deltaTime;
        this._velocityLimit();
    }
    jump(timeStamp) {
        if (timeStamp - this.jumpTimer > 100) {
            this.velocityy -= this.jumpHeight;
            this.jumpTimer = timeStamp;
        } else {
            return;
        }
    }
    draw(canvas, context) {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        context.closePath();
        context.fillStyle = this.color;
        context.fill();

        this.boundaries(canvas);
    }
};
