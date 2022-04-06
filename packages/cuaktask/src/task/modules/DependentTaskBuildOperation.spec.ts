import { Builder } from '../../common/modules/Builder';
import { DependentTaskMocks } from '../mocks/models/domain/DependentTaskMocks';
import { DependentTask } from '../models/domain/DependentTask';
import { DependentTaskBuildOperation } from './DependentTaskBuildOperation';
import { TaskDependencyEngine } from './TaskDependencyEngine';

describe(DependentTaskBuildOperation.name, () => {
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
    describe('when called, taskDependencyEngine.getDependencies returns and empty array', () => {
      let taskFixture: DependentTask<unknown, unknown, unknown[], unknown>;

      let result: unknown;

      beforeAll(() => {
        taskFixture = DependentTaskMocks.any;

        taskWithNoDependenciesBuilderMock.build.mockReturnValueOnce(
          taskFixture,
        );
        taskDependencyEngine.getDependencies.mockReturnValueOnce([]);

        result = dependentTaskBuildOperation.run(taskFixture.kind);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call taskWithNoDependenciesBuilderMock.build()', () => {
        expect(taskWithNoDependenciesBuilderMock.build).toHaveBeenCalledTimes(
          1,
        );
        expect(taskWithNoDependenciesBuilderMock.build).toHaveBeenCalledWith(
          taskFixture.kind,
        );
      });

      it('should call taskDependencyEngine.getDependencies()', () => {
        expect(taskDependencyEngine.getDependencies).toHaveBeenCalledTimes(1);
        expect(taskDependencyEngine.getDependencies).toHaveBeenCalledWith(
          taskFixture.kind,
        );
      });

      it('should return a dependent task', () => {
        expect(result).toStrictEqual(taskFixture);
      });
    });
  });

  describe('when called, and taskDependencyEngine.getDependencies return dependencies', () => {
    let dependentTaskFixture: DependentTask<
      unknown,
      unknown,
      unknown[],
      unknown
    >;
    let taskFixture: DependentTask<unknown, unknown, unknown[], unknown>;

    let result: unknown;

    beforeAll(() => {
      dependentTaskFixture = {
        ...DependentTaskMocks.any,
        kind: 'dependent-kind',
      };
      taskFixture = DependentTaskMocks.any;

      taskWithNoDependenciesBuilderMock.build
        .mockReturnValueOnce(taskFixture)
        .mockReturnValueOnce(dependentTaskFixture);
      taskDependencyEngine.getDependencies
        .mockReturnValueOnce([dependentTaskFixture.kind])
        .mockReturnValueOnce([]);

      result = dependentTaskBuildOperation.run(taskFixture.kind);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call taskWithNoDependenciesBuilderMock.build()', () => {
      expect(taskWithNoDependenciesBuilderMock.build).toHaveBeenCalledTimes(2);
      expect(taskWithNoDependenciesBuilderMock.build).toHaveBeenNthCalledWith(
        1,
        taskFixture.kind,
      );
      expect(taskWithNoDependenciesBuilderMock.build).toHaveBeenNthCalledWith(
        2,
        dependentTaskFixture.kind,
      );
    });

    it('should call taskDependencyEngine.getDependencies()', () => {
      expect(taskDependencyEngine.getDependencies).toHaveBeenCalledTimes(2);
      expect(taskDependencyEngine.getDependencies).toHaveBeenNthCalledWith(
        1,
        taskFixture.kind,
      );
      expect(taskDependencyEngine.getDependencies).toHaveBeenNthCalledWith(
        2,
        dependentTaskFixture.kind,
      );
    });

    it('should return a dependent task', () => {
      const expected: DependentTask<unknown, unknown, unknown[], unknown> = {
        ...taskFixture,
        dependencies: [dependentTaskFixture],
      };

      expect(result).toStrictEqual(expected);
    });
  });
});
