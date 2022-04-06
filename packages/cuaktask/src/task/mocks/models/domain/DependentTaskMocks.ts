import { DependentTask } from '../../../models/domain/DependentTask';
import { TaskStatus } from '../../../models/domain/TaskStatus';
import { TaskMocks } from './TaskMocks';

export class DependentTaskMocks {
  public static get any(): jest.Mocked<
    DependentTask<unknown, unknown, unknown[], unknown>
  > {
    const mock: jest.Mocked<
      DependentTask<unknown, unknown, unknown[], unknown>
    > = {
      ...TaskMocks.any,
      dependencies: [],
    };

    return mock;
  }

  public static get withDependenciesEmpty(): jest.Mocked<
    DependentTask<unknown, unknown, unknown[], unknown>
  > {
    const mock: jest.Mocked<
      DependentTask<unknown, unknown, unknown[], unknown>
    > = {
      ...DependentTaskMocks.any,
      dependencies: [],
    };

    return mock;
  }

  public static get withDependenciesEmptyAndStatusNotStarted(): jest.Mocked<
    DependentTask<unknown, unknown, unknown[], unknown>
  > {
    const mock: jest.Mocked<
      DependentTask<unknown, unknown, unknown[], unknown>
    > = {
      ...DependentTaskMocks.withDependenciesEmpty,
      status: TaskStatus.NotStarted,
    };

    return mock;
  }

  public static get withStatusNotStarted(): jest.Mocked<
    DependentTask<unknown, unknown, unknown[], unknown>
  > {
    const mock: jest.Mocked<
      DependentTask<unknown, unknown, unknown[], unknown>
    > = {
      ...DependentTaskMocks.any,
      status: TaskStatus.NotStarted,
    };

    return mock;
  }

  public static get withStatusEnded(): jest.Mocked<
    DependentTask<unknown, unknown, unknown[], unknown>
  > {
    const mock: jest.Mocked<
      DependentTask<unknown, unknown, unknown[], unknown>
    > = {
      ...DependentTaskMocks.any,
      status: TaskStatus.Ended,
    };

    return mock;
  }
}
