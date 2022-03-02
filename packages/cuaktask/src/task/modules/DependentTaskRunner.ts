import { FlatPromise } from '../../common/models/FlatPromise';
import { MayBePromise } from '../../common/models/MayBePromise';
import { NonThenableProperties } from '../../common/models/NonThenableProperties';
import { isPromiseLike } from '../../utils/isPromiseLike';
import { DependentTask } from '../models/domain/DependentTask';

export class DependentTaskRunner {
  /**
   * Performs a task execution.
   * @param dependenTask dependent task to run.
   * @returns Result of the task execution. It may be encapsulated into a Promise if a
   * dependent task execution is asyncronous.
   */
  public run<TKind, TDependencyKind, TArgs extends unknown[], TReturn>(
    dependenTask: DependentTask<TKind, TDependencyKind, TArgs, TReturn>,
  ): MayBePromise<TReturn> {
    return this.#innerRun(dependenTask);
  }

  #innerRun<TKind, TDependencyKind, TArgs extends unknown[], TReturn>(
    dependenTask: DependentTask<TKind, TDependencyKind, TArgs, TReturn>,
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

  async #innerRunDependenciesAsync<
    TKind,
    TDependencyKind,
    TArgs extends unknown[],
    TReturn,
  >(
    dependenTask: DependentTask<TKind, TDependencyKind, TArgs, TReturn>,
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

  #innerRunTask<TKind, TDependencyKind, TArgs extends unknown[], TReturn>(
    dependenTask: DependentTask<TKind, TDependencyKind, TArgs, TReturn>,
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
