/**
 * Classic wave path finding algorithm
 * Wiki: (https://en.wikipedia.org/wiki/Lee_algorithm)
 *
 * @author Andrey Zharikov & Nikolay Govorov
 *
 */

class WavePathfinder {
  /**
   * Shorthand method for findPath
   *
   * @param {array} passabilityMatrix
   * @param {number} startRow
   * @param {number} startCol
   * @param {number} finishRow
   * @param {number} finishCol
   *
   * @return {null|object[]} Path from start to finish or null if not found.
   *                         Array of { row, col } steps.
   *                         Example: [ { 0, 0 }, { 0, 1 }, { 0, 2 } ]
   */

  static findPath(passabilityMatrix, startRow, startCol, finishRow, finishCol) {
    const finder = new this(passabilityMatrix);

    return finder.findPath(startRow, startCol, finishRow, finishCol);
  }

  /**
   * Instantiate object based on passability matrix
   *
   * @param {array} passabilityMatrix - two-dimensional boolean array (x, y)
   *                where true is passable cell and false is non-passable.
   *                other truthy and falsy values can be used as well.
   *                Example: [ [1, 1, 1], [0, 0, 1], [1, 0, 1] ]
   *
   * @return {object} WavePathfinder object
   */

  constructor(passabilityMatrix) {
    if (!Array.isArray(passabilityMatrix)) {
      throw new Error('Incorrect matrix!');
    }

    this.START_CELL = 0;
    this.UNVISITED_CELL = -1;

    this.passabilityMatrix = passabilityMatrix.map(row => row.slice());

    return this;
  }

  /**
   * Shorthand that combines expandWave + backtracePath.
   *
   * @param {number} startX
   * @param {number} startY
   * @param {number} finishX
   * @param {number} finishY
   *
   * @return {null|array} Shortest path from start to finish or null if not found.
   *                      Array of { row, col } steps.
   *                      Example: [ { 0, 0 }, { 0, 1 }, { 0, 2 } ]
   */

  findPath(startX, startY, finishX, finishY) {
    this.expandWave(startX, startY);

    return this.backtracePath(finishX, finishY);
  }

  /**
   * Expand wave and calculate steps number for each reachable cell.
   * This method must be called at least once to find shortest paths from start to other cells.
   * Once it has been called, backtracePath can be called multiple times for different finish cells.
   *
   * @param {number} startX
   * @param {number} startY
   *
   * @return {array} Steps array with minimum possible steps number for each cell.
   *                 0 means start (current) cell, -1 means unreachable cell.
   */

  expandWave(startX, startY) {
    this.resultPath = [];

    // first part of the wave algorithm - work field matrix initialization
    this.stepsMatrix = this.passabilityMatrix.map(row => row.slice().fill(this.UNVISITED_CELL));
    this.stepsMatrix[startX][startY] = this.START_CELL;

    // second part of the wave algorithm - wave propagation
    const propagateWave = (newX, newY, step) => {
      if (this.passabilityMatrix[newX] && this.passabilityMatrix[newX][newY]) {
        if (this.stepsMatrix[newX][newY] === this.UNVISITED_CELL) {
          this.stepsMatrix[newX][newY] = step + 1;
        }
      }
    };

    for (let step = 0; step < this.stepsMatrix.length * this.stepsMatrix[0].length; step++) {
      for (let row = 0; row < this.stepsMatrix.length; row++) {
        for (let col = 0; col < this.stepsMatrix[0].length; col++) {
          if (this.stepsMatrix[row][col] === step) {
            propagateWave(row, col + 1, step); // up
            propagateWave(row + 1, col, step); // right
            propagateWave(row, col - 1, step); // down
            propagateWave(row - 1, col, step); // left
          }
        }
      }
    }

    return this.stepsMatrix;
  }

  /**
   * Finds shortest path from start to finish based on steps matrix.
   * Call this method after expandWave.
   *
   * @param {number} finishRow
   * @param {number} finishCol
   *
   * @return {null|array} Path from start to finish or null if not found.
   *                      Array of { row, col } steps.
   *                      Example: [ { 0, 0 }, { 0, 1 }, { 0, 2 } ]
   */

  backtracePath(finishRow, finishCol) {
    if (typeof this.stepsMatrix === 'undefined') {
      throw new Error('Call expandWave first to calculate stepsMatrix!');
    }

    if (this.stepsMatrix[finishRow][finishCol] === this.UNVISITED_CELL) {
      this.resultPath = null;
      return null;
    }

    this.resultPath = [];

    let currentRow = finishRow;
    let currentCol = finishCol;

    const addStep = (row, col) => {
      this.resultPath.push([ row, col ]);
    };

    addStep(finishRow, finishCol);

    const propagateWave = (newRow, newCol, step) => {
      if (this.stepsMatrix[newRow] !== undefined) {
        if (this.stepsMatrix[newRow][newCol] === step - 1) {
          addStep(newRow, newCol);
          currentRow = newRow;
          currentCol = newCol;
          if (step === 1) return true;
        }
      }
      return false;
    };

    for (let step = this.stepsMatrix[finishRow][finishCol]; step >= 0; step--) {
      if (
        propagateWave(currentRow + 1, currentCol, step) ||
        propagateWave(currentRow - 1, currentCol, step) ||
        propagateWave(currentRow, currentCol + 1, step) ||
        propagateWave(currentRow, currentCol - 1, step)
      ) {
        break;
      }
    }

    return this.resultPath.reverse();
  }
}

module.exports = WavePathfinder;
