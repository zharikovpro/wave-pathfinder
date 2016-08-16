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
   * @param {number} startX
   * @param {number} startY
   * @param {number} finishX
   * @param {number} finishY
   *
   * @return {null|object[]} Path from start to finish or null if not found.
   *                      Example: [ { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 } ]
   */

  static findPath(passabilityMatrix, startX, startY, finishX, finishY) {
    const finder = new this(passabilityMatrix);

    return finder.findPath(startX, startY, finishX, finishY);
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
   * Shorthand that combines propagateWave + restorePath.
   *
   * @param {number} startX
   * @param {number} startY
   * @param {number} finishX
   * @param {number} finishY
   *
   * @return {null|array} Shortest path from start to finish or null if not found.
   *                 Example: [ { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 } ]
   */

  findPath(startX, startY, finishX, finishY) {
    this.propagateWave(startX, startY);

    return this.restorePath(finishX, finishY);
  }

  /**
   * Propagate wave and calculate steps number for each reachable cell.
   * This method must be called at least once to find shortest paths from start to other cells.
   * Once it has been called, restorePath can be called multiple times for different finish cells.
   *
   * @param {number} startX
   * @param {number} startY
   *
   * @return {array} Steps array with minimum possible steps number for each cell.
   *                 0 means start (current) cell, -1 means unreachable cell.
   */

  propagateWave(startX, startY) {
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
      for (let x = 0; x < this.stepsMatrix.length; x++) {
        for (let y = 0; y < this.stepsMatrix[0].length; y++) {
          if (this.stepsMatrix[x][y] === step) {
            propagateWave(x, y + 1, step); // up
            propagateWave(x + 1, y, step); // right
            propagateWave(x, y - 1, step); // down
            propagateWave(x - 1, y, step); // left
          }
        }
      }
    }

    return this.stepsMatrix;
  }

  /**
   * Finds shortest path from start to finish based on steps matrix.
   * Call this method after propagateWave.
   *
   * @param {number} finishX
   * @param {number} finishY
   *
   * @return {null|array} Path from start to finish or null if not found.
   *                      Example: [ { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 } ]
   */

  restorePath(finishX, finishY) {
    if (typeof this.stepsMatrix === 'undefined') {
      throw new Error('Call propagateWave first to calculate stepsMatrix!');
    }

    if (this.stepsMatrix[finishX][finishY] === this.UNVISITED_CELL) {
      this.resultPath = null;
      return null;
    }

    this.resultPath = [];

    let currentX = finishX;
    let currentY = finishY;

    const addStep = (x, y) => {
      this.resultPath.push({ x, y });
    };

    addStep(finishX, finishY);

    const propagateWave = (newX, newY, step) => {
      if (this.stepsMatrix[newX] !== undefined) {
        if (this.stepsMatrix[newX][newY] === step - 1) {
          addStep(newX, newY);
          currentX = newX;
          currentY = newY;
          if (step === 1) return true;
        }
      }
      return false;
    };

    for (let step = this.stepsMatrix[finishX][finishY]; step >= 0; step--) {
      if (
        propagateWave(currentX + 1, currentY, step) ||
        propagateWave(currentX - 1, currentY, step) ||
        propagateWave(currentX, currentY + 1, step) ||
        propagateWave(currentX, currentY - 1, step)
      ) {
        break;
      }
    }

    return this.resultPath.reverse();
  }
}

module.exports = WavePathfinder;
