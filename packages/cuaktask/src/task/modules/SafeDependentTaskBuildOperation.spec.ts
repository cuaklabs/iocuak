import { Builder } from '../../common/modules/Builder';
import { SetLike } from '../../common/modules/SetLike';
import { DependentTaskMocks } from '../mocks/models/domain/DependentTaskMocks';
import { DependentTask } from '../models/domain/DependentTask';
import { SafeDependentTaskBuildOperation } from './SafeDependentTaskBuildOperation';
import { TaskDependencyEngine } from './TaskDependencyEngine';

describe(SafeDependentTaskBuildOperation.name, () => {
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
      let dependentTaskFixture: DependentTask<
        string,
        unknown,
        unknown[],
        unknown
      >;
      let taskFixture: DependentTask<string, unknown, unknown[], unknown>;

      let result: unknown;

      beforeAll(() => {
        dependentTaskFixture = {
          ...DependentTaskMocks.any,
          kind: 'dependent-kind',
        };
        taskFixture = {
          ...DependentTaskMocks.any,
          kind: 'some-kind',
        };

        taskDependenciesKindSet.has
          .mockReturnValueOnce(false)
          .mockReturnValueOnce(false);

        taskWithNoDependenciesBuilderMock.build
          .mockReturnValueOnce(taskFixture)
          .mockReturnValueOnce(dependentTaskFixture);
        taskDependencyEngine.getDependencies
          .mockReturnValueOnce([dependentTaskFixture.kind])
          .mockReturnValueOnce([]);

        result = safeDependentTaskBuildOperation.run(taskFixture.kind);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call taskDependenciesKindSet.has()', () => {
        expect(taskDependenciesKindSet.has).toHaveBeenCalledTimes(2);
        expect(taskDependenciesKindSet.has).toHaveBeenNthCalledWith(
          1,
          taskFixture.kind,
        );
        expect(taskDependenciesKindSet.has).toHaveBeenNthCalledWith(
          2,
          dependentTaskFixture.kind,
        );
      });

      it('should call taskWithNoDependenciesBuilderMock.build()', () => {
        expect(taskWithNoDependenciesBuilderMock.build).toHaveBeenCalledTimes(
          2,
        );
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
