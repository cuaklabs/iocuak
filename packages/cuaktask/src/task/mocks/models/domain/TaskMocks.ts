import { jest } from '@jest/globals';

import * as jestMock from 'jest-mock';

import { Task } from '../../../models/domain/Task';
import { TaskStatus } from '../../../models/domain/TaskStatus';

export class TaskMocks {
  public static get any(): jestMock.Mocked<Task<unknown>> {
    const mock: jestMock.Mocked<Task<unknown>> = {
      kind: 'kind',
      perform: jest.fn<(...args: unknown[]) => unknown>(),
      result: undefined,
      status: TaskStatus.NotStarted,
    };

    return mock;
  }

  public static get withStatusNothStarted(): jestMock.Mocked<Task<unknown>> {
    const mock: jestMock.Mocked<Task<unknown>> = {
      ...TaskMocks.any,
      status: TaskStatus.NotStarted,
    };

    return mock;
  }
}
