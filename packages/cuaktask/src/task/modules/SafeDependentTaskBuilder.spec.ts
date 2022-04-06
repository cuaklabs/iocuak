jest.mock('./SafeDependentTaskBuildOperation');

import { Builder } from '../../common/modules/Builder';
import { SetLike } from '../../common/modules/SetLike';
import { DependentTaskMocks } from '../mocks/models/domain/DependentTaskMocks';
import { DependentTask } from '../models/domain/DependentTask';
import { SafeDependentTaskBuilder } from './SafeDependentTaskBuilder';
import { SafeDependentTaskBuildOperation } from './SafeDependentTaskBuildOperation';
import { TaskDependencyEngine } from './TaskDependencyEngine';

class SafeDependentTaskBuilderMock extends SafeDependentTaskBuilder<
  unknown,
  unknown[],
  unknown
> {
  readonly #buildWithNoDependenciesMock: jest.Mock<
    DependentTask<unknown, unknown, unknown[], unknown>,
    [unknown]
  >;
  constructor(
    buildWithNoDependenciesMock: jest.Mock<
      DependentTask<unknown, unknown, unknown[], unknown>,
      [unknown]
    >,
    taskDependencyEngine: TaskDependencyEngine,
    taskDependenciesKindSetBuilder: Builder<SetLike<unknown>, []>,
  ) {
    super(taskDependencyEngine, taskDependenciesKindSetBuilder);

    this.#buildWithNoDependenciesMock = buildWithNoDependenciesMock;
  }

  protected buildWithNoDependencies<TKind, TArgs extends unknown[], TReturn>(
    taskKind: TKind,
  ): DependentTask<TKind, unknown, TArgs, TReturn> {
    return this.#buildWithNoDependenciesMock(taskKind) as DependentTask<
      TKind,
      unknown,
      TArgs,
      TReturn
    >;
  }
}

describe(SafeDependentTaskBuilder.name, () => {
  let buildWithNoDependenciesMock: jest.Mock<
    DependentTask<unknown, unknown, unknown[], unknown>,
    [unknown]
  >;
  let taskDependencyEngineMock: jest.Mocked<TaskDependencyEngine>;
  let taskDependenciesKindSetBuilderMock: jest.Mocked<
    Builder<SetLike<unknown>, []>
  >;

  let safeDependentTaskBuilder: SafeDependentTaskBuilderMock;

  beforeAll(() => {
    buildWithNoDependenciesMock = jest.fn<
      DependentTask<unknown, unknown, unknown[], unknown>,
      [unknown]
    >();
    taskDependencyEngineMock = {
      getDependencies: jest.fn(),
    };
    taskDependenciesKindSetBuilderMock = {
      build: jest.fn(),
    };

    safeDependentTaskBuilder = new SafeDependentTaskBuilderMock(
      buildWithNoDependenciesMock,
      taskDependencyEngineMock,
      taskDependenciesKindSetBuilderMock,
    );
  });

  describe('.build()', () => {
    describe('when called', () => {
      let safeDependentTaskBuildOperationMock: jest.Mocked<SafeDependentTaskBuildOperation>;
      let taskDependenciesKindSetMock: SetLike<unknown>;
      let taskFixture: DependentTask<unknown, unknown, unknown[], unknown>;

      let result: unknown;

      beforeAll(() => {
        taskFixture = DependentTaskMocks.any;

        taskDependenciesKindSetMock = {
          add: jest.fn(),
          clear: jest.fn(),
          delete: jest.fn(),
          has: jest.fn(),
        };

        taskDependenciesKindSetBuilderMock.build.mockReturnValueOnce(
          taskDependenciesKindSetMock,
        );

        safeDependentTaskBuildOperationMock = {
          run: jest.fn().mockReturnValueOnce(taskFixture),
        } as Partial<
          jest.Mocked<SafeDependentTaskBuildOperation>
        > as jest.Mocked<SafeDependentTaskBuildOperation>;

        (
          SafeDependentTaskBuildOperation as jest.Mock<SafeDependentTaskBuildOperation>
        ).mockReturnValueOnce(safeDependentTaskBuildOperationMock);

        result = safeDependentTaskBuilder.build(taskFixture.kind);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call SafeDependentTaskBuildOperation()', () => {
        const expectedTaskWithNoDependenciesBuilder: Builder<
          DependentTask<unknown>,
          [unknown]
        > = {
          build: expect.any(Function) as (
            taskKind: unknown,
          ) => DependentTask<unknown>,
        };

        expect(SafeDependentTaskBuildOperation).toHaveBeenCalledTimes(1);
        expect(SafeDependentTaskBuildOperation).toHaveBeenCalledWith(
          expectedTaskWithNoDependenciesBuilder,
          taskDependencyEngineMock,
          taskDependenciesKindSetMock,
        );
      });

      it('should return a dependent task', () => {
        expect(result).toStrictEqual(taskFixture);
      });
    });
  });
});
