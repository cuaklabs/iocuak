import { TaskKindType } from '../models/domain/TaskKindType';
import { isTaskKind } from './isTaskKind';

describe(isTaskKind.name, () => {
  describe('having a value with no type', () => {
    let valueFixture: unknown;

    beforeAll(() => {
      valueFixture = {};
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = isTaskKind(valueFixture);
      });

      it('should return false', () => {
        expect(result).toBe(false);
      });
    });
  });

  describe('having a value with type in TaskKindType', () => {
    let valueFixture: unknown;

    beforeAll(() => {
      valueFixture = {
        type: TaskKindType.createInstance,
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = isTaskKind(valueFixture);
      });

      it('should return true', () => {
        expect(result).toBe(true);
      });
    });
  });

  describe('having a value with type not in TaskKindType', () => {
    let valueFixture: unknown;

    beforeAll(() => {
      valueFixture = {
        type: {},
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = isTaskKind(valueFixture);
      });

      it('should return false', () => {
        expect(result).toBe(false);
      });
    });
  });
});
