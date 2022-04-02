import { Builder } from '../../common/modules/Builder';
import { SetLike } from '../../common/modules/SetLike';
import { DependentTask } from '../models/domain/DependentTask';
import { TaskStatus } from '../models/domain/TaskStatus';
import { DependentTaskBuilder } from './DependentTaskBuilder';
import { SafeDependentTaskBuildOperation } from './SafeDependentTaskBuildOperation';
import { TaskDependencyEngine } from './TaskDependencyEngine';

describe(DependentTaskBuilder.name, () => {
  let taskWithNoDependenciesBuilderMock: jest.Mocked<
    Builder<DependentTask<unknown>, [unknown]>
  >;
  let taskDependencyEngine: jest.Mocked<TaskDependencyEngine>;
  let taskDependenciesKindSet: jest.Mocked<SetLike<unknown>>;
  let safeDependentTaskBuildOperation: SafeDependentTaskBuildOperation;

  beforeAll(() => {
    taskWithNoDependenciesBuilderMock = {
      build: jest.fn<DependentTask<unknown>, [unknown]>(),
    };
    taskDependencyEngine = {
      getDependencies: jest.fn(),
    };
    taskDependenciesKindSet = {
      add: jest.fn(),
      clear: jest.fn(),
      delete: jest.fn(),
      has: jest.fn(),
    };

    safeDependentTaskBuildOperation = new SafeDependentTaskBuildOperation(
      taskWithNoDependenciesBuilderMock,
      taskDependencyEngine,
      taskDependenciesKindSet,
    );
  });

  describe('.build()', () => {
    describe('when called, with no circular dependencies', () => {
      let dependentTaskKindFixture: string;
      let dependentTaskFixture: DependentTask<
        string,
        unknown,
        unknown[],
        unknown
      >;
      let taskKindFixture: string;
      let taskFixture: DependentTask<string, unknown, unknown[], unknown>;

      let result: unknown;

      beforeAll(() => {
        dependentTaskKindFixture = 'dependent-kind';
        dependentTaskFixture = {
          dependencies: [],
          kind: dependentTaskKindFixture,
          perform: jest.fn(),
          status: TaskStatus.NotStarted,
        };
        taskKindFixture = 'some-kind';
        taskFixture = {
          dependencies: [],
          kind: taskKindFixture,
          perform: jest.fn(),
          status: TaskStatus.NotStarted,
        };

        taskDependenciesKindSet.has
          .mockReturnValueOnce(false)
          .mockReturnValueOnce(false);

        taskWithNoDependenciesBuilderMock.build
          .mockReturnValueOnce(taskFixture)
          .mockReturnValueOnce(dependentTaskFixture);
        taskDependencyEngine.getDependencies
          .mockReturnValueOnce([dependentTaskKindFixture])
          .mockReturnValueOnce([]);

        result = safeDependentTaskBuildOperation.run(taskKindFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call taskDependenciesKindSet.has()', () => {
        expect(taskDependenciesKindSet.has).toHaveBeenCalledTimes(2);
        expect(taskDependenciesKindSet.has).toHaveBeenNthCalledWith(
          1,
          taskKindFixture,
        );
        expect(taskDependenciesKindSet.has).toHaveBeenNthCalledWith(
          2,
          dependentTaskKindFixture,
        );
      });

      it('should call taskWithNoDependenciesBuilderMock.build()', () => {
        expect(taskWithNoDependenciesBuilderMock.build).toHaveBeenCalledTimes(
          2,
        );
        expect(taskWithNoDependenciesBuilderMock.build).toHaveBeenNthCalledWith(
          1,
          taskKindFixture,
        );
        expect(taskWithNoDependenciesBuilderMock.build).toHaveBeenNthCalledWith(
          2,
          dependentTaskKindFixture,
        );
      });

      it('should call taskDependencyEngine.getDependencies()', () => {
        expect(taskDependencyEngine.getDependencies).toHaveBeenCalledTimes(2);
        expect(taskDependencyEngine.getDependencies).toHaveBeenNthCalledWith(
          1,
          taskKindFixture,
        );
        expect(taskDependencyEngine.getDependencies).toHaveBeenNthCalledWith(
          2,
          dependentTaskKindFixture,
        );
      });

      it('should return a dependent task', () => {
        const expected: DependentTask<string, unknown, unknown[], unknown> = {
          ...taskFixture,
          dependencies: [dependentTaskFixture],
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('when called, with circular dependencies', () => {
    let dependentTaskKindFixture: string;
    let taskKindFixture: string;

    let result: unknown;

    beforeAll(() => {
      dependentTaskKindFixture = 'dependent-kind';

      taskKindFixture = dependentTaskKindFixture;

      taskDependenciesKindSet.has.mockReturnValueOnce(true);

      try {
        safeDependentTaskBuildOperation.run(taskKindFixture);
      } catch (error: unknown) {
        result = error;
      }
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call taskDependenciesKindSet.has()', () => {
      expect(taskDependenciesKindSet.has).toHaveBeenCalledTimes(1);
      expect(taskDependenciesKindSet.has).toHaveBeenCalledWith(taskKindFixture);
    });

    it('should throw an Error', () => {
      expect(result).toBeInstanceOf(Error);
      expect(result).toStrictEqual(
        expect.objectContaining<Partial<Error>>({
          message: 'Circular dependency found!',
        }),
      );
    });
  });
});
