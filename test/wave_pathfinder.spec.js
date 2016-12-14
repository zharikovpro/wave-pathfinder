import chai from 'chai'; // eslint-disable-line import/no-extraneous-dependencies

const { assert } = chai;
const WavePathfinder = require('../src/wave_pathfinder');

chai.should();

// helper function to generate test cases from ASCII maps
const mapOptions = (drawing) => {
  let start = {};
  let finish = {};
  let steps = [];

  let matrix = drawing.replace(/ /g, '').split('\n');
  matrix = matrix.map(line => line.substr(1, (line.length - 2)).split('|'));

  for (let x = 0; x < matrix.length; x++) {
    for (let y = 0; y < matrix[x].length; y++) {
      const step = parseInt(matrix[x][y], 10);

      if (!isNaN(step)) {
        steps.push({ x, y, step });
      } else if (matrix[x][y] === 'A') {
        start = { x, y };
      } else if (matrix[x][y] === 'B') {
        finish = { x, y };
      }

      matrix[x][y] = matrix[x][y] === 'x';
    }
  }

  if (steps.length === 0) {
    steps = null;
  } else {
    steps.push({ x: start.x, y: start.y, step: 0 });
    steps.push({ x: finish.x, y: finish.y, step: steps.length });
    steps = steps.sort((a, b) => a.step - b.step).map(step => ([ step.y, step.x ]));
  }

  return {
    matrix,
    startX: start.x,
    startY: start.y,
    finishX: finish.x,
    finishY: finish.y,
    resultPath: steps,
  };
};

describe('WavePathfinder', () => {
  describe('constructor', () => {
    it('throws exception when obstaclesMatrix argument is not an array', () => {
      (() => {
        new WavePathfinder('bla-bla-bla');
      }).should.throw(Error);
    });

    it('makes a copy of passed obstaclesMatrix argument', () => {
      const { matrix } = mapOptions(`|A| |x| | |
                                     | | |x| | |
                                     | | |x| | |
                                     | | |x|B| |`);

      const finder = new WavePathfinder(matrix);

      assert.deepEqual(finder.obstaclesMatrix, [[false, false, true, false, false],
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
        const { matrix, resultPath, startX, startY, finishX, finishY } = mapOptions(test.map);

        const path = WavePathfinder.findPath(matrix, startX, startY, finishX, finishY);

        assert.deepEqual(path, resultPath);
      });
    }); // forEach
  }); // describe - findPath

  describe('backtracePath', () => {
    it('throws exception if expandWave was not called before', () => {
      (() => {
        const finder = new WavePathfinder([ [0, 1], [1, 0] ]);
        finder.backtracePath(1, 1);
      }).should.throw(Error);
    });
  });
}); // describe - WavePathfinder
