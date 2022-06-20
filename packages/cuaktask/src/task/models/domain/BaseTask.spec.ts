import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import * as jestMock from 'jest-mock';

import { NonThenableProperties } from '../../../common/models/NonThenableProperties';
import { BaseTask } from './BaseTask';
import { TaskStatus } from './TaskStatus';

class BaseTaskMock<TKind, TArgs extends unknown[], TReturn> extends BaseTask<
  TKind,
  TArgs,
  TReturn
> {
  #innerPerformMock: jestMock.Mock<
    (...params: NonThenableProperties<TArgs>) => TReturn
  >;

  constructor(
    kind: TKind,
    innerPerformMock: jestMock.Mock<
      (...params: NonThenableProperties<TArgs>) => TReturn
    >,
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
  let innerPerformMock: jestMock.Mock<() => unknown>;

  beforeAll(() => {
    kindFixture = 'kind';
    innerPerformMock = jest.fn<() => unknown>();
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

      describe('when called .result', () => {
        let result: unknown;

        beforeAll(() => {
          result = baseTask.result;
        });

        it('should return a syncronous result', () => {
          expect(result).toBe(innerPerformResultFixture);
        });
      });

      describe('when called .status', () => {
        let result: unknown;

        beforeAll(() => {
          result = baseTask.status;
        });

        it('should return the ended status', () => {
          expect(result).toBe(TaskStatus.Ended);
        });
      });
    });

    describe('when called, and innerPerform throws an Error', () => {
      let baseTask: BaseTaskMock<string, [], unknown>;
      let errorFixture: unknown;

      let result: unknown;

      beforeAll(() => {
        baseTask = new BaseTaskMock(kindFixture, innerPerformMock);

        errorFixture = new Error();
        innerPerformMock.mockImplementationOnce(() => {
          throw errorFixture;
        });

        try {
          baseTask.perform();
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call innerPerformMock', () => {
        expect(innerPerformMock).toHaveBeenCalledTimes(1);
        expect(innerPerformMock).toHaveBeenCalledWith();
      });

      it('should return throw an error', () => {
        expect(result).toBe(errorFixture);
      });

      describe('when called .result', () => {
        let result: unknown;

        beforeAll(() => {
          result = baseTask.result;
        });

        it('should return undefined', () => {
          expect(result).toBeUndefined();
        });
      });

      describe('when called .status', () => {
        let result: unknown;

        beforeAll(() => {
          result = baseTask.status;
        });

        it('should return the error status', () => {
          expect(result).toBe(TaskStatus.Error);
        });
      });
    });

    describe('when called, and innerPerform returns a promise result', () => {
      let baseTask: BaseTaskMock<string, [], Promise<unknown>>;

      let innerPerformResultFixture: unknown;
      let taskResultBeforeTaskPerformIsResolved: unknown;
      let result: unknown;

      beforeAll(async () => {
        baseTask = new BaseTaskMock(
          kindFixture,
          innerPerformMock as jestMock.Mock<() => Promise<unknown>>,
        );

        innerPerformResultFixture = {
          foo: 'bar',
        };

        (
          innerPerformMock as jest.Mock<Promise<unknown>, []>
        ).mockResolvedValueOnce(innerPerformResultFixture);

        const taskPerformResult: Promise<unknown> = baseTask.perform();

        taskResultBeforeTaskPerformIsResolved = baseTask.result;

        result = await taskPerformResult;
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call innerPerformMock', () => {
        expect(innerPerformMock).toHaveBeenCalledTimes(1);
        expect(innerPerformMock).toHaveBeenCalledWith();
      });

      it('should return a result before task.perform() result is resolved', async () => {
        await expect(
          taskResultBeforeTaskPerformIsResolved,
        ).resolves.toStrictEqual(innerPerformResultFixture);
      });

      it('should return an asyncronous result', () => {
        expect(result).toStrictEqual(innerPerformResultFixture);
      });

      describe('when called .result', () => {
        let result: unknown;

        beforeAll(() => {
          result = baseTask.result;
        });

        it('should return a syncronous result', () => {
          expect(result).toBe(innerPerformResultFixture);
        });
      });
    });

    describe('when called, and innerPerform returns a rejected promise', () => {
      let baseTask: BaseTaskMock<string, [], unknown>;
      let errorFixture: unknown;

      let result: unknown;

      beforeAll(async () => {
        baseTask = new BaseTaskMock(kindFixture, innerPerformMock);

        errorFixture = new Error();
        innerPerformMock.mockImplementationOnce(async () => {
          throw errorFixture;
        });

        try {
          await baseTask.perform();
        } catch (error: unknown) {
          result = error;
        }
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call innerPerformMock', () => {
        expect(innerPerformMock).toHaveBeenCalledTimes(1);
        expect(innerPerformMock).toHaveBeenCalledWith();
      });

      it('should return throw an error', () => {
        expect(result).toBe(errorFixture);
      });

      describe('when called .result', () => {
        let result: unknown;

        beforeAll(() => {
          result = baseTask.result;
        });

        it('should return the rejected promise', async () => {
          await expect(result).rejects.toBe(errorFixture);
        });
      });

      describe('when called .status', () => {
        let result: unknown;

        beforeAll(() => {
          result = baseTask.status;
        });

        it('should return the error status', () => {
          expect(result).toBe(TaskStatus.Error);
        });
      });
    });
  });
});
