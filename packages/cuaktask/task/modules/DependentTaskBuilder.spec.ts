import { Builder } from '../../common/modules/Builder';
import { SetLike } from '../../common/modules/SetLike';
import { DependentTask } from '../models/domain/DependentTask';
import { Task } from '../models/domain/Task';
import { TaskStatus } from '../models/domain/TaskStatus';
import { DependentTaskBuilder } from './DependentTaskBuilder';
import { TaskDependencyEngine } from './TaskDependencyEngine';

class DependentTaskBuilderMock extends DependentTaskBuilder<
  string,
  unknown,
  unknown[],
  unknown
> {
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  readonly #buildWithNoDependenciesMock: jest.Mock<
    Task<unknown, unknown[], unknown>,
    [unknown]
  >;
  constructor(
    buildWithNoDependenciesMock: jest.Mock<
      Task<unknown, unknown[], unknown>,
      [unknown]
    >,
    taskDependenciesKindSetBuilder: Builder<[], SetLike<string>>,
    taskDependencyEngine: TaskDependencyEngine,
  ) {
    super(taskDependenciesKindSetBuilder, taskDependencyEngine);

    this.#buildWithNoDependenciesMock = buildWithNoDependenciesMock;
  }

  protected buildWithNoDependencies<TKind, TArgs extends unknown[], TReturn>(
    taskKind: TKind,
  ): Task<TKind, TArgs, TReturn> {
    return this.#buildWithNoDependenciesMock(taskKind) as Task<
      TKind,
      TArgs,
      TReturn
    >;
  }
}

describe(DependentTaskBuilder.name, () => {
  let buildWithNoDependenciesMock: jest.Mock<
    Task<unknown, unknown[], unknown>,
    [unknown]
  >;
  let taskDependenciesKindSetBuilder: jest.Mocked<Builder<[], SetLike<string>>>;
  let taskDependencyEngine: jest.Mocked<TaskDependencyEngine>;

  let dependentTaskBuilder: DependentTaskBuilderMock;

  beforeAll(() => {
    buildWithNoDependenciesMock = jest.fn<
      Task<unknown, unknown[], unknown>,
      [unknown]
    >();
    taskDependenciesKindSetBuilder = {
      build: jest.fn().mockImplementation(() => new Set()),
    };
    taskDependencyEngine = {
      getDependencies: jest.fn(),
    };

    dependentTaskBuilder = new DependentTaskBuilderMock(
      buildWithNoDependenciesMock,
      taskDependenciesKindSetBuilder,
      taskDependencyEngine,
    );
  });

  describe('.build()', () => {
    describe('when called, with no dependencies', () => {
      let taskKindFixture: string;
      let taskFixture: Task<string, unknown[], unknown>;

      let result: unknown;

      beforeAll(() => {
        taskKindFixture = 'some-kind';
        taskFixture = {
          kind: taskKindFixture,
          perform: jest.fn(),
          status: TaskStatus.NotStarted,
        };

        buildWithNoDependenciesMock.mockReturnValueOnce(taskFixture);
        taskDependencyEngine.getDependencies.mockReturnValueOnce([]);

        result = dependentTaskBuilder.build(taskKindFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call buildWithNoDependencies()', () => {
        expect(buildWithNoDependenciesMock).toHaveBeenCalledTimes(1);
        expect(buildWithNoDependenciesMock).toHaveBeenCalledWith(
          taskKindFixture,
        );
      });

      it('should call taskDependenciesKindSetBuilder.build()', () => {
        expect(taskDependenciesKindSetBuilder.build).toHaveBeenCalledTimes(1);
        expect(taskDependenciesKindSetBuilder.build).toHaveBeenCalledWith();
      });

      it('should call taskDependencyEngine.getDependencies()', () => {
        expect(taskDependencyEngine.getDependencies).toHaveBeenCalledTimes(1);
        expect(taskDependencyEngine.getDependencies).toHaveBeenCalledWith(
          taskKindFixture,
        );
      });

      it('should return a dependent task', () => {
        const expected: DependentTask<string, unknown, unknown[], unknown> = {
          dependencies: [],
          ...taskFixture,
        };

        expect(result).toStrictEqual(expected);
      });
    });
  });

  describe('when called, with no circular dependencies', () => {
    let dependentTaskKindFixture: string;
    let dependentTaskFixture: Task<string, unknown[], unknown>;
    let taskKindFixture: string;
    let taskFixture: Task<string, unknown[], unknown>;

    let result: unknown;

    beforeAll(() => {
      dependentTaskKindFixture = 'dependent-kind';
      dependentTaskFixture = {
        kind: dependentTaskKindFixture,
        perform: jest.fn(),
        status: TaskStatus.NotStarted,
      };
      taskKindFixture = 'some-kind';
      taskFixture = {
        kind: taskKindFixture,
        perform: jest.fn(),
        status: TaskStatus.NotStarted,
      };

      buildWithNoDependenciesMock
        .mockReturnValueOnce(taskFixture)
        .mockReturnValueOnce(dependentTaskFixture);
      taskDependencyEngine.getDependencies
        .mockReturnValueOnce([dependentTaskKindFixture])
        .mockReturnValueOnce([]);

      result = dependentTaskBuilder.build(taskKindFixture);
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call buildWithNoDependencies()', () => {
      expect(buildWithNoDependenciesMock).toHaveBeenCalledTimes(2);
      expect(buildWithNoDependenciesMock).toHaveBeenNthCalledWith(
        1,
        taskKindFixture,
      );
      expect(buildWithNoDependenciesMock).toHaveBeenNthCalledWith(
        2,
        dependentTaskKindFixture,
      );
    });

    it('should call taskDependenciesKindSetBuilder.build()', () => {
      expect(taskDependenciesKindSetBuilder.build).toHaveBeenCalledTimes(1);
      expect(taskDependenciesKindSetBuilder.build).toHaveBeenCalledWith();
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
        dependencies: [
          {
            dependencies: [],
            ...dependentTaskFixture,
          },
        ],
        ...taskFixture,
      };

      expect(result).toStrictEqual(expected);
    });
  });

  describe('when called, with circular dependencies', () => {
    let dependentTaskKindFixture: string;
    let taskKindFixture: string;
    let taskFixture: Task<string, unknown[], unknown>;

    let result: unknown;

    beforeAll(() => {
      dependentTaskKindFixture = 'dependent-kind';

      taskKindFixture = dependentTaskKindFixture;
      taskFixture = {
        kind: taskKindFixture,
        perform: jest.fn(),
        status: TaskStatus.NotStarted,
      };

      buildWithNoDependenciesMock.mockReturnValueOnce(taskFixture);
      taskDependencyEngine.getDependencies.mockReturnValueOnce([
        dependentTaskKindFixture,
      ]);

      try {
        dependentTaskBuilder.build(taskKindFixture);
      } catch (error: unknown) {
        result = error;
      }
    });

    afterAll(() => {
      jest.clearAllMocks();
    });

    it('should call buildWithNoDependencies()', () => {
      expect(buildWithNoDependenciesMock).toHaveBeenCalledTimes(1);
      expect(buildWithNoDependenciesMock).toHaveBeenCalledWith(taskKindFixture);
    });

    it('should call taskDependenciesKindSetBuilder.build()', () => {
      expect(taskDependenciesKindSetBuilder.build).toHaveBeenCalledTimes(1);
      expect(taskDependenciesKindSetBuilder.build).toHaveBeenCalledWith();
    });

    it('should call taskDependencyEngine.getDependencies()', () => {
      expect(taskDependencyEngine.getDependencies).toHaveBeenCalledTimes(1);
      expect(taskDependencyEngine.getDependencies).toHaveBeenCalledWith(
        taskKindFixture,
      );
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
