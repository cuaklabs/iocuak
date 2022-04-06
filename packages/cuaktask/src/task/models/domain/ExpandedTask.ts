import { NonThenableProperties } from '../../../common/models/NonThenableProperties';
import { PromiseIfThenable } from '../../../common/models/PromiseIfThenable';
import { PromiseLikeResult } from '../../../common/models/PromiseLikeResult';
import { TaskStatus } from './TaskStatus';

/**
 * Task model
 */
export type ExpandedTask<TKind, TArgs extends unknown[], TReturn> =
  | NotStartedTask<TKind, TArgs, TReturn>
  | InProgressTask<TKind, TArgs, TReturn>
  | EndedTask<TKind, TArgs, TReturn>
  | EndedWithErrorTask<TKind, TArgs>;

export interface BaseTask<
  TKind,
  TResult,
  TStatus extends TaskStatus,
  TArgs extends unknown[],
  TPerformResult,
> {
  /**
   * Task kind.
   */
  readonly kind: TKind;
  /**
   * Task result
   */
  readonly result: TResult;
  /**
   * Task status.
   */
  readonly status: TStatus;

  /**
   * Performs the execution of a task.
   * @param args task execution arguments.
   * @returns task execution result.
   */
  perform(...args: NonThenableProperties<TArgs>): TPerformResult;
}

export type NotStartedTask<TKind, TArgs extends unknown[], TReturn> = BaseTask<
  TKind,
  never,
  TaskStatus.NotStarted,
  TArgs,
  PromiseIfThenable<TReturn>
>;

export type InProgressTask<TKind, TArgs extends unknown[], TReturn> = BaseTask<
  TKind,
  PromiseIfThenable<TReturn>,
  TaskStatus.InProgress,
  TArgs,
  never
>;

export type EndedTask<TKind, TArgs extends unknown[], TReturn> = BaseTask<
  TKind,
  PromiseLikeResult<TReturn>,
  TaskStatus.Ended,
  TArgs,
  never
>;

export type EndedWithErrorTask<TKind, TArgs extends unknown[]> = BaseTask<
  TKind,
  never,
  TaskStatus.Error,
  TArgs,
  never
>;
