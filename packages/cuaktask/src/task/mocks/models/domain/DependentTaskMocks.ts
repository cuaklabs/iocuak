import * as jestMock from 'jest-mock';

import { DependentTask } from '../../../models/domain/DependentTask';
import { TaskStatus } from '../../../models/domain/TaskStatus';
import { TaskMocks } from './TaskMocks';

export class DependentTaskMocks {
  public static get any(): jestMock.Mocked<
    DependentTask<unknown, unknown, unknown[], unknown>
  > {
    const mock: jestMock.Mocked<
      DependentTask<unknown, unknown, unknown[], unknown>
    > = {
      ...TaskMocks.any,
      dependencies: [],
    };

    return mock;
  }

  public static get withDependenciesEmpty(): jestMock.Mocked<
    DependentTask<unknown, unknown, unknown[], unknown>
  > {
    const mock: jestMock.Mocked<
      DependentTask<unknown, unknown, unknown[], unknown>
    > = {
      ...DependentTaskMocks.any,
      dependencies: [],
    };

    return mock;
  }

  public static get withDependenciesEmptyAndStatusNotStarted(): jestMock.Mocked<
    DependentTask<unknown, unknown, unknown[], unknown>
  > {
    const mock: jestMock.Mocked<
      DependentTask<unknown, unknown, unknown[], unknown>
    > = {
      ...DependentTaskMocks.withDependenciesEmpty,
      status: TaskStatus.NotStarted,
    };

    return mock;
  }

  public static get withStatusNotStarted(): jestMock.Mocked<
    DependentTask<unknown, unknown, unknown[], unknown>
  > {
    const mock: jestMock.Mocked<
      DependentTask<unknown, unknown, unknown[], unknown>
    > = {
      ...DependentTaskMocks.any,
      status: TaskStatus.NotStarted,
    };

    return mock;
  }

  public static get withStatusEnded(): jestMock.Mocked<
    DependentTask<unknown, unknown, unknown[], unknown>
  > {
    const mock: jestMock.Mocked<
      DependentTask<unknown, unknown, unknown[], unknown>
    > = {
      ...DependentTaskMocks.any,
      status: TaskStatus.Ended,
    };

    return mock;
  }
}
