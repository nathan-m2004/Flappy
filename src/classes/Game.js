const { Block } = require("./Blocks.js");
const { PlayerGenetic } = require("./Genetic.js");

module.exports.Game = class Game {
    constructor(canvas, players) {
        this.canvas = canvas;
        this.context = canvas.getContext("2d");
        this.gravity = 9.8;
        this.animationFrame;
        this.isGameOver = false;
        this.timeStamp = 0;
        this.deltaTime = 0;

        this.populationSize = 10000;
        if (players) {
            this.players = players;
        } else {
            this.players = [];
            for (let i = 0; i < this.populationSize; i++) {
                this.players.push(new PlayerGenetic(this.canvas));
            }
        }

        // Block
        this.blocks = [];
        this.blockDelayMiliseconds = 2000;
        this.blockMinDelayMiliseconds = 1000;
        this.blockDelayRate = 0.8;
        this.lastBlock = 0;
    }
    fittestProbabilities() {
        let sumOfFitness = this.players.reduce(
            (sum, player) => sum + player.fitness,
            0
        );
        if (sumOfFitness === 0) {
            return this.players.map(() => 1 / this.players.length);
        }

        console.log(sumOfFitness);
        return this.players.map((player) => player.fitness / sumOfFitness);
    }
    selectParent() {
        const probabilities = this.fittestProbabilities();
        let randomNumber = Math.random();

        for (let i = 0; i < this.players.length; i++) {
            randomNumber -= probabilities[i];
            if (randomNumber <= 0) {
                console.log(this.players[i]);
                return this.players[i];
            }
        }

        return this.players[this.players.length - 1];
    }
    createNewGeneration() {
        let result = [this.players[0]];
        for (let i = 0; i < this.populationSize; i++) {
            const parent = this.selectParent();
            const crossover = parent.brain.crossover(parent.brain);
            const player = new PlayerGenetic(this.canvas, crossover);
            player.brain.mutate(0.1);
            result.push(player);
        }
        return result;
    }
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
    }
    blockDeletion() {
        if (!this.blocks[0]) return;
        if (this.blocks[0].x < 0 - this.blocks[0].width) {
            this.blocks.shift();
            this.players.forEach((player) => {
                player.addScore();
            });
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
        if (this.isGameOver) {
            window.restartWithNextGeneration();
            return;
        }

        if (this.timeStamp === 0) {
            this.timeStamp = currentTime;
        }

        this.deltaTime = (currentTime - this.timeStamp) / 100;
        this.timeStamp = currentTime;

        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Player
        this.players.forEach((player) => {
            player.think(this.blocks[0], this.canvas, this.timeStamp);
            player.calculateTime();
            player.physics(this.gravity, this.deltaTime);
            this.blocks.forEach((block) => {
                const collision = player.collision(block);
                if (collision) {
                    player.isDead = true;
                    player.calculateFitness();
                    //this.isGameOver = true;
                    //window.restartGame();
                }
            });

            player.draw(this.canvas, this.context);
        });
        const allDead = this.players.every((player) => player.isDead);
        if (allDead) {
            this.isGameOver = true;
        }

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
};
