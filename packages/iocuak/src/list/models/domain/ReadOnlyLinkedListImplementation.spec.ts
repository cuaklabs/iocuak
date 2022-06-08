import { ReadOnlyLinkedListImplementation } from './ReadOnlyLinkedListImplementation';

describe(ReadOnlyLinkedListImplementation.name, () => {
  describe('.[Symbol.iterator]', () => {
    describe('having a ReadOnlyLinkedListImplementation with two nodes', () => {
      let elementArrayFixture: unknown[];
      let readOnlyLinkedListImplementation: ReadOnlyLinkedListImplementation<unknown>;

      beforeAll(() => {
        elementArrayFixture = [Symbol(), Symbol()];
        readOnlyLinkedListImplementation =
          ReadOnlyLinkedListImplementation.build(elementArrayFixture);
      });

      describe('when spreaded into an array', () => {
        let result: unknown;

        beforeAll(() => {
          result = [...readOnlyLinkedListImplementation];
        });

        it('should result in an array with node elements', () => {
          expect(result).toStrictEqual(elementArrayFixture);
        });
      });
    });
  });

  describe('.concat', () => {
    describe('having a ReadOnlyLinkedListImplementation with two nodes', () => {
      let elementArrayFixture: unknown[];
      let readOnlyLinkedListImplementation: ReadOnlyLinkedListImplementation<unknown>;

      beforeAll(() => {
        elementArrayFixture = [Symbol(), Symbol()];
        readOnlyLinkedListImplementation =
          ReadOnlyLinkedListImplementation.build(elementArrayFixture);
      });

      describe('when called, and spreaded into an array', () => {
        let newElement: unknown;

        let result: unknown;

        beforeAll(() => {
          newElement = Symbol();

          result = [...readOnlyLinkedListImplementation.concat(newElement)];
        });

        it('should result in an array with node elements', () => {
          expect(result).toStrictEqual([...elementArrayFixture, newElement]);
        });
      });
    });
  });

  describe('.includes', () => {
    describe('having a ReadOnlyLinkedListImplementation with no nodes', () => {
      let readOnlyLinkedListImplementation: ReadOnlyLinkedListImplementation<unknown>;

      beforeAll(() => {
        readOnlyLinkedListImplementation =
          ReadOnlyLinkedListImplementation.build();
      });

      describe('when called', () => {
        let compareFnMock: jest.Mock<boolean, [unknown]>;
        let result: unknown;

        beforeAll(() => {
          compareFnMock = jest.fn<boolean, [unknown]>().mockReturnValue(true);

          result = readOnlyLinkedListImplementation.includes(compareFnMock);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should not call compareFn()', () => {
          expect(compareFnMock).not.toHaveBeenCalled();
        });

        it('should return false', () => {
          expect(result).toBe(false);
        });
      });
    });

    describe('having a ReadOnlyLinkedListImplementation with two nodes', () => {
      let readOnlyLinkedListImplementation: ReadOnlyLinkedListImplementation<unknown>;

      beforeAll(() => {
        readOnlyLinkedListImplementation =
          ReadOnlyLinkedListImplementation.build([Symbol(), Symbol()]);
      });

      describe('when called, and compareFn returns true', () => {
        let compareFnMock: jest.Mock<boolean, [unknown]>;
        let result: unknown;

        beforeAll(() => {
          compareFnMock = jest.fn<boolean, [unknown]>().mockReturnValue(true);

          result = readOnlyLinkedListImplementation.includes(compareFnMock);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call compareFn() once', () => {
          expect(compareFnMock).toHaveBeenCalledTimes(1);
        });

        it('should return true', () => {
          expect(result).toBe(true);
        });
      });

      describe('when called, and compareFn returns false', () => {
        let compareFnMock: jest.Mock<boolean, [unknown]>;
        let result: unknown;

        beforeAll(() => {
          compareFnMock = jest.fn<boolean, [unknown]>().mockReturnValue(false);

          result = readOnlyLinkedListImplementation.includes(compareFnMock);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call compareFn() twice', () => {
          expect(compareFnMock).toHaveBeenCalledTimes(2);
        });

        it('should return false', () => {
          expect(result).toBe(false);
        });
      });
    });
  });
});
