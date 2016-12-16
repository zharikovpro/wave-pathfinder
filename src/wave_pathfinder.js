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
   * @param {array} obstaclesMatrix
   * @param {number} startY
   * @param {number} startX
   * @param {number} finishY
   * @param {number} finishX
   *
   * @return {null|object[]} Path from start to finish or null if not found.
   *                         Example: [ [0, 0], [1, 0], [2, 0] ]
   */

  static findPath(obstaclesMatrix, startY, startX, finishY, finishX) {
    const finder = new this(obstaclesMatrix);

    return finder.findPath(startY, startX, finishY, finishX);
  }

  /**
   * Instantiate object based on passability matrix
   *
   * @param {array} obstaclesMatrix - two-dimensional boolean array (x, y)
   *                where true is passable cell and false is non-passable.
   *                other truthy and falsy values can be used as well.
   *                Example: [ [1, 1, 1], [0, 0, 1], [1, 0, 1] ]
   *
   * @return {object} WavePathfinder object
   */

  constructor(obstaclesMatrix) {
    if (!Array.isArray(obstaclesMatrix)) {
      throw new Error('Incorrect matrix!');
    }

    this.START_CELL = 0;
    this.UNVISITED_CELL = -1;

    this.obstaclesMatrix = obstaclesMatrix.map(row => row.slice());

    return this;
  }

  /**
   * Shorthand that combines expandWave + backtracePath.
   *
   * @param {number} startY
   * @param {number} startX
   * @param {number} finishY
   * @param {number} finishX
   *
   * @return {null|array} Shortest path from start to finish or null if not found.
   *                      Example: [ [0, 0], [1, 0], [2, 0] ]
   */

  findPath(startY, startX, finishY, finishX) {
    this.expandWave(startY, startX);

    return this.backtracePath(finishY, finishX);
  }

  /**
   * Expand wave and calculate steps number for each reachable cell.
   * This method must be called at least once to find shortest paths from start to other cells.
   * Once it has been called, backtracePath can be called multiple times for different finish cells.
   *
   * @param {number} startY
   * @param {number} startX
   *
   * @return {array} Steps array with minimum possible steps number for each cell.
   *                 0 means start (current) cell, -1 means unreachable cell.
   */

  expandWave(startY, startX) {
    this.resultPath = [];

    // first part of the wave algorithm - work field matrix initialization
    this.stepsMatrix = this.obstaclesMatrix.map(row => row.slice().fill(this.UNVISITED_CELL));
    this.stepsMatrix[startY][startX] = this.START_CELL;

    // second part of the wave algorithm - wave propagation
    const propagateWave = (newY, newX, step) => {
      if (this.obstaclesMatrix[newY] && !this.obstaclesMatrix[newY][newX]) {
        if (this.stepsMatrix[newY][newX] === this.UNVISITED_CELL) {
          this.stepsMatrix[newY][newX] = step + 1;
        }
      }
    };

    for (let step = 0; step < this.stepsMatrix.length * this.stepsMatrix[0].length; step++) {
      for (let y = 0; y < this.stepsMatrix.length; y++) {
        for (let x = 0; x < this.stepsMatrix[0].length; x++) {
          if (this.stepsMatrix[y][x] === step) {
            propagateWave(y + 1, x, step); // up
            propagateWave(y, x + 1, step); // right
            propagateWave(y - 1, x, step); // down
            propagateWave(y, x - 1, step); // left
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
   * @param {number} finishY
   * @param {number} finishX
   *
   * @return {null|array} Path from start to finish or null if not found.
   *                      Example: [ [0, 0], [1, 0], [2, 0] ]
   */

  backtracePath(finishY, finishX) {
    if (typeof this.stepsMatrix === 'undefined') {
      throw new Error('Call expandWave first to calculate stepsMatrix!');
    }

    if (this.stepsMatrix[finishY][finishX] === this.UNVISITED_CELL) {
      this.resultPath = null;
      return null;
    }

    this.resultPath = [];

    let currentY = finishY;
    let currentX = finishX;

    const addStep = (y, x) => {
      this.resultPath.push([y, x]);
    };

    addStep(finishY, finishX);

    const propagateWave = (newY, newX, step) => {
      if (this.stepsMatrix[newY] !== undefined) {
        if (this.stepsMatrix[newY][newX] === step - 1) {
          addStep(newY, newX);
          currentY = newY;
          currentX = newX;
          if (step === 1) return true;
        }
      }
      return false;
    };

    for (let step = this.stepsMatrix[finishY][finishX]; step >= 0; step--) {
      if (
        propagateWave(currentY + 1, currentX, step) ||
        propagateWave(currentY - 1, currentX, step) ||
        propagateWave(currentY, currentX + 1, step) ||
        propagateWave(currentY, currentX - 1, step)
      ) {
        break;
      }
    }

    return this.resultPath.reverse();
  }
}

module.exports = WavePathfinder;
