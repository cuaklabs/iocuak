import { ReadOnlyLinkedListImplementation } from './ReadOnlyLinkedListImplementation';

describe(ReadOnlyLinkedListImplementation.name, () => {
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
