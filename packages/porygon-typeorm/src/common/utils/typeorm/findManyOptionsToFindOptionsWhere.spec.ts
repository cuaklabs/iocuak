import { FindManyOptions, FindOptionsWhere } from 'typeorm';

import { findManyOptionsToFindOptionsWhere } from './findManyOptionsToFindOptionsWhere';

interface ModelTest {
  foo: string;
}

describe(findManyOptionsToFindOptionsWhere.name, () => {
  describe('having a FindManyOptions with no where property', () => {
    let findManyOptionsFixture: FindManyOptions<ModelTest>;

    beforeAll(() => {
      findManyOptionsFixture = {};
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = findManyOptionsToFindOptionsWhere(findManyOptionsFixture);
      });

      it('should return default FindOptionsWhere', () => {
        expect(result).toStrictEqual({});
      });
    });
  });

  describe('having a FindManyOptions with where property with FindOptionsWhere', () => {
    let findOptionsWhereFixture: FindOptionsWhere<ModelTest>;
    let findManyOptionsFixture: FindManyOptions<ModelTest>;

    beforeAll(() => {
      findOptionsWhereFixture = {
        foo: 'foo value',
      };
      findManyOptionsFixture = {
        where: findOptionsWhereFixture,
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = findManyOptionsToFindOptionsWhere(findManyOptionsFixture);
      });

      it('should return FindOptionsWhere', () => {
        expect(result).toStrictEqual(findOptionsWhereFixture);
      });
    });
  });

  describe('having a FindManyOptions with where property with an array with one element', () => {
    let findOptionsWhereFixture: FindOptionsWhere<ModelTest>;
    let findManyOptionsFixture: FindManyOptions<ModelTest>;

    beforeAll(() => {
      findOptionsWhereFixture = {
        foo: 'foo value',
      };
      findManyOptionsFixture = {
        where: [findOptionsWhereFixture],
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        result = findManyOptionsToFindOptionsWhere(findManyOptionsFixture);
      });

      it('should return FindOptionsWhere', () => {
        expect(result).toStrictEqual(findOptionsWhereFixture);
      });
    });
  });

  describe('having a FindManyOptions with where property with an array with not one element', () => {
    let findManyOptionsFixture: FindManyOptions<ModelTest>;

    beforeAll(() => {
      findManyOptionsFixture = {
        where: [],
      };
    });

    describe('when called', () => {
      let result: unknown;

      beforeAll(() => {
        try {
          findManyOptionsToFindOptionsWhere(findManyOptionsFixture);
        } catch (error: unknown) {
          result = error;
        }
      });

      it('should throw an Error', () => {
        expect(result).toBeInstanceOf(Error);
        expect(result).toStrictEqual(
          expect.objectContaining<Partial<Error>>({
            message:
              'Unexpected multiple FindOptionsWhere inside FindManyOptions: operation not allowed',
          }),
        );
      });
    });
  });
});
