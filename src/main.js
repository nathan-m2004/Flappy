const { Player } = require("./classes/Player.js");
const { Block } = require("./classes/Blocks.js");
const canvas = document.getElementById("flappyCanvas");

class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.gravity = 9.8;
        this.animationFrame;
        this.isGameOver = false;
        this.timeStamp = 0;
        this.deltaTime;
        this.player = new Player(this.canvas.width / 4, this.canvas.height / 3);
        this.blocks = [];
        this.blockDelayMiliseconds = 2000;
        this.blockMinDelayMiliseconds = 1000;
        this.blockDelayRate = 0.8;
        this.lastBlock = 0;
    }
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    blockDeletion() {
        if (!this.blocks[0]) return;
        if (this.blocks[0].x < 0 - this.blocks[0].width) {
            this.blocks.shift();
        }
    }
    blockCreation() {
        const x = this.canvas.width;
        const yMin = this.canvas.height / 10;
        const yMax = this.canvas.height / 2;
        const width = 200;
        const height = 400;
        if (this.blockDelayMiliseconds > this.blockMinDelayMiliseconds) {
            this.blockDelayMiliseconds -=
                this.blockDelayRate * (this.deltaTime * 3);
        }
        if (this.timeStamp - this.lastBlock >= this.blockDelayMiliseconds) {
            this.blocks.push(
                new Block(x, this.getRandomInt(yMin, yMax), width, height)
            );
            this.lastBlock = this.timeStamp;
        } else return;
    }
    drawLoop(currentTime) {
        if (this.isGameOver) return;

        this.deltaTime = (currentTime - this.timeStamp) / 100;
        this.timeStamp = currentTime;

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Player
        this.player.physics(this.gravity, this.deltaTime);
        const collisionBlock0 = this.player.collision(this.blocks[0]);
        const collisionBlock1 = this.player.collision(this.blocks[1]);
        if (collisionBlock0 || collisionBlock1) {
            window.cancelAnimationFrame(this.animationFrame);
            this.isGameOver = true;
        }
        this.player.draw(this.canvas, this.context);

        // Block
        this.blockCreation();
        this.blocks.forEach((block) => {
            block.move(this.deltaTime, this.timeStamp);
            block.draw(this.canvas, this.context);
        });
        this.blockDeletion();

        this.context.stroke();

        this.animationFrame = window.requestAnimationFrame((currentTime) => {
            game.drawLoop(currentTime);
        });
    }
}

window.onload = () => {
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    game = new Game(canvas);
    game.animationFrame = window.requestAnimationFrame((currentTime) => {
        game.drawLoop(currentTime);
    });

    window.addEventListener("keypress", (event) => {
        if (event.code === "Space") {
            game.player.jump(game.timeStamp);
        }
    });
};
