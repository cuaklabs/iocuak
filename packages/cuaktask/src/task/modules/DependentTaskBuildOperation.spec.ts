import { Builder } from '../../common/modules/Builder';
import { DependentTask } from '../models/domain/DependentTask';
import { TaskStatus } from '../models/domain/TaskStatus';
import { DependentTaskBuilder } from './DependentTaskBuilder';
import { DependentTaskBuildOperation } from './DependentTaskBuildOperation';
import { TaskDependencyEngine } from './TaskDependencyEngine';

describe(DependentTaskBuilder.name, () => {
  let taskWithNoDependenciesBuilderMock: jest.Mocked<
    Builder<DependentTask<unknown>, [unknown]>
  >;
  let taskDependencyEngine: jest.Mocked<TaskDependencyEngine>;

  let dependentTaskBuildOperation: DependentTaskBuildOperation;

  beforeAll(() => {
    taskWithNoDependenciesBuilderMock = {
      build: jest.fn<DependentTask<unknown>, [unknown]>(),
    };
    taskDependencyEngine = {
      getDependencies: jest.fn(),
    };

    dependentTaskBuildOperation = new DependentTaskBuildOperation(
      taskWithNoDependenciesBuilderMock,
      taskDependencyEngine,
    );
  });

  describe('.run()', () => {
    describe('when called, with no dependencies', () => {
      let taskKindFixture: string;
      let taskFixture: DependentTask<string, unknown, unknown[], unknown>;

      let result: unknown;

      beforeAll(() => {
        taskKindFixture = 'some-kind';
        taskFixture = {
          dependencies: [],
          kind: taskKindFixture,
          perform: jest.fn(),
          result: {
            get: () => {
              throw new Error();
            },
          },
          status: TaskStatus.NotStarted,
        };

        taskWithNoDependenciesBuilderMock.build.mockReturnValueOnce(
          taskFixture,
        );
        taskDependencyEngine.getDependencies.mockReturnValueOnce([]);

        result = dependentTaskBuildOperation.run(taskKindFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call taskWithNoDependenciesBuilderMock.build()', () => {
        expect(taskWithNoDependenciesBuilderMock.build).toHaveBeenCalledTimes(
          1,
        );
        expect(taskWithNoDependenciesBuilderMock.build).toHaveBeenCalledWith(
          taskKindFixture,
        );
      });

      it('should call taskDependencyEngine.getDependencies()', () => {
        expect(taskDependencyEngine.getDependencies).toHaveBeenCalledTimes(1);
        expect(taskDependencyEngine.getDependencies).toHaveBeenCalledWith(
          taskKindFixture,
        );
      });

      it('should return a dependent task', () => {
        const expected: DependentTask<string, unknown, unknown[], unknown> = {
          ...taskFixture,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('when called, with dependencies', () => {
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
        result: {
          get: () => {
            throw new Error();
          },
        },
        status: TaskStatus.NotStarted,
      };
      taskKindFixture = 'some-kind';
      taskFixture = {
        dependencies: [],
        kind: taskKindFixture,
        perform: jest.fn(),
        result: {
          get: () => {
            throw new Error();
          },
        },
        status: TaskStatus.NotStarted,
      };

      taskWithNoDependenciesBuilderMock.build
        .mockReturnValueOnce(taskFixture)
        .mockReturnValueOnce(dependentTaskFixture);
      taskDependencyEngine.getDependencies
        .mockReturnValueOnce([dependentTaskKindFixture])
        .mockReturnValueOnce([]);

      result = dependentTaskBuildOperation.run(taskKindFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call taskWithNoDependenciesBuilderMock.build()', () => {
      expect(taskWithNoDependenciesBuilderMock.build).toHaveBeenCalledTimes(2);
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
