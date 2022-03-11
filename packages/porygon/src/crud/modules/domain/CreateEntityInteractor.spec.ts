import { CreateAdapter } from '../../adapter/domain/CreateAdapter';
import { CreateEntityInteractor } from './CreateEntityInteractor';

interface ModelTest {
  foo: unknown;
}

interface QueryTest {
  bar: unknown;
}

describe(CreateEntityInteractor.name, () => {
  let createAdapterMock: jest.Mocked<CreateAdapter<ModelTest, QueryTest>>;
  let insertOneManager: CreateEntityInteractor<ModelTest, QueryTest>;

  beforeAll(() => {
    createAdapterMock = {
      insertOne: jest.fn(),
    } as Partial<
      jest.Mocked<CreateAdapter<ModelTest, QueryTest>>
    > as jest.Mocked<CreateAdapter<ModelTest, QueryTest>>;

    insertOneManager = new CreateEntityInteractor(createAdapterMock);
  });

  describe('.interact()', () => {
    describe('when called', () => {
      let modelFixture: ModelTest;
      let queryFixture: QueryTest;
      let result: unknown;

      beforeAll(async () => {
        modelFixture = {
          foo: 'sample',
        };

        queryFixture = {
          bar: 'sample-string',
        };

        createAdapterMock.insertOne.mockResolvedValueOnce(modelFixture);
        result = await insertOneManager.interact(queryFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call insertAdapter.insertOne()', () => {
        expect(createAdapterMock.insertOne).toHaveBeenCalledTimes(1);
        expect(createAdapterMock.insertOne).toHaveBeenCalledWith(queryFixture);
      });

      it('should return a ModelTest', () => {
        expect(result).toBe(modelFixture);
      });
    });
  });
});
