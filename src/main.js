const { Player } = require("./classes/Player.js");
const { Block } = require("./classes/Blocks.js");
const canvas = document.getElementById("flappyCanvas");

class Game {
    constructor() {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.gravity = 9.8;
        this.animationFrame;
        this.isGameOver = false;
        this.timeStamp = 0;
        this.deltaTime;
        this.player = new Player(this.canvas.width / 4, this.canvas.height / 3);
        this.block = new Block(
            this.canvas.width,
            this.canvas.height / 2,
            200,
            400
        );
    }
    drawLoop(currentTime) {
        if (this.isGameOver) return;

        this.deltaTime = (currentTime - this.timeStamp) / 100;
        this.timeStamp = currentTime;

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Player
        this.player.physics(this.gravity, this.deltaTime);
        const collision = this.player.collision(this.block);
        if (collision) {
            window.cancelAnimationFrame(this.animationFrame);
            this.isGameOver = true;
        }
        this.player.draw(this.canvas, this.context);

        // Block
        this.block.move(this.deltaTime, this.timeStamp);
        this.block.draw(this.canvas, this.context);

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

    game = new Game();
    game.animationFrame = window.requestAnimationFrame((currentTime) => {
        game.drawLoop(currentTime);
    });

    window.addEventListener("keydown", () => {
        game.player.jump(game.timeStamp);
    });
};
