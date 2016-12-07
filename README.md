Wave Pathfinder
===============

Pathfinding for 2-dimensional matrix (rows, cols) using [Lee algorithm](https://en.wikipedia.org/wiki/Lee_algorithm), also known as wave pathfinding.  

[![Code Climate](https://codeclimate.com/github/zharikovpro/wave-pathfinder/badges/gpa.svg)](https://codeclimate.com/github/zharikovpro/wave-pathfinder) [![Test Coverage](https://codeclimate.com/github/zharikovpro/wave-pathfinder/badges/coverage.svg)](https://codeclimate.com/github/zharikovpro/wave-pathfinder/coverage)

Advantages of wave algorithm:
-----------------------------

* Very simple, easy to understand and implement
* Ability to quickly get matrix of all reachable cells with number of steps required
* Once steps matrix has been calculated for start cell, it's very fast to find path to any reachable cell 

Installation:
-------------

```
$ npm install wave-pathfinder
```

Quick example:
--------------

```
var WavePathfinder = require('wave-pathfinder');

// use "truthy" values for passable cells 
// use "falsy" values for non-passable cells 
var passabilityMatrix = [
  [ 1, 1, 1 ],
  [ 0, 0, 1 ],
  [ 1, 0, 1 ]
];

var startRow = 0;
var startCol = 0;

var finishRow = 2;
var finishCol = 2;

var path = WavePathfinder.findPath(passabilityMatrix, startRow, startCol, finishRow, finishCol);
console.log(path); 

/* [ 
  { 0, 0 },
  { 0, 1 },
  { 0, 2 },
  { 1, 2 },
  { 2, 2 } 
] */
```

Advanced usage:
---------------

If you want to get access to the steps matrix and/or find multiple paths from one starting point, it's useful to instantiate pathfinder object and work with it.

1) Create pathfinder object using passability matrix:

```
var WavePathfinder = require('wave-pathfinder');

// use "truthy" values for passable cells 
// use "falsy" values for non-passable cells 
var passabilityMatrix = [
  [ 1, 1, 1 ],
  [ 0, 0, 1 ],
  [ 1, 0, 1 ]
];

var pathfinder = new WavePathfinder(passabilityMatrix);
```

2) Call "expandWave" to calculate possible steps matrix for given start cell. There's no need to call expandWave again after that, if start cell remains the same.

```
var startRow = 0;
var startCol = 0;

var stepsMatrix = pathfinder.expandWave(startRow, startCol);
console.log(stepsMatrix); 
console.log(pathfinder.stepsMatrix); // same as above 

/* 0: start cell 
   n: minimum number of steps
  -1: unreachable cell

[ 
  [  0,  1, 2 ], 
  [ -1, -1, 3 ], 
  [ -1, -1, 4 ] 
] */
```

3) Call "backtracePath" to get path from start (which was setup during previous expandWave call) to given finish.

```
var finishRow1 = 2;
var finishCol1 = 2;

var path1 = pathfinder.backtracePath(finishRow1, finishCol1);
console.log(path1); 

/* [ 
  { 0, 0 },
  { 0, 1 },
  { 0, 2 },
  { 1, 2 },
  { 2, 2 } 
] */

var finishRow2 = 1;
var finishCol2 = 1;

var path2 = pathfinder.backtracePath(finishCol2, finishCol2);
console.log(path2);
 
/* [ 
  { 0, 0 },
  { 0, 1 },
  { 0, 2 }
] */
```

4) Or, call shorthand "findPath" which will call expandWave and backtracePath under the hood.

```
var startRow = 0;
var startCol = 0;

var finishRow = 1;
var finishCol = 1;

var path = pathfinder.findPath(startRow, startCol, finishRow, finishCol);
console.log(path);

/* [ 
  { 0, 0 },
  { 0, 1 },
  { 0, 2 }
] */

var stepsMatrix = pathfinder.stepsMatrix;
console.log(stepsMatrix); 

/* 0: start cell 
   n: minimum number of steps
  -1: unreachable cell

[ 
  [  0,  1, 2 ], 
  [ -1, -1, 3 ], 
  [ -1, -1, 4 ] 
] */
```
