import { afterAll, beforeAll, describe, expect, it, jest } from '@jest/globals';
import * as jestMock from 'jest-mock';

jest.mock('./DependentTaskBuildOperation');

import { Builder } from '../../common/modules/Builder';
import { DependentTaskMocks } from '../mocks/models/domain/DependentTaskMocks';
import { DependentTask } from '../models/domain/DependentTask';
import { DependentTaskBuilder } from './DependentTaskBuilder';
import { DependentTaskBuildOperation } from './DependentTaskBuildOperation';
import { TaskDependencyEngine } from './TaskDependencyEngine';

class DependentTaskBuilderMock extends DependentTaskBuilder<
  unknown,
  unknown[],
  unknown
> {
  readonly #buildWithNoDependenciesMock: jestMock.Mock<
    (param: unknown) => DependentTask<unknown>
  >;
  constructor(
    buildWithNoDependenciesMock: jestMock.Mock<
      (param: unknown) => DependentTask<unknown>
    >,
    taskDependencyEngine: TaskDependencyEngine<unknown>,
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
  let buildWithNoDependenciesMock: jestMock.Mock<
    (param: unknown) => DependentTask<unknown>
  >;
  let taskDependencyEngineMock: jestMock.Mocked<TaskDependencyEngine<unknown>>;

  let dependentTaskBuilder: DependentTaskBuilderMock;

  beforeAll(() => {
    buildWithNoDependenciesMock =
      jest.fn<(param: unknown) => DependentTask<unknown>>();
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
      let dependentTaskBuildOperationMock: jestMock.Mocked<DependentTaskBuildOperation>;
      let taskFixture: DependentTask<unknown, unknown, unknown[], unknown>;

      let result: unknown;

      beforeAll(() => {
        taskFixture = DependentTaskMocks.any;

        dependentTaskBuildOperationMock = {
          run: jest.fn().mockReturnValueOnce(taskFixture),
        } as Partial<
          jestMock.Mocked<DependentTaskBuildOperation>
        > as jestMock.Mocked<DependentTaskBuildOperation>;

        (
          DependentTaskBuildOperation as jest.Mock<DependentTaskBuildOperation>
        ).mockReturnValueOnce(dependentTaskBuildOperationMock);

        result = dependentTaskBuilder.build(taskFixture.kind);
      });

      afterAll(() => {
        jest.clearAllMocks();
      });

      it('should call DependentTaskBuildOperation()', () => {
        const expectedTaskWithNoDependenciesBuilder: Builder<
          DependentTask<unknown>,
          [unknown]
        > = {
          build: expect.any(Function) as unknown as (
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
