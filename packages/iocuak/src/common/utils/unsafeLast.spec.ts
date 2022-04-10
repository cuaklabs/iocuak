import { unsafeLast } from './unsafeLast';

describe(unsafeLast.name, () => {
  describe('having an empty array', () => {
    let arrayFixture: number[];

    beforeAll(() => {
      arrayFixture = [];
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = unsafeLast(arrayFixture);
      });

      it('should return undefined', () => {
        expect(result).toBeUndefined();
      });
    });
  });

  describe('having a non empty array', () => {
    let lastArrayElementFixture: number;
    let arrayFixture: number[];

    beforeAll(() => {
      lastArrayElementFixture = 2;
      arrayFixture = [lastArrayElementFixture];
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = unsafeLast(arrayFixture);
      });

      it('should return last element', () => {
        expect(result).toBe(lastArrayElementFixture);
      });
    });
  });
});
