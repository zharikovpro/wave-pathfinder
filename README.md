Wave Pathfinder
===============

Pathfinding for 2-dimensional matrix (x, y) using [Lee algorithm](https://en.wikipedia.org/wiki/Lee_algorithm), also known as wave pathfinding.  

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

var startX = 0;
var startY = 0;

var finishX = 2;
var finishY = 2;

var path = WavePathfinder.findPath(passabilityMatrix, startX, startY, finishX, finishY);
console.log(path); 

/* [ 
  { x: 0, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: 2 },
  { x: 1, y: 2 },
  { x: 2, y: 2 } 
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
var startX = 0;
var startY = 0;

var stepsMatrix = pathfinder.expandWave(startX, startY);
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
var finishX1 = 2;
var finishY1 = 2;

var path1 = pathfinder.backtracePath(finishX1, finishY1);
console.log(path1); 

/* [ 
  { x: 0, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: 2 },
  { x: 1, y: 2 },
  { x: 2, y: 2 } 
] */

var finishX2 = 1;
var finishY2 = 1;

var path2 = pathfinder.backtracePath(finishY2, finishY2);
console.log(path2);
 
/* [ 
  { x: 0, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: 2 }
] */
```

4) Or, call shorthand "findPath" which will call expandWave and backtracePath under the hood.

```
var startX = 0;
var startY = 0;

var finishX = 1;
var finishY = 1;

var path = pathfinder.findPath(startX, startY, finishX, finishY);
console.log(path);

/* [ 
  { x: 0, y: 0 },
  { x: 0, y: 1 },
  { x: 0, y: 2 }
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
