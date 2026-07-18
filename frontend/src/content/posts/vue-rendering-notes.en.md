# Three entry points into Vue's renderer

Large framework codebases are not best understood from top to bottom. To explore Vue's renderer, start with three connected perspectives.

## What a VNode describes

A VNode is more than an abstraction of the DOM. It carries node type, child shape, and optimization hints from compilation, acting as a protocol between compiler and runtime.

## How patch narrows the problem

The patch operation chooses the smallest update path from the relationship between old and new nodes. Follow the element, component, and Fragment branches before exploring specialized optimizations.

## Why flags matter

shapeFlag describes the broad node category, while patchFlag describes dynamic content. The first speeds up runtime dispatch; the second lets compiler knowledge guide updates.

Following a call chain with a concrete question is more effective than memorizing every function.
