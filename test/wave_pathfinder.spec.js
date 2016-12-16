import chai from 'chai'; // eslint-disable-line import/no-extraneous-dependencies
import fs from 'fs';

const { assert } = chai;
const WavePathfinder = require('../src/wave_pathfinder');

chai.should();

const readMap = (path) => fs.readFileSync(path, 'utf8').trim();

// helper function to generate test cases from ASCII maps
const loadMap = (drawing) => {
  let startY = null;
  let startX = null;
  let finishY = null;
  let finishX = null;
  let steps = [];

  let matrix = drawing.replace(/ /g, '').split('\n');
  matrix = matrix.map(line => line.substr(1, (line.length - 2)).split('|'));

  for (let y = 0; y < matrix.length; y++) {
    for (let x = 0; x < matrix[y].length; x++) {
      const step = parseInt(matrix[y][x], 10);

      if (!isNaN(step)) {
        steps.push({ y, x, step });
      } else if (matrix[y][x] === 'A') {
        startY = y;
        startX = x;
      } else if (matrix[y][x] === 'B') {
        finishY = y;
        finishX = x;
      }

      matrix[y][x] = matrix[y][x] === 'x';
    }
  }

  if (steps.length === 0) {
    steps = null;
  } else {
    steps.push({ y: startY, x: startX, step: 0 });
    steps.push({ y: finishY, x: finishX, step: steps.length });
    steps = steps.sort((a, b) => a.step - b.step).map(step => ([step.y, step.x]));
  }

  return { matrix, startY, startX, finishY, finishX, steps };
};

describe('loadMap helper function', () => {
  it('loads completely empty map', () => {
    const map = loadMap(readMap('test/maps/load/empty.txt'));

    assert.isNull(map.steps);
    assert.isNull(map.startY);
    assert.isNull(map.startX);
    assert.isNull(map.finishY);
    assert.isNull(map.finishX);
    assert.deepEqual(map.matrix, [[false, false, false, false, false],
                                  [false, false, false, false, false],
                                  [false, false, false, false, false]]);
  });

  it('loads completely occupied map', () => {
    const map = loadMap(readMap('test/maps/load/full.txt'));

    assert.isNull(map.startY);
    assert.isNull(map.startX);
    assert.isNull(map.finishY);
    assert.isNull(map.finishX);
    assert.isNull(map.steps);

    assert.deepEqual(map.matrix, [[true, true, true, true, true],
                                  [true, true, true, true, true],
                                  [true, true, true, true, true]]);
  });

  it('loads impassable map', () => {
    const map = loadMap(readMap('test/maps/load/impassable.txt'));

    assert.equal(map.startY, 0);
    assert.equal(map.startX, 0);
    assert.equal(map.finishY, 2);
    assert.equal(map.finishX, 4);
    assert.isNull(map.steps);

    assert.deepEqual(map.matrix, [[false, false, true, false, false],
                                  [false, false, true, false, false],
                                  [false, false, true, false, false]]);
  });

  it('detects path on passable map', () => {
    const map = loadMap(readMap('test/maps/load/passable.txt'));

    assert.equal(map.startY, 0);
    assert.equal(map.startX, 0);
    assert.equal(map.finishY, 2);
    assert.equal(map.finishX, 4);

    assert.deepEqual(map.matrix, [[false, false, false, false, false],
                                  [false, false, false, false, false],
                                  [false, false, false, false, false]]);

    assert.deepEqual(map.steps, [[0, 0],
                                 [0, 1],
                                 [0, 2],
                                 [0, 3],
                                 [0, 4],
                                 [1, 4],
                                 [2, 4]]);
  });
});

describe('WavePathfinder', () => {
  describe('constructor', () => {
    it('throws exception when obstaclesMatrix argument is not an array', () => {
      (() => {
        new WavePathfinder('bla-bla-bla'); // eslint-disable-line no-new
      }).should.throw(Error);
    });

    it('makes a copy of passed obstaclesMatrix argument', () => {
      const { matrix } = loadMap(readMap('test/maps/load/impassable.txt'));

      const finder = new WavePathfinder(matrix);

      assert.deepEqual(finder.obstaclesMatrix, matrix);
    });
  });

  describe('findPath', () => {
    const tests = [{
      name: 'returns null when there is no path',
      map: 'test/maps/impassable/wall-vertical.txt',
    }, {
      name: 'returns path from left to right',
      map: 'test/maps/passable/top-left-to-bottom-right.txt',
    }, {
      name: 'returns path from right to left',
      map: 'test/maps/passable/bottom-right-to-top-left.txt',
    }];

    tests.forEach((test) => {
      it(test.name, () => {
        const { matrix, steps, startY, startX, finishY, finishX } = loadMap(readMap(test.map));

        const path = WavePathfinder.findPath(matrix, startY, startX, finishY, finishX);

        assert.deepEqual(path, steps);
      });
    }); // forEach
  }); // describe - findPath

  describe('backtracePath', () => {
    it('throws exception if expandWave was not called before', () => {
      (() => {
        const finder = new WavePathfinder([[0, 1], [1, 0]]);
        finder.backtracePath(1, 1);
      }).should.throw(Error);
    });
  });
}); // describe - WavePathfinder
