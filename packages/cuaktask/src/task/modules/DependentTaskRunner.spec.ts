import { afterAll, beforeAll, describe, it, jest } from '@jest/globals';
import * as jestMock from 'jest-mock';

import { DependentTaskMocks } from '../mocks/models/domain/DependentTaskMocks';
import { DependentTask } from '../models/domain/DependentTask';
import { DependentTaskRunner } from './DependentTaskRunner';

describe(DependentTaskRunner.name, () => {
  let dependentTaskRunner: DependentTaskRunner;

  beforeAll(() => {
    dependentTaskRunner = new DependentTaskRunner();
  });

  describe('.run()', () => {
    describe('having a task with status different than NotStarted', () => {
      let dependentTaskMock: jestMock.Mocked<
        DependentTask<unknown, unknown, unknown[], unknown>
      >;
      let dependentTaskResultFixture: unknown;

      beforeAll(() => {
        dependentTaskResultFixture = 'sample-result';

        dependentTaskMock = {
          ...DependentTaskMocks.withStatusEnded,
          result: dependentTaskResultFixture,
        };
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = dependentTaskRunner.run(dependentTaskMock);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should not call dependentTaskMock.perform()', () => {
          expect(dependentTaskMock.perform).not.toHaveBeenCalled();
        });

        it('should return the task result', () => {
          expect(result).toBe(dependentTaskResultFixture);
        });
      });
    });

    describe('having a task with status NotStarted and no dependencies', () => {
      let dependentTaskMock: jestMock.Mocked<
        DependentTask<unknown, unknown, unknown[], unknown>
      >;
      let dependentTaskResultFixture: unknown;

      beforeAll(() => {
        dependentTaskResultFixture = 'sample-result';

        dependentTaskMock =
          DependentTaskMocks.withDependenciesEmptyAndStatusNotStarted;

        dependentTaskMock.perform.mockReturnValue(dependentTaskResultFixture);
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = dependentTaskRunner.run(dependentTaskMock);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call dependentTaskMock.perform()', () => {
          expect(dependentTaskMock.perform).toHaveBeenCalledTimes(1);
          expect(dependentTaskMock.perform).toHaveBeenCalledWith();
        });

        it('should return the task result', () => {
          expect(result).toBe(dependentTaskResultFixture);
        });
      });
    });

    describe('having an asyncronous task with with status NotStarted and asyncronous dependencies', () => {
      let dependencyTaskMock: jestMock.Mocked<
        DependentTask<unknown, unknown, unknown[], unknown>
      >;
      let dependencyTaskResultFixture: unknown;
      let dependentTaskMock: jestMock.Mocked<
        DependentTask<unknown, unknown, unknown[], unknown>
      >;
      let dependentTaskResultFixture: unknown;

      beforeAll(() => {
        dependencyTaskResultFixture = 'dependency-sample-result';
        dependentTaskResultFixture = 'sample-result';

        dependencyTaskMock = {
          ...DependentTaskMocks.withDependenciesEmptyAndStatusNotStarted,
          kind: 'sample-dependency-task-kind',
        };
        (
          dependencyTaskMock.perform as jestMock.Mock<() => Promise<unknown>>
        ).mockResolvedValue(dependencyTaskResultFixture);

        dependentTaskMock = {
          ...DependentTaskMocks.withDependenciesEmptyAndStatusNotStarted,
          dependencies: [dependencyTaskMock],
          kind: 'sample-task-kind',
        };
        (
          dependentTaskMock.perform as jestMock.Mock<() => Promise<unknown>>
        ).mockResolvedValue(dependentTaskResultFixture);
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = dependentTaskRunner.run(dependentTaskMock);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call dependencyTaskMock.perform()', () => {
          expect(dependencyTaskMock.perform).toHaveBeenCalledTimes(1);
          expect(dependencyTaskMock.perform).toHaveBeenCalledWith();
        });

        it('should call dependentTaskMock.perform()', () => {
          expect(dependentTaskMock.perform).toHaveBeenCalledTimes(1);
          expect(dependentTaskMock.perform).toHaveBeenCalledWith(
            dependencyTaskResultFixture,
          );
        });

        it('should call dependencyTaskMock.perform() before dependentTaskMock.perform()', () => {
          const dependencyTaskMockPerformOrder: number = (
            dependencyTaskMock.perform.mock.invocationCallOrder as number[] &
              [number]
          )[0];

          const dependentTaskMockPerformOrder: number = (
            dependentTaskMock.perform.mock.invocationCallOrder as number[] &
              [number]
          )[0];

          expect(dependencyTaskMockPerformOrder).toBeLessThan(
            dependentTaskMockPerformOrder,
          );
        });

        it('should return the task result', async () => {
          await expect(result).resolves.toStrictEqual(
            dependentTaskResultFixture,
          );
        });
      });
    });

    describe('having an asyncronous task with status NotStarted and syncronous dependencies', () => {
      let dependencyTaskMock: jestMock.Mocked<
        DependentTask<string, unknown, unknown[], unknown>
      >;
      let dependencyTaskResultFixture: unknown;
      let dependentTaskMock: jestMock.Mocked<
        DependentTask<string, unknown, unknown[], unknown>
      >;
      let dependentTaskResultFixture: unknown;

      beforeAll(() => {
        dependencyTaskResultFixture = 'dependency-sample-result';
        dependentTaskResultFixture = 'sample-result';

        dependencyTaskMock = {
          ...DependentTaskMocks.withDependenciesEmptyAndStatusNotStarted,
          kind: 'sample-dependency-task-kind',
        };
        dependencyTaskMock.perform.mockReturnValue(dependencyTaskResultFixture);

        dependentTaskMock = {
          ...DependentTaskMocks.withDependenciesEmptyAndStatusNotStarted,
          dependencies: [dependencyTaskMock],
          kind: 'sample-task-kind',
        };
        (
          dependentTaskMock.perform as jestMock.Mock<() => Promise<unknown>>
        ).mockResolvedValue(dependentTaskResultFixture);
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = dependentTaskRunner.run(dependentTaskMock);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call dependencyTaskMock.perform()', () => {
          expect(dependencyTaskMock.perform).toHaveBeenCalledTimes(1);
          expect(dependencyTaskMock.perform).toHaveBeenCalledWith();
        });

        it('should call dependentTaskMock.perform()', () => {
          expect(dependentTaskMock.perform).toHaveBeenCalledTimes(1);
          expect(dependentTaskMock.perform).toHaveBeenCalledWith(
            dependencyTaskResultFixture,
          );
        });

        it('should call dependencyTaskMock.perform() before dependentTaskMock.perform()', () => {
          const dependencyTaskMockPerformOrder: number = (
            dependencyTaskMock.perform.mock.invocationCallOrder as number[] &
              [number]
          )[0];

          const dependentTaskMockPerformOrder: number = (
            dependentTaskMock.perform.mock.invocationCallOrder as number[] &
              [number]
          )[0];

          expect(dependencyTaskMockPerformOrder).toBeLessThan(
            dependentTaskMockPerformOrder,
          );
        });

        it('should return the task result', async () => {
          await expect(result).resolves.toStrictEqual(
            dependentTaskResultFixture,
          );
        });
      });
    });

    describe('having a syncronous task with status NotStarted and asyncronous dependencies', () => {
      let dependencyTaskMock: jestMock.Mocked<
        DependentTask<string, unknown, unknown[], unknown>
      >;
      let dependencyTaskResultFixture: unknown;
      let dependentTaskMock: jestMock.Mocked<
        DependentTask<string, unknown, unknown[], unknown>
      >;
      let dependentTaskResultFixture: unknown;

      beforeAll(() => {
        dependencyTaskResultFixture = 'dependency-sample-result';
        dependentTaskResultFixture = 'sample-result';

        dependencyTaskMock = {
          ...DependentTaskMocks.withDependenciesEmptyAndStatusNotStarted,
          kind: 'sample-dependency-task-kind',
        };
        (
          dependencyTaskMock.perform as jestMock.Mock<() => Promise<unknown>>
        ).mockResolvedValue(dependencyTaskResultFixture);

        dependentTaskMock = {
          ...DependentTaskMocks.withDependenciesEmptyAndStatusNotStarted,
          dependencies: [dependencyTaskMock],
          kind: 'sample-task-kind',
        };
        dependentTaskMock.perform.mockReturnValue(dependentTaskResultFixture);
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = dependentTaskRunner.run(dependentTaskMock);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call dependencyTaskMock.perform()', () => {
          expect(dependencyTaskMock.perform).toHaveBeenCalledTimes(1);
          expect(dependencyTaskMock.perform).toHaveBeenCalledWith();
        });

        it('should call dependentTaskMock.perform()', () => {
          expect(dependentTaskMock.perform).toHaveBeenCalledTimes(1);
          expect(dependentTaskMock.perform).toHaveBeenCalledWith(
            dependencyTaskResultFixture,
          );
        });

        it('should call dependencyTaskMock.perform() before dependentTaskMock.perform()', () => {
          const dependencyTaskMockPerformOrder: number = (
            dependencyTaskMock.perform.mock.invocationCallOrder as number[] &
              [number]
          )[0];

          const dependentTaskMockPerformOrder: number = (
            dependentTaskMock.perform.mock.invocationCallOrder as number[] &
              [number]
          )[0];

          expect(dependencyTaskMockPerformOrder).toBeLessThan(
            dependentTaskMockPerformOrder,
          );
        });

        it('should return the task result', async () => {
          await expect(result).resolves.toStrictEqual(
            dependentTaskResultFixture,
          );
        });
      });
    });

    describe('having a syncronous task with status NotStarted and syncronous dependencies', () => {
      let dependencyTaskMock: jestMock.Mocked<
        DependentTask<string, unknown, unknown[], unknown>
      >;
      let dependencyTaskResultFixture: unknown;
      let dependentTaskMock: jestMock.Mocked<
        DependentTask<string, unknown, unknown[], unknown>
      >;
      let dependentTaskResultFixture: unknown;

      beforeAll(() => {
        dependencyTaskResultFixture = 'dependency-sample-result';
        dependentTaskResultFixture = 'sample-result';

        dependencyTaskMock = {
          ...DependentTaskMocks.withDependenciesEmptyAndStatusNotStarted,
          kind: 'sample-dependency-task-kind',
        };
        dependencyTaskMock.perform.mockReturnValue(dependencyTaskResultFixture);

        dependentTaskMock = {
          ...DependentTaskMocks.withDependenciesEmptyAndStatusNotStarted,
          dependencies: [dependencyTaskMock],
          kind: 'sample-task-kind',
        };
        dependentTaskMock.perform.mockReturnValue(dependentTaskResultFixture);
      });

      describe('when called', () => {
        let result: unknown;

        beforeAll(() => {
          result = dependentTaskRunner.run(dependentTaskMock);
        });

        afterAll(() => {
          jest.clearAllMocks();
        });

        it('should call dependencyTaskMock.perform()', () => {
          expect(dependencyTaskMock.perform).toHaveBeenCalledTimes(1);
          expect(dependencyTaskMock.perform).toHaveBeenCalledWith();
        });

        it('should call dependentTaskMock.perform()', () => {
          expect(dependentTaskMock.perform).toHaveBeenCalledTimes(1);
          expect(dependentTaskMock.perform).toHaveBeenCalledWith(
            dependencyTaskResultFixture,
          );
        });

        it('should call dependencyTaskMock.perform() before dependentTaskMock.perform()', () => {
          const dependencyTaskMockPerformOrder: number = (
            dependencyTaskMock.perform.mock.invocationCallOrder as number[] &
              [number]
          )[0];

          const dependentTaskMockPerformOrder: number = (
            dependentTaskMock.perform.mock.invocationCallOrder as number[] &
              [number]
          )[0];

          expect(dependencyTaskMockPerformOrder).toBeLessThan(
            dependentTaskMockPerformOrder,
          );
        });

        it('should return the task result', () => {
          expect(result).toBe(dependentTaskResultFixture);
        });
      });
    });
  });
});
