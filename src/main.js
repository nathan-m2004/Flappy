const canvas = document.getElementById("flappyCanvas");
const context = canvas.getContext("2d");
let animation;

const gravity = 9.8;
let timeStamp = 0;
let deltaTime;

const player = {
    x: 0,
    y: 0,
    velocityx: 0,
    velocityy: 0,
    velocityLimit: -100,
    jumpHeight: 200,
    jumpTimer: 0,
    radius: 25,
    color: "black",
    _boundaries() {
        const canvasTop = 0;
        if (this.y > canvas.height - this.radius) {
            this.y = canvas.height - this.radius;
            this.velocityy = 0;
        }
        if (this.y < canvasTop + this.radius) {
            this.y = canvasTop + this.radius;
            this.velocityy = 0;
        }
    },
    _velocityLimit() {
        if (this.velocityy <= this.velocityLimit) {
            this.velocityy = this.velocityLimit;
        }
    },
    _physics() {
        this.velocityy += gravity * deltaTime;
        this.y += this.velocityy * deltaTime;
        this._boundaries();
        this._velocityLimit();
    },
    jump() {
        if (timeStamp - this.jumpTimer > 100) {
            this.velocityy -= this.jumpHeight;
            this._physics();
            this.jumpTimer = timeStamp;
        } else {
            return;
        }
    },
    draw() {
        context.beginPath();
        context.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        context.closePath();
        context.fillStyle = this.color;
        context.fill();

        this._physics();
    },
};

function drawLoop(currentTime) {
    deltaTime = (currentTime - timeStamp) / 100;
    timeStamp = currentTime;

    context.clearRect(0, 0, canvas.width, canvas.height);
    player.draw();
    context.stroke();

    animation = window.requestAnimationFrame(drawLoop);
}

window.onload = () => {
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    player.x = canvas.width / 4;
    player.y = canvas.height / 3;

    window.addEventListener("resize", resizeCanvas);
    animation = window.requestAnimationFrame(drawLoop);
    window.addEventListener("keydown", player.jump.bind(player));
};
