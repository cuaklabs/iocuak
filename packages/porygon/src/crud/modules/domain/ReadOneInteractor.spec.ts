import { FindAdapter } from '../../adapter/domain/FindAdapter';
import { ReadOneInteractor } from './ReadOneInteractor';

interface ModelTest {
  foo: string;
}

interface QueryTest {
  fooValue: string;
}

describe(ReadOneInteractor.name, () => {
  let findAdapterMock: jest.Mocked<FindAdapter<ModelTest, QueryTest>>;
  let readOneInteractor: ReadOneInteractor<ModelTest, QueryTest>;

  beforeAll(() => {
    findAdapterMock = {
      findOne: jest.fn(),
    } as Partial<jest.Mocked<FindAdapter<ModelTest, QueryTest>>> as jest.Mocked<
      FindAdapter<ModelTest, QueryTest>
    >;

    readOneInteractor = new ReadOneInteractor(findAdapterMock);
  });

  describe('.interact()', () => {
    describe('when called', () => {
      let queryTestFixture: QueryTest;
      let modelTestFixture: ModelTest;
      let result: unknown;

      beforeAll(async () => {
        queryTestFixture = {
          fooValue: 'bar',
        };

        modelTestFixture = {
          foo: 'bar',
        };

        findAdapterMock.findOne.mockResolvedValueOnce(modelTestFixture);

        result = await readOneInteractor.interact(queryTestFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call findAdapter.findOne()', () => {
        expect(findAdapterMock.findOne).toHaveBeenCalledTimes(1);
        expect(findAdapterMock.findOne).toHaveBeenCalledWith(queryTestFixture);
      });

      it('should return TModel or undefined', () => {
        expect(result).toBe(modelTestFixture);
      });
    });
  });
});
