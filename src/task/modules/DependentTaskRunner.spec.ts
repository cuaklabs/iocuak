import { DependentTask } from '../models/domain/DependentTask';
import { TaskStatus } from '../models/domain/TaskStatus';
import { DependentTaskRunner } from './DependentTaskRunner';

describe(DependentTaskRunner.name, () => {
  let dependentTaskRunner: DependentTaskRunner;

  beforeAll(() => {
    dependentTaskRunner = new DependentTaskRunner();
  });

  describe('.run()', () => {
    describe('having a task with no dependencies', () => {
      let dependentTaskMock: jest.Mocked<
        DependentTask<string, unknown[], unknown>
      >;
      let dependentTaskResultFixture: unknown;

      beforeAll(() => {
        dependentTaskResultFixture = 'sample-result';

        dependentTaskMock = {
          dependencies: [],
          kind: 'sample-task-kind',
          perform: jest.fn().mockReturnValue(dependentTaskResultFixture),
          status: TaskStatus.NotStarted,
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

        it('should call dependentTaskMock.perform()', () => {
          expect(dependentTaskMock.perform).toHaveBeenCalledTimes(1);
          expect(dependentTaskMock.perform).toHaveBeenCalledWith();
        });

        it('should return the task result', () => {
          expect(result).toBe(dependentTaskResultFixture);
        });
      });
    });

    describe('having a asyncronous task with asyncronous dependencies', () => {
      let dependencyTaskMock: jest.Mocked<
        DependentTask<string, unknown[], unknown>
      >;
      let dependencyTaskResultFixture: unknown;
      let dependentTaskMock: jest.Mocked<
        DependentTask<string, unknown[], unknown>
      >;
      let dependentTaskResultFixture: unknown;

      beforeAll(() => {
        dependencyTaskResultFixture = 'dependency-sample-result';
        dependentTaskResultFixture = 'sample-result';

        dependencyTaskMock = {
          dependencies: [],
          kind: 'sample-dependency-task-kind',
          perform: jest.fn().mockResolvedValue(dependencyTaskResultFixture),
          status: TaskStatus.NotStarted,
        };
        dependentTaskMock = {
          dependencies: [dependencyTaskMock],
          kind: 'sample-task-kind',
          perform: jest.fn().mockResolvedValue(dependentTaskResultFixture),
          status: TaskStatus.NotStarted,
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
          expect(result).toStrictEqual(
            Promise.resolve(dependentTaskResultFixture),
          );
        });
      });
    });

    describe('having a asyncronous task with syncronous dependencies', () => {
      let dependencyTaskMock: jest.Mocked<
        DependentTask<string, unknown[], unknown>
      >;
      let dependencyTaskResultFixture: unknown;
      let dependentTaskMock: jest.Mocked<
        DependentTask<string, unknown[], unknown>
      >;
      let dependentTaskResultFixture: unknown;

      beforeAll(() => {
        dependencyTaskResultFixture = 'dependency-sample-result';
        dependentTaskResultFixture = 'sample-result';

        dependencyTaskMock = {
          dependencies: [],
          kind: 'sample-dependency-task-kind',
          perform: jest.fn().mockReturnValue(dependencyTaskResultFixture),
          status: TaskStatus.NotStarted,
        };
        dependentTaskMock = {
          dependencies: [dependencyTaskMock],
          kind: 'sample-task-kind',
          perform: jest.fn().mockResolvedValue(dependentTaskResultFixture),
          status: TaskStatus.NotStarted,
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
          expect(result).toStrictEqual(
            Promise.resolve(dependentTaskResultFixture),
          );
        });
      });
    });

    describe('having a syncronous task with asyncronous dependencies', () => {
      let dependencyTaskMock: jest.Mocked<
        DependentTask<string, unknown[], unknown>
      >;
      let dependencyTaskResultFixture: unknown;
      let dependentTaskMock: jest.Mocked<
        DependentTask<string, unknown[], unknown>
      >;
      let dependentTaskResultFixture: unknown;

      beforeAll(() => {
        dependencyTaskResultFixture = 'dependency-sample-result';
        dependentTaskResultFixture = 'sample-result';

        dependencyTaskMock = {
          dependencies: [],
          kind: 'sample-dependency-task-kind',
          perform: jest.fn().mockResolvedValue(dependencyTaskResultFixture),
          status: TaskStatus.NotStarted,
        };
        dependentTaskMock = {
          dependencies: [dependencyTaskMock],
          kind: 'sample-task-kind',
          perform: jest.fn().mockReturnValue(dependentTaskResultFixture),
          status: TaskStatus.NotStarted,
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
          expect(result).toStrictEqual(
            Promise.resolve(dependentTaskResultFixture),
          );
        });
      });
    });

    describe('having a syncronous task with syncronous dependencies', () => {
      let dependencyTaskMock: jest.Mocked<
        DependentTask<string, unknown[], unknown>
      >;
      let dependencyTaskResultFixture: unknown;
      let dependentTaskMock: jest.Mocked<
        DependentTask<string, unknown[], unknown>
      >;
      let dependentTaskResultFixture: unknown;

      beforeAll(() => {
        dependencyTaskResultFixture = 'dependency-sample-result';
        dependentTaskResultFixture = 'sample-result';

        dependencyTaskMock = {
          dependencies: [],
          kind: 'sample-dependency-task-kind',
          perform: jest.fn().mockReturnValue(dependencyTaskResultFixture),
          status: TaskStatus.NotStarted,
        };
        dependentTaskMock = {
          dependencies: [dependencyTaskMock],
          kind: 'sample-task-kind',
          perform: jest.fn().mockReturnValue(dependentTaskResultFixture),
          status: TaskStatus.NotStarted,
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
