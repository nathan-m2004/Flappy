What is Flappy
-
Flappy is a flappy bird style game, but played by a simple genetic learning algorithm

Genetic algorithm breakdown
-
When the game starts it gets populated with players, each player has it's own `brain`. 
The brain is the `NeuralNetwork` a class that will generate a series of 4 Matrices

```javascript
// NeuralNetowrk class
this.bias_h = new Matrix(this.hiddenNodes, 1);
this.bias_o = new Matrix(this.outputNodes, 1);
this.weights_ih = new Matrix(hiddenNodes, inputNodes);
this.weights_ho = new Matrix(outputNodes, hiddenNodes);
```
Every matrix has it's values randomized from numbers to -1 to 1. The `weights` are the actual genes of the brain, and the `bias` is added to these weights to dictate the amount of activation.

The most important function in `NeuralNetwork` is the `feedForward()` it will take an `inputArray` that will be the values we read from the game, normalized between -1 and 1.
We use this array to make a matrix with 1 column and use the `Matrix` class to multiply it by the first Matrix of our brain `weights_ih`, than we add the first bias `bias_h` and perform a `sigmoid` function to map values between 0 and 1

```javascript
// NeuralNetowrk class
feedForward(inputArray) {
  let inputs = Matrix.fromArray(inputArray);
  let hidden = Matrix.multiply(this.weights_ih, inputs);
  hidden.add(this.bias_h);
  hidden.sigmoid();
```

After this we repeat the process using the `hidden` weight layer, and return the values as an array

```javascript
  let output = Matrix.multiply(this.weights_ho, hidden);
  output.add(this.bias_o);
  output.sigmoid();
  return output.toArray();
}
```

To make the player `think()` we take the first value returned by `feedForward()` and check if it is bigger than `0.5` if it is the player jumps
```javascript
// PlayerGenetic class
think(block, canvas, timeStamp) {
  // -- other code

  let output = this.brain.feedForward(inputs);
  if (output[0] > 0.5) {
    this.jump(timeStamp);
  }
}
```

New Generations
-

Whenever a player dies we compute their fitness
```javascript
// PlayerGenetic class
calculateFitness() {
  this.fitness = this.score + this.timeAlive;
}
```
When all players die we make a distribution of the probabilities
```javascript
fittestProbabilities() {
  let sumOfFitness = this.players.reduce((sum, player) => sum + player.fitness, 0);

  if (sumOfFitness === 0) {
    return this.players.map(() => 1 / this.players.length);
  }

  return this.players.map((player) => player.fitness / sumOfFitness);
}
```
So that when we select a random parent for a new player brain we can get higher probability of getting a higher fitness one
```javascript
selectParent() {
  const probabilities = this.fittestProbabilities();
  let randomNumber = Math.random();

  for (let i = 0; i < this.players.length; i++) {
    randomNumber -= probabilities[i];
    if (randomNumber <= 0) {
      return this.players[i];
    }
  }

  return this.players[this.players.length - 1];
}
```
We use the `selectParent()` function to `crossover()` new child brains, we use then to create new player, then we mutate and return an array of new players
```javascript
createNewGeneration() {
  let result = [new PlayerGenetic(this.canvas, this.players[0].brain)];
  for (let i = 0; i < this.populationSize - 1; i++) {
    const parent = this.selectParent();
    const crossover = parent.brain.crossover(parent.brain);
    const player = new PlayerGenetic(this.canvas, crossover);
    player.brain.mutate(0.1);
    result.push(player);
  }
  return result;
}
```
The `crossover(brain)` function is called from a brain and receives a brain. It initiates at the top a new child brain that will be returned at the end of the function.
```javascript
crossover(brain) {
        let child = new NeuralNetwork(this.inputNodes, this.hiddenNodes, this.outputNodes);
```
For each `weight` and `bias` we loop through all the values of the Matrix and decide with `50/50` from which parent the child will inherit the gene
```javascript
for (let r = 0; r < this.weights_ih.rows; r++) {
    for (let c = 0; c < this.weights_ih.cols; c++) {
    if (Math.random() > 0.5) {
      child.weights_ih.data[r][c] = brain.weights_ih.data[r][c];
    } else {
      child.weights_ih.data[r][c] = this.weights_ih.data[r][c];
    }
  }
}
```
