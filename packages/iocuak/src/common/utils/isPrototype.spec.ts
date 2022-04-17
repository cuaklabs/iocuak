import { isPrototype } from './isPrototype';

describe(isPrototype.name, () => {
  describe('having a prototype', () => {
    let valueFixture: unknown;

    beforeAll(() => {
      valueFixture = class {}.prototype;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = isPrototype(valueFixture);
      });

      it('should return true', () => {
        expect(result).toBe(true);
      });
    });
  });

  describe('having anything else', () => {
    let valueFixture: unknown;

    beforeAll(() => {
      valueFixture = 3;
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = isPrototype(valueFixture);
      });

      it('should return false', () => {
        expect(result).toBe(false);
      });
    });
  });
});
