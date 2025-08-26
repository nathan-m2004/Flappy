const { Game } = require("./classes/Game.js");
const canvas = document.getElementById("flappyCanvas");

const generationSpan = document.getElementById("generation");
const bestScoreSpan = document.getElementById("bestScore");
const playersAliveSpan = document.getElementById("playersAlive");
const startAIButton = document.getElementById("startAI");
const restartGameButton = document.getElementById("restartGame");
const populationSizeInput = document.getElementById("populationSizeInput");

let game;
let generation = 0;

// Function to update the GUI display
function updateGUI() {
    generationSpan.textContent = generation;
    bestScoreSpan.textContent = game.getBestScore();
    playersAliveSpan.textContent = game.getPlayersAlive();
}

startAIButton.addEventListener("click", restartGame);
restartGameButton.addEventListener("click", restartGame);

function restartWithNextGeneration() {
    if (game) {
        window.cancelAnimationFrame(game.animationFrame);
    }

    const populationSize = parseInt(populationSizeInput.value);
    generation++;
    const newGeneration = game.createNewGeneration();
    game = new Game(canvas, populationSize, newGeneration);
    game.isGameOver = false;
    game.animationFrame = window.requestAnimationFrame((currentTime) => {
        updateGUI();
        game.drawLoop(currentTime);
    });
}

function restartGame() {
    if (game) {
        window.cancelAnimationFrame(game.animationFrame);
    }

    const populationSize = parseInt(populationSizeInput.value);
    generation = 0;
    game = new Game(canvas, populationSize);
    game.populationSize = parseInt(populationSizeInput.value);
    game.isGameOver = false;
    game.animationFrame = window.requestAnimationFrame((currentTime) => {
        updateGUI();
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
};
