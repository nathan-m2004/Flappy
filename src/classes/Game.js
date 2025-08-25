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

        this.parrentsCrossoverAmount = 90;
        this.populationSize = 100;
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
    selectFittest() {
        let result = this.players.sort((a, b) => b.fitness - a.fitness);
        result.splice(this.parrentsCrossoverAmount);
        return result;
    }
    selectParent() {
        return this.selectFittest()[
            Math.floor(Math.random() * this.parrentsCrossoverAmount)
        ];
    }
    createNewGeneration() {
        const result = this.selectFittest();
        for (let i = 0; i < this.parrentsCrossoverAmount; i++) {
            result[i].brain = result[i].brain.crossover(
                this.selectParent().brain
            );
        }
        while (result.length < this.populationSize) {
            if (Math.random() > 0.5) {
                result.push(new PlayerGenetic(this.canvas));
            } else {
                result.push(
                    new PlayerGenetic(
                        this.canvas,
                        this.selectFittest()[0].brain
                    )
                );
            }
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
            console.log(this.createNewGeneration());
            window.restartGame();
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
