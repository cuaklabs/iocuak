import { FindEntityPort } from '../../port/application/FindEntityPort';
import { ReadOneEntityInteractor } from './ReadOneEntityInteractor';

interface ModelTest {
  foo: string;
}

interface QueryTest {
  fooValue: string;
}

describe(ReadOneEntityInteractor.name, () => {
  let findAdapterMock: jest.Mocked<FindEntityPort<ModelTest, QueryTest>>;
  let readOneInteractor: ReadOneEntityInteractor<ModelTest, QueryTest>;

  beforeAll(() => {
    findAdapterMock = {
      findOne: jest.fn(),
    } as Partial<
      jest.Mocked<FindEntityPort<ModelTest, QueryTest>>
    > as jest.Mocked<FindEntityPort<ModelTest, QueryTest>>;

    readOneInteractor = new ReadOneEntityInteractor(findAdapterMock);
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
