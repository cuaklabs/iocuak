jest.mock('./DependentTaskBuildOperation');

import { Builder } from '../../common/modules/Builder';
import { DependentTask } from '../models/domain/DependentTask';
import { TaskStatus } from '../models/domain/TaskStatus';
import { DependentTaskBuilder } from './DependentTaskBuilder';
import { DependentTaskBuildOperation } from './DependentTaskBuildOperation';
import { TaskDependencyEngine } from './TaskDependencyEngine';

class DependentTaskBuilderMock extends DependentTaskBuilder<
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
  ) {
    super(taskDependencyEngine);

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

describe(DependentTaskBuilder.name, () => {
  let buildWithNoDependenciesMock: jest.Mock<
    DependentTask<unknown, unknown, unknown[], unknown>,
    [unknown]
  >;
  let taskDependencyEngineMock: jest.Mocked<TaskDependencyEngine>;

  let dependentTaskBuilder: DependentTaskBuilderMock;

  beforeAll(() => {
    buildWithNoDependenciesMock = jest.fn<
      DependentTask<unknown, unknown, unknown[], unknown>,
      [unknown]
    >();
    taskDependencyEngineMock = {
      getDependencies: jest.fn(),
    };

    dependentTaskBuilder = new DependentTaskBuilderMock(
      buildWithNoDependenciesMock,
      taskDependencyEngineMock,
    );
  });

  describe('.build()', () => {
    describe('when called', () => {
      let dependentTaskBuildOperationMock: jest.Mocked<DependentTaskBuildOperation>;
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

        dependentTaskBuildOperationMock = {
          run: jest.fn().mockReturnValueOnce(taskFixture),
        } as Partial<
          jest.Mocked<DependentTaskBuildOperation>
        > as jest.Mocked<DependentTaskBuildOperation>;

        (
          DependentTaskBuildOperation as jest.Mock<DependentTaskBuildOperation>
        ).mockReturnValueOnce(dependentTaskBuildOperationMock);

        result = dependentTaskBuilder.build(taskKindFixture);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call DependentTaskBuildOperation()', () => {
        const expectedTaskWithNoDependenciesBuilder: Builder<
          DependentTask<unknown>,
          [unknown]
        > = {
          build: expect.any(Function) as (
            taskKind: unknown,
          ) => DependentTask<unknown>,
        };

        expect(DependentTaskBuildOperation).toHaveBeenCalledTimes(1);
        expect(DependentTaskBuildOperation).toHaveBeenCalledWith(
          expectedTaskWithNoDependenciesBuilder,
          taskDependencyEngineMock,
        );
      });

      it('should return a dependent task', () => {
        expect(result).toStrictEqual(taskFixture);
      });
    });
  });
});
