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

  for (let row = 0; row < matrix.length; row++) {
    for (let col = 0; col < matrix[row].length; col++) {
      const step = parseInt(matrix[row][col], 10);

      if (!isNaN(step)) {
        steps.push({ row, col, step });
      } else if (matrix[row][col] === 'A') {
        start = { row, col };
      } else if (matrix[row][col] === 'B') {
        finish = { row, col };
      }

      matrix[row][col] = (matrix[row][col] === 'x') ? 0 : 1;
    }
  }

  if (steps.length === 0) {
    steps = null;
  } else {
    steps.push({ row: start.row, col: start.col, step: 0 });
    steps.push({ row: finish.row, col: finish.col, step: steps.length });
    steps = steps.sort((a, b) => a.step - b.step).map(step => ([ step.row, step.col ]));
  }

  return {
    matrix,
    startRow: start.row,
    startCol: start.col,
    finishRow: finish.row,
    finishCol: finish.col,
    resultPath: steps,
  };
};

describe('WavePathfinder', () => {
  describe('constructor', () => {
    it('throws exception when passabilityMatrix argument is not an array', () => {
      (() => {
        new WavePathfinder('bla-bla-bla');
      }).should.throw(Error);
    });

    it('makes a copy of passed passabilityMatrix argument', () => {
      const { matrix } = mapOptions(`|A| |x| | |
                                     | | |x| | |
                                     | | |x| | |
                                     | | |x|B| |`);

      const finder = new WavePathfinder(matrix);

      assert.deepEqual(finder.passabilityMatrix, [[1, 1, 0, 1, 1],
                                                [1, 1, 0, 1, 1],
                                                [1, 1, 0, 1, 1],
                                                [1, 1, 0, 1, 1]]);
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
        const { matrix, resultPath, startRow, startCol, finishRow, finishCol } = mapOptions(test.map);

        const path = WavePathfinder.findPath(matrix, startRow, startCol, finishRow, finishCol);

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
