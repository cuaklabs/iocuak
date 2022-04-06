import { NonThenableProperties } from '../../../common/models/NonThenableProperties';
import { PromiseIfThenable } from '../../../common/models/PromiseIfThenable';
import { PromiseLikeResult } from '../../../common/models/PromiseLikeResult';
import { isPromiseLike } from '../../../utils/isPromiseLike';
import { Task } from './Task';
import { TaskStatus } from './TaskStatus';

export abstract class BaseTask<TKind, TArgs extends unknown[], TReturn>
  implements Task<TKind, TArgs, TReturn>
{
  #innerResult:
    | PromiseIfThenable<TReturn>
    | PromiseLikeResult<TReturn>
    | undefined;
  #innerStatus: TaskStatus;

  constructor(public readonly kind: TKind) {
    this.#innerStatus = TaskStatus.NotStarted;
  }

  public get result():
    | PromiseIfThenable<TReturn>
    | PromiseLikeResult<TReturn>
    | undefined {
    return this.#innerResult;
  }

  public get status(): TaskStatus {
    return this.#innerStatus;
  }

  public perform(
    ...args: NonThenableProperties<TArgs>
  ): PromiseIfThenable<TReturn> {
    if (this.#innerResult === undefined) {
      this.#innerStatus = TaskStatus.InProgress;

      try {
        const innerResult: TReturn = this.innerPerform(...args);

        if (isPromiseLike(innerResult)) {
          this.#innerResult = this.#awaitAsyncResult(
            innerResult,
          ) as PromiseIfThenable<TReturn>;
        } else {
          this.#innerResult = innerResult as PromiseIfThenable<TReturn>;
          this.#innerStatus = TaskStatus.Ended;
        }

        return this.#innerResult;
      } catch (error: unknown) {
        this.#innerStatus = TaskStatus.Error;

        throw error;
      }
    } else {
      throw new Error('A perform attemp has been already made');
    }
  }

  async #awaitAsyncResult<TSyncReturn>(
    result: PromiseLike<TSyncReturn>,
  ): Promise<TSyncReturn> {
    try {
      const syncResult: TSyncReturn = await result;

      this.#innerResult = syncResult as PromiseLikeResult<TReturn>;
      this.#innerStatus = TaskStatus.Ended;

      return syncResult;
    } catch (error: unknown) {
      this.#innerStatus = TaskStatus.Error;

      throw error;
    }
  }

  protected abstract innerPerform(
    ...args: NonThenableProperties<TArgs>
  ): TReturn;
}
