# Approval testing with Vitest !

A collection of utilities to help with approval testing with [Vitest](https://vitest.dev/).

## Table of Contents

- [Installation](#installation)
- [Introduction](#introduction)
- [Examples](#examples)
- [License](#license)

## Installation

You can install the library using your preferred package manager:

### Using npm:

```bash
npm install @liorchamla/approval-utils
```

### Using Yarn:

```bash
yarn add @liorchamla/approval-utils
```

### Using pnpm:

```bash
pnpm add @liorchamla/approval-utils
```

## Introduction

`@liorchamla/approval-utils` is a utility library designed to simplify approval testing (also known as golden master testing) in combination with Vitest. Approval testing is a method of testing where you capture the output of your system and compare it to a previously approved version of that output. If the outputs match, the test passes; otherwise, it fails.

## Examples

Here is a simple example of how you might use these utilities in a test:

```typescript
import { spy, approveCombinations } from '@liorchamla/approval-utils'

function exampleFunction(a: number, b: number) {
    return a + b
}

// Define possible parameter values
const paramsSet = [
    [1, 2],
    [3, 4]
]

// Approve all combinations
approveCombinations('exampleFunction', exampleFunction, paramsSet)
```

In this example, `approveCombinations` will test `exampleFunction` with all combinations of `1, 2` and `3, 4` and compare the output to the approved golden master.

## License

This project is licensed under the MIT License