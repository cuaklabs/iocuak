import { FlatPromise } from '../../common/models/FlatPromise';
import { MayBePromise } from '../../common/models/MayBePromise';
import { NonThenableProperties } from '../../common/models/NonThenableProperties';
import { isPromiseLike } from '../../utils/isPromiseLike';
import { DependentTask } from '../models/domain/DependentTask';

export class DependentTaskRunner {
  public run<TKind, TArgs extends unknown[], TReturn>(
    dependenTask: DependentTask<TKind, TArgs, TReturn>,
  ): MayBePromise<TReturn> {
    return this.#innerRun(dependenTask);
  }

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  #innerRun<TKind, TArgs extends unknown[], TReturn>(
    dependenTask: DependentTask<TKind, TArgs, TReturn>,
  ): MayBePromise<TReturn> {
    const dependenciesRunResults: unknown[] = dependenTask.dependencies.map(
      this.#innerRun.bind(this),
    );

    let result: MayBePromise<TReturn>;

    if (dependenciesRunResults.some(isPromiseLike)) {
      result = this.#innerRunDependenciesAsync(
        dependenTask,
        dependenciesRunResults,
      ) as MayBePromise<TReturn>;
    } else {
      result = this.#innerRunTask(
        dependenTask,
        dependenciesRunResults as NonThenableProperties<TArgs>,
      );
    }

    return result;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  async #innerRunDependenciesAsync<TKind, TArgs extends unknown[], TReturn>(
    dependenTask: DependentTask<TKind, TArgs, TReturn>,
    dependenciesRunResults: unknown[],
  ): FlatPromise<TReturn> {
    const dependenciesRunResultsResolved: unknown[] = await Promise.all(
      dependenciesRunResults,
    );

    const result: MayBePromise<TReturn> = this.#innerRunTask(
      dependenTask,
      dependenciesRunResultsResolved as NonThenableProperties<TArgs>,
    );

    return result as FlatPromise<TReturn>;
  }

  // eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
  #innerRunTask<TKind, TArgs extends unknown[], TReturn>(
    dependenTask: DependentTask<TKind, TArgs, TReturn>,
    dependenciesRunResults: NonThenableProperties<TArgs>,
  ): MayBePromise<TReturn> {
    const taskResult: TReturn = dependenTask.perform(...dependenciesRunResults);

    let result: MayBePromise<TReturn>;

    if (isPromiseLike(taskResult)) {
      result = Promise.resolve(taskResult) as MayBePromise<TReturn>;
    } else {
      result = taskResult as MayBePromise<TReturn>;
    }

    return result;
  }
}
