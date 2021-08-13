import { NonThenableProperties } from '../../../common/models/NonThenableProperties';
import { BaseTask } from './BaseTask';

class BaseTaskMock<TKind, TArgs extends unknown[], TReturn> extends BaseTask<
  TKind,
  TArgs,
  TReturn
> {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  #innerPerformMock: jest.Mock<TReturn, NonThenableProperties<TArgs>>;

  constructor(
    kind: TKind,
    innerPerformMock: jest.Mock<TReturn, NonThenableProperties<TArgs>>,
  ) {
    super(kind);

    this.#innerPerformMock = innerPerformMock;
  }

  protected innerPerform(...args: NonThenableProperties<TArgs>): TReturn {
    return this.#innerPerformMock(...args);
  }
}

describe(BaseTask.name, () => {
  let kindFixture: string;
  let innerPerformMock: jest.Mock<unknown, NonThenableProperties<[]>>;

  beforeAll(() => {
    kindFixture = 'kind';
    innerPerformMock = jest.fn<unknown, []>();
  });

  describe('.perform()', () => {
    describe('when called, and innerPerform returns a syncronous result', () => {
      let baseTask: BaseTaskMock<string, [], unknown>;

      let innerPerformResultFixture: unknown;
      let result: unknown;

      beforeAll(() => {
        baseTask = new BaseTaskMock(kindFixture, innerPerformMock);

        innerPerformResultFixture = {
          foo: 'bar',
        };
        innerPerformMock.mockReturnValueOnce(innerPerformResultFixture);

        result = baseTask.perform();
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call innerPerformMock', () => {
        expect(innerPerformMock).toHaveBeenCalledTimes(1);
        expect(innerPerformMock).toHaveBeenCalledWith();
      });

      it('should return a syncronous result', () => {
        expect(result).toBe(innerPerformResultFixture);
      });
    });

    describe('when called, and innerPerform returns a promise result', () => {
      let baseTask: BaseTaskMock<string, [], Promise<unknown>>;

      let innerPerformResultFixture: unknown;
      let result: unknown;

      beforeAll(async () => {
        baseTask = new BaseTaskMock(
          kindFixture,
          innerPerformMock as jest.Mock<Promise<unknown>, []>,
        );

        innerPerformResultFixture = {
          foo: 'bar',
        };

        (
          innerPerformMock as jest.Mock<Promise<unknown>, []>
        ).mockResolvedValueOnce(innerPerformResultFixture);

        result = await baseTask.perform();
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call innerPerformMock', () => {
        expect(innerPerformMock).toHaveBeenCalledTimes(1);
        expect(innerPerformMock).toHaveBeenCalledWith();
      });

      it('should return an asyncronous result', () => {
        expect(result).toStrictEqual(innerPerformResultFixture);
      });
    });
  });
});
