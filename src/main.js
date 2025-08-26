const { Game } = require("./classes/Game.js");
const canvas = document.getElementById("flappyCanvas");

function restartWithNextGeneration() {
    window.cancelAnimationFrame(game.animationFrame);

    const newGeneration = game.createNewGeneration();
    game = new Game(canvas, newGeneration);
    game.isGameOver = false;
    game.animationFrame = window.requestAnimationFrame((currentTime) => {
        game.drawLoop(currentTime);
    });
}

function restartGame() {
    window.cancelAnimationFrame(game.animationFrame);

    game = new Game(canvas);
    game.isGameOver = false;
    game.animationFrame = window.requestAnimationFrame((currentTime) => {
        game.drawLoop(currentTime);
    });
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

    /*
    window.addEventListener("keypress", (event) => {
        if (event.code === "Space") {
            game.players[0].jump(game.timeStamp);
        }
    });
    **/
};
