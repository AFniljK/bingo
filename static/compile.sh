#!/bin/bash
tsc ./login/*.ts
tsc ./play/*.ts
tsc ./lobby/*.ts

browserify ./play/play.js > ./play/play.js.bak
mv ./play/play.js.bak ./play/play.js
browserify ./lobby/lobby.js > ./lobby/lobby.js.bak
mv ./lobby/lobby.js.bak ./lobby/lobby.js