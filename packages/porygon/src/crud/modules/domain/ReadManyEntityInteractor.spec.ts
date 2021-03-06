import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';

import * as jestMock from 'jest-mock';

import { FindEntityPort } from '../../port/application/FindEntityPort';
import { ReadManyEntityInteractor } from './ReadManyEntityInteractor';

interface ModelTest {
  foo: string;
}

interface QueryTest {
  fooValue: string;
}

describe(ReadManyEntityInteractor.name, () => {
  let findAdapterMock: jestMock.Mocked<FindEntityPort<ModelTest, QueryTest>>;
  let findInteractor: ReadManyEntityInteractor<ModelTest, QueryTest>;

  beforeAll(() => {
    findAdapterMock = {
      find: jest.fn(),
    } as Partial<
      jestMock.Mocked<FindEntityPort<ModelTest, QueryTest>>
    > as jestMock.Mocked<FindEntityPort<ModelTest, QueryTest>>;

    findInteractor = new ReadManyEntityInteractor(findAdapterMock);
  });

  describe('.interact()', () => {
    describe('when called', () => {
      let queryTestFixture: QueryTest;
      let modelsTestFixture: ModelTest[];
      let result: unknown;

      beforeAll(async () => {
        queryTestFixture = {
          fooValue: 'bar',
        };

        modelsTestFixture = [
          {
            foo: 'bar',
          },
        ];

        findAdapterMock.find.mockResolvedValueOnce(modelsTestFixture);

        result = await findInteractor.interact(queryTestFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call findAdapter.find()', () => {
        expect(findAdapterMock.find).toHaveBeenCalledTimes(1);
        expect(findAdapterMock.find).toHaveBeenCalledWith(queryTestFixture);
      });

      it('should return TModel[]', () => {
        expect(result).toBe(modelsTestFixture);
      });
    });
  });
});
