import { beforeAll, describe, expect, it } from '@jest/globals';

import { isPromiseLike } from './isPromiseLike';

interface Thenable {
  then: (...args: unknown[]) => unknown;
}

function generateFunctionWithThenFunction(): Thenable {
  const functionWithThenFunction: Thenable = () => undefined;

  functionWithThenFunction.then = () => undefined;
  functionWithThenFunction.toString = () => '[Function with .then() function]';

  return functionWithThenFunction;
}

function generateObjectWithThenFunction(): Thenable {
  const objectWithThenFunction: Record<string, unknown> & Thenable = {
    then: () => undefined,
    toString: () => '[Object with .then() function]',
  };

  return objectWithThenFunction;
}

function generateObjectWithoutThenProperty(): unknown {
  const objectWithoutThenProperty: unknown = {
    toString: () => '[Object without .then property]',
  };

  return objectWithoutThenProperty;
}

function generateFunctionWithoutThenProperty(): unknown {
  const functionWithoutThenProperty: () => unknown = () => undefined;

  functionWithoutThenProperty.toString = () =>
    '[Function without .then property]';

  return functionWithoutThenProperty;
}

function generateObjectWithThenNonFunctionProperty(): unknown {
  const objectWithThenNonFunctionProperty: unknown = {
    then: false,
    toString: () => '[Object with .then() non function property]',
  };

  return objectWithThenNonFunctionProperty;
}

function generateFunctionWithThenNonFunctionProperty(): unknown {
  const functionWithThenNonFunctionProperty: { then: unknown } = () =>
    undefined;

  functionWithThenNonFunctionProperty.then = false;

  functionWithThenNonFunctionProperty.toString = () =>
    '[Function with .then non function property]';

  return functionWithThenNonFunctionProperty;
}

describe(isPromiseLike.name, () => {
  describe.each([
    [generateFunctionWithThenFunction()],
    [generateObjectWithThenFunction()],
  ])('having a thenable %s', (thenable: Thenable) => {
    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = isPromiseLike(thenable);
      });

      it('should return true', () => {
        expect(result).toBe(true);
      });
    });
  });

  describe.each([
    [undefined],
    [null],
    [true],
    [3],
    ['3'],
    generateObjectWithoutThenProperty(),
    generateFunctionWithoutThenProperty(),
    generateObjectWithThenNonFunctionProperty(),
    generateFunctionWithThenNonFunctionProperty(),
  ])('having a non thenable %s', (input: unknown) => {
    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = isPromiseLike(input);
      });

      it('should return false', () => {
        expect(result).toBe(false);
      });
    });
  });
});
