const { Player } = require("./classes/Player.js");
const { Block } = require("./classes/Blocks.js");
const canvas = document.getElementById("flappyCanvas");
const context = canvas.getContext("2d");

const gravity = 9.8;

let animationFrame;

let timeStamp = 0;
let deltaTime;
let player;
let block;

function drawLoop(currentTime) {
    deltaTime = (currentTime - timeStamp) / 100;
    timeStamp = currentTime;

    context.clearRect(0, 0, canvas.width, canvas.height);

    player.physics(gravity, deltaTime);
    player.draw(canvas, context);

    block.move(deltaTime, timeStamp);
    block.draw(canvas, context);

    context.stroke();

    animationFrame = window.requestAnimationFrame(drawLoop);
}

window.onload = () => {
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    player = new Player(canvas.width / 4, canvas.height / 3);

    block = new Block(canvas.width, canvas.height / 2, 200, 400);

    window.addEventListener("keydown", () => {
        player.jump(timeStamp);
    });

    animationFrame = window.requestAnimationFrame(drawLoop);
};
