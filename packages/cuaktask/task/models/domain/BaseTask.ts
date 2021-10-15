import { NonThenableProperties } from '../../../common/models/NonThenableProperties';
import { PromiseIfThenable } from '../../../common/models/PromiseIfThenable';
import { isPromiseLike } from '../../../utils/isPromiseLike';
import { Task } from './Task';
import { TaskStatus } from './TaskStatus';

export abstract class BaseTask<TKind, TArgs extends unknown[], TReturn>
  implements Task<TKind, TArgs, PromiseIfThenable<TReturn>>
{
  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  #innerStatus: TaskStatus;

  constructor(public readonly kind: TKind) {
    this.#innerStatus = TaskStatus.NotStarted;
  }

  public get status(): TaskStatus {
    return this.#innerStatus;
  }

  public perform(
    ...args: NonThenableProperties<TArgs>
  ): PromiseIfThenable<TReturn> {
    this.#innerStatus = TaskStatus.InProgress;

    try {
      const innerResult: TReturn = this.innerPerform(...args);

      let result: PromiseIfThenable<TReturn>;

      if (isPromiseLike(innerResult)) {
        result = this.awaitAsyncResult(
          innerResult,
        ) as PromiseIfThenable<TReturn>;
      } else {
        result = innerResult as PromiseIfThenable<TReturn>;
        this.#innerStatus = TaskStatus.Ended;
      }

      return result;
    } catch (error: unknown) {
      this.#innerStatus = TaskStatus.Error;

      throw error;
    }
  }

  private async awaitAsyncResult<TSyncReturn>(
    result: PromiseLike<TSyncReturn>,
  ): Promise<TSyncReturn> {
    try {
      const syncResult: TSyncReturn = await result;

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
