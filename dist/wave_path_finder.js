'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Classic wave path finding algorithm
 * Wiki: (https://en.wikipedia.org/wiki/Lee_algorithm)
 *
 * @author Andrey Zharikov & Nikolay Govorov
 *
 */

var WavePathFinder = function () {
  _createClass(WavePathFinder, null, [{
    key: 'findPath',

    /**
     * Static wrapper for findPath
     *
     * @param {array} passabilityMatrix
     * @param {number} startX
     * @param {number} startY
     * @param {number} finishX
     * @param {number} finishY
     *
     * @return {array} path
     */

    value: function findPath(passabilityMatrix, startX, startY, finishX, finishY) {
      var finder = new this(passabilityMatrix);

      return finder.findPath(startX, startY, finishX, finishY);
    }

    /**
     * Constructor requires passability matrix
     *
     * @param {array} passabilityMatrix - two-dimensional boolean array
     *                true: passable cell, false: non-passable
     *                other truthy and falsy values can be used as well:
     *                Example: [ 1, 1, 1 ]
     *                         [ 0, 0, 1 ]
     *                         [ 1, 0, 1 ]
     *
     * @return {undefined}
     */

  }]);

  function WavePathFinder(passabilityMatrix) {
    _classCallCheck(this, WavePathFinder);

    if ((typeof passabilityMatrix === 'undefined' ? 'undefined' : _typeof(passabilityMatrix)) !== 'object') {
      throw new Error('Incorrect matrix!');
    } else {
      this.passabilityMatrix = passabilityMatrix.map(function (row) {
        return row.slice();
      });
    }

    this.START_CELL = 0;
    this.UNVISITED_CELL = -1;
  }

  /**
   * The function is a wrapper over functions propagateWave and restorePath.
   *
   * @param {number} startX
   * @param {number} startY
   * @param {number} finishX
   * @param {number} finishY
   *
   * @return {array} If there is a way the function will return an array of objects with
   *                 two fields (x and y), including the start and end points.
   *                 Example: [ { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 },
   *                            { x: 0, y: 4 }, { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 } ]
   *                 If there is no way it will return null.
   */

  _createClass(WavePathFinder, [{
    key: 'findPath',
    value: function findPath(startX, startY, finishX, finishY) {
      this.propagateWave(startX, startY);

      return this.restorePath(finishX, finishY);
    }

    /**
     * The function will propagate the wave. This is the second stage of the wave algorithm.
     *
     * @param {number} startX
     * @param {number} startY
     *
     * @return {array} Wave array with minimum possible steps number for each reachable cell
     */

  }, {
    key: 'propagateWave',
    value: function propagateWave(startX, startY) {
      var _this = this;

      this.resultPath = [];

      // first part of the wave algorithm - matrix initialization
      this.stepsMatrix = this.passabilityMatrix.map(function (row) {
        return row.slice().fill(_this.UNVISITED_CELL);
      });
      this.stepsMatrix[startX][startY] = this.START_CELL;

      // second part of the wave algorithm - wave propagation
      var propagateWave = function propagateWave(newX, newY, step) {
        if (_this.passabilityMatrix[newX] && _this.passabilityMatrix[newX][newY]) {
          if (_this.stepsMatrix[newX][newY] === _this.UNVISITED_CELL) {
            _this.stepsMatrix[newX][newY] = step + 1;
          }
        }
      };

      for (var step = 0; step < this.stepsMatrix.length * this.stepsMatrix[0].length; step++) {
        for (var x = 0; x < this.stepsMatrix.length; x++) {
          for (var y = 0; y < this.stepsMatrix[0].length; y++) {
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
     * This method will restore the path on the basis of waves from a point which came to zero.
     * Execute this method after method propagateWave. This is the third step of the wave algorithm.
     *
     * @param {number} finishX
     * @param {number} finishY
     *
     * @return {array} If path was found, function will return path
     *                 as an array of objects with cell coordinates,
     *                 including the start and end points.
     *                 Example: [ { x: 0, y: 0 }, { x: 0, y: 1 }, { x: 0, y: 2 }, { x: 0, y: 3 },
     *                            { x: 0, y: 4 }, { x: 1, y: 4 }, { x: 2, y: 4 }, { x: 3, y: 4 } ]
     *                 Returns null if there is no path.
     */

  }, {
    key: 'restorePath',
    value: function restorePath(finishX, finishY) {
      var _this2 = this;

      if (this.stepsMatrix[finishX][finishY] === this.UNVISITED_CELL) {
        this.resultPath = null;
        return null;
      }

      this.resultPath = [];

      var currentX = finishX;
      var currentY = finishY;

      var addStep = function addStep(x, y) {
        _this2.resultPath.push({ x: x, y: y });
      };

      addStep(finishX, finishY);

      var propagateWave = function propagateWave(newX, newY, step) {
        if (_this2.stepsMatrix[newX] !== undefined) {
          if (_this2.stepsMatrix[newX][newY] === step - 1) {
            addStep(newX, newY);
            currentX = newX;
            currentY = newY;
            if (step === 1) return true;
          }
        }
        return false;
      };

      for (var step = this.stepsMatrix[finishX][finishY]; step >= 0; step--) {
        if (propagateWave(currentX + 1, currentY, step) || propagateWave(currentX - 1, currentY, step) || propagateWave(currentX, currentY + 1, step) || propagateWave(currentX, currentY - 1, step)) {
          return this.resultPath.reverse();
        }
      }
    }
  }]);

  return WavePathFinder;
}();

module.exports = WavePathFinder;