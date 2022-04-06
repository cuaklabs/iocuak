import { NonThenableProperties } from '../../../common/models/NonThenableProperties';
import { PromiseIfThenable } from '../../../common/models/PromiseIfThenable';
import { PromiseLikeResult } from '../../../common/models/PromiseLikeResult';
import { TaskStatus } from './TaskStatus';

/**
 * Task model
 */
export interface Task<TKind, TArgs extends unknown[], TReturn> {
  /**
   * Task kind.
   */
  readonly kind: TKind;
  readonly result:
    | PromiseIfThenable<TReturn>
    | PromiseLikeResult<TReturn>
    | undefined;
  /**
   * Task status.
   */
  readonly status: TaskStatus;
  /**
   * Performs the execution of a task.
   * @param args task execution arguments.
   * @returns task execution result.
   */
  perform(...args: NonThenableProperties<TArgs>): PromiseIfThenable<TReturn>;
}
