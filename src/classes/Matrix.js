module.exports.Matrix = class Matrix {
    constructor(rows, cols) {
        this.rows = rows;
        this.cols = cols;
        this.data = [];

        for (let r = 0; r < this.rows; r++) {
            this.data[r] = [];
            for (let c = 0; c < this.cols; c++) {
                this.data[r][c] = 0;
            }
        }
    }

    randomize() {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                this.data[r][c] = Math.random() * 2 - 1;
            }
        }
    }

    add(matrix) {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                this.data[r][c] += matrix.data[r][c];
            }
        }
    }

    static fromArray(array) {
        let matrix = new Matrix(array.length, 1);
        for (let r = 0; r < array.length; r++) {
            matrix.data[r][0] = array[r];
        }
        return matrix;
    }

    toArray() {
        let array = [];
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                array.push(this.data[r][c]);
            }
        }
        return array;
    }

    static multiply(a, b) {
        if (a.cols !== b.rows) {
            console.log("Columns of A must match rows of B.");
            return undefined;
        }

        let result = new Matrix(a.rows, b.cols);
        for (let r = 0; r < result.rows; r++) {
            for (let c = 0; c < result.cols; c++) {
                let sum = 0;
                for (
                    let multiplaction = 0;
                    multiplaction < a.cols;
                    multiplaction++
                ) {
                    sum += a.data[r][multiplaction] * b.data[multiplaction][c];
                }
                result.data[r][c] = sum;
            }
        }
        return result;
    }

    sigmoid() {
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                this.data[r][c] = 1 / (1 + Math.exp(-this.data[r][c]));
            }
        }
    }
};
