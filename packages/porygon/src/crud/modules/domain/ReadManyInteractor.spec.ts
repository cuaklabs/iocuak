import { FindAdapter } from '../../adapter/domain/FindAdapter';
import { ReadManyInteractor } from './ReadManyInteractor';

interface ModelTest {
  foo: string;
}

interface QueryTest {
  fooValue: string;
}

describe(ReadManyInteractor.name, () => {
  let findAdapterMock: jest.Mocked<FindAdapter<ModelTest, QueryTest>>;
  let findInteractor: ReadManyInteractor<ModelTest, QueryTest>;

  beforeAll(() => {
    findAdapterMock = {
      find: jest.fn(),
    } as Partial<jest.Mocked<FindAdapter<ModelTest, QueryTest>>> as jest.Mocked<
      FindAdapter<ModelTest, QueryTest>
    >;

    findInteractor = new ReadManyInteractor(findAdapterMock);
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
