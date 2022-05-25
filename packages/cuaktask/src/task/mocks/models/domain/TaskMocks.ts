import { Task } from '../../../models/domain/Task';
import { TaskStatus } from '../../../models/domain/TaskStatus';

export class TaskMocks {
  public static get any(): jest.Mocked<Task<unknown>> {
    const mock: jest.Mocked<Task<unknown>> = {
      kind: 'kind',
      perform: jest.fn(),
      result: undefined,
      status: TaskStatus.NotStarted,
    };

    return mock;
  }

  public static get withStatusNothStarted(): jest.Mocked<Task<unknown>> {
    const mock: jest.Mocked<Task<unknown>> = {
      ...TaskMocks.any,
      status: TaskStatus.NotStarted,
    };

    return mock;
  }
}
