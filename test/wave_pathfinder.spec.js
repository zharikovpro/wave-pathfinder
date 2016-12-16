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

  // TODO: swap y and x, as in class itself rows should be first
  for (let x = 0; x < matrix.length; x++) {
    for (let y = 0; y < matrix[x].length; y++) {
      const step = parseInt(matrix[x][y], 10);

      if (!isNaN(step)) {
        steps.push({ x, y, step });
      } else if (matrix[x][y] === 'A') {
        startX = x;
        startY = y;
      } else if (matrix[x][y] === 'B') {
        finishX = x;
        finishY = y;
      }

      matrix[x][y] = matrix[x][y] === 'x';
    }
  }

  if (steps.length === 0) {
    steps = null;
  } else {
    steps.push({ x: startX, y: startY, step: 0 });
    steps.push({ x: finishX, y: finishY, step: steps.length });
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

    assert.isNull(map.steps);
    assert.isNull(map.startY);
    assert.isNull(map.startX);
    assert.isNull(map.finishY);
    assert.isNull(map.finishX);
    assert.deepEqual(map.matrix, [[true, true, true, true, true],
                                  [true, true, true, true, true],
                                  [true, true, true, true, true]]);
  });

  it('loads impassable map', () => {
      const map = loadMap(readMap('test/maps/load/impassable.txt'));

      assert.isNull(map.steps);
      assert.equal(map.startY, 0);
      assert.equal(map.startX, 0);
      assert.equal(map.finishY, 2);
      assert.equal(map.finishX, 4);
      assert.deepEqual(map.matrix, [[false, false, true, false, false],
                                    [false, false, true, false, false],
                                    [false, false, true, false, false]]);
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

      assert.deepEqual(finder.obstaclesMatrix, [[false, false, true, false, false],
                                                [false, false, true, false, false],
                                                [false, false, true, false, false],
                                                [false, false, true, false, false],
                                                [false, false, true, false, false]]);
    });
  });

  describe('findPath', () => {
    const tests = [{
      name: 'returns null when there is no path',
      map: `|A| |x| | |
            | | |x| | |
            | | |x| | |
            | | |x|B| |`,
    }, {
      name: 'returns path from left to right',
      map: `|A|1|2|3|4|
            |x|x|x|x|5|
            |x| | |x|6|
            | | | |x|B|`,
    }, {
      name: 'returns path from right to left',
      map: `|B|6|x| | |
            |x|5|4|x| |
            | |x|3|2|x|
            | | |x|1|A|`,
    }];

    tests.forEach((test) => {
      it(test.name, () => {
        const { matrix, steps, startX, startY, finishX, finishY } = loadMap(test.map);

        const path = WavePathfinder.findPath(matrix, startX, startY, finishX, finishY);

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
