const { Matrix } = require("./Matrix.js");
const { Player } = require("./Player.js");

function map(value, min_in, max_in, min_out, max_out) {
    return (
        ((value - min_in) * (max_out - min_out)) / (max_in - min_in) + min_out
    );
}

class NeuralNetwork {
    constructor(inputNodes, hiddenNodes, outputNodes) {
        this.inputNodes = inputNodes;
        this.hiddenNodes = hiddenNodes;
        this.outputNodes = outputNodes;

        this.bias_h = new Matrix(this.hiddenNodes, 1);
        this.bias_o = new Matrix(this.outputNodes, 1);
        this.weights_ih = new Matrix(hiddenNodes, inputNodes);
        this.weights_ho = new Matrix(outputNodes, hiddenNodes);
        this.bias_h.randomize();
        this.bias_o.randomize();
        this.weights_ih.randomize();
        this.weights_ho.randomize();
    }

    crossover(brain) {
        let child = new NeuralNetwork(
            this.inputNodes,
            this.hiddenNodes,
            this.outputNodes
        );

        for (let r = 0; r < this.bias_h.rows; r++) {
            for (let c = 0; c < this.bias_h.cols; c++) {
                if (Math.random() > 0.5) {
                    child.bias_h.data[r][c] = brain.bias_h.data[r][c];
                } else {
                    child.bias_h.data[r][c] = this.bias_h.data[r][c];
                }
            }
        }

        for (let r = 0; r < this.bias_o.rows; r++) {
            for (let c = 0; c < this.bias_o.cols; c++) {
                if (Math.random() > 0.5) {
                    child.bias_o.data[r][c] = brain.bias_o.data[r][c];
                } else {
                    child.bias_o.data[r][c] = this.bias_o.data[r][c];
                }
            }
        }

        for (let r = 0; r < this.weights_ho.rows; r++) {
            for (let c = 0; c < this.weights_ho.cols; c++) {
                if (Math.random() > 0.5) {
                    child.weights_ho.data[r][c] = brain.weights_ho.data[r][c];
                } else {
                    child.weights_ho.data[r][c] = this.weights_ho.data[r][c];
                }
            }
        }

        for (let r = 0; r < this.weights_ih.rows; r++) {
            for (let c = 0; c < this.weights_ih.cols; c++) {
                if (Math.random() > 0.5) {
                    child.weights_ih.data[r][c] = brain.weights_ih.data[r][c];
                } else {
                    child.weights_ih.data[r][c] = this.weights_ih.data[r][c];
                }
            }
        }

        return child;
    }

    feedForward(inputArray) {
        let inputs = Matrix.fromArray(inputArray);

        let hidden = Matrix.multiply(this.weights_ih, inputs);
        hidden.add(this.bias_h);
        hidden.sigmoid();

        let output = Matrix.multiply(this.weights_ho, hidden);
        output.add(this.bias_o);
        output.sigmoid();

        return output.toArray();
    }
}

module.exports.PlayerGenetic = class PlayerGenetic {
    constructor(canvas, brain) {
        if (brain) {
            this.brain = brain;
        } else {
            this.brain = new NeuralNetwork(5, 3, 1);
        }
        this.player = new Player(canvas.width / 4, canvas.height / 3, 0.45);
        this.score = 0;
        this.isDead = false;
        this.fitness;
    }
    calculateFitness() {
        const scoreNormalized = map(this.score, 0, 50, -1, 0);
        this.fitness = scoreNormalized;
    }
    addScore() {
        if (this.isDead) return;
        this.score += 1;
        console.log(this.score);
    }
    think(block, canvas, timeStamp) {
        if (block && !this.isDead) {
            let inputs = [];
            inputs[0] = map(
                this.player.velocityy,
                this.player.velocityLimit,
                -this.player.velocityLimit,
                -1,
                1
            );
            inputs[1] = map(this.player.y, 0, canvas.height, -1, 1);
            inputs[2] = map(block.x, 0, canvas.width, -1, 1);
            inputs[3] = map(block.y, 0, canvas.height, -1, 1);
            inputs[4] = map(block.x - this.player.x, 0, canvas.width, -1, 1);

            let output = this.brain.feedForward(inputs);

            if (output[0] > 0.5) {
                this.jump(timeStamp);
            }
        }
    }
    jump(timeStamp) {
        this.player.jump(timeStamp);
    }
    physics(gravity, deltaTime) {
        if (this.isDead) return;
        this.player.physics(gravity, deltaTime);
    }
    draw(canvas, context) {
        if (this.isDead) return;
        this.player.draw(canvas, context);
    }
    collision(block) {
        if (this.isDead) return;
        return this.player.collision(block);
    }
};
